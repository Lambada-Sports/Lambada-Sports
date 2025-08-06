import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Update cart count when component mounts and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("lambada_cart") || "[]");
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();

    // Listen for storage changes (when items are added to cart)
    window.addEventListener("storage", updateCartCount);

    // Custom event for when cart is updated from same window
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login",
      },
      appState: { returnTo: location.pathname },
    });
  };

  return (
    <nav className="bg-zinc-400/20 shadow-md py-4">
      <div className="max-w-8xl mx-auto px-1 flex justify-between items-center">
        <div className="flex items-center space-x-2 ml-6">
          <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center gap-2 mr-6">
          <Link to="/">
            <button className=" text-black px-4 py-2 rounded hover:bg-green-500 transition">
              Home
            </button>
          </Link>

          {/* Cart Button */}
          <Link to="/cart">
            <button className="relative text-black px-4 py-2 rounded hover:bg-blue-500 transition flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </Link>

          {isLoading ? null : isAuthenticated ? (
            <>
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className=" text-black px-4 py-2 rounded hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className=" text-black px-4 py-2 rounded hover:bg-blue-500 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
