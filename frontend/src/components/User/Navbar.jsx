import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const location = useLocation();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login",
      },
      appState: { returnTo: location.pathname },
    });
  };

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
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
            <button className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-700 transition">
              Home
            </button>
          </Link>

          {isLoading ? null : isAuthenticated ? (
            <>
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
