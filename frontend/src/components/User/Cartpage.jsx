import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("lambada_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lambada_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove item from cart
  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = 1500;
      return total + price * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Navigate to checkout page with cart data
    navigate("/checkout", {
      state: {
        cartItems,
        total: calculateTotal(),
      },
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-100 py-10 px-4">
        {/* Background Logo */}
        <img
          src="/assets/logo.png"
          alt="Background Logo"
          className="absolute w-[300px] opacity-5 animate-spin-slow"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotateY(0deg)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800 font-michroma">
                Your Cart
              </h1>
            </div>
            <p className="text-center text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Start designing your custom jersey!
              </p>
              <button
                onClick={() => navigate("/select-sport")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Designing
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Design Image */}
                      {item.designImage && (
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 bg-gray-50 rounded-lg p-2 border">
                            <img
                              src={item.designImage}
                              alt="Custom Design"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-1">
                            Custom Design
                          </p>
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Custom {item.sport} Jersey
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                          <div>
                            <span className="font-medium text-gray-600">
                              Sport:
                            </span>
                            <p className="text-blue-600 font-semibold">
                              {item.sport}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Fit:
                            </span>
                            <p className="text-blue-600 font-semibold">
                              {item.fit}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Style:
                            </span>
                            <p className="text-blue-600 font-semibold">
                              {item.style}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Size:
                            </span>
                            <p className="text-blue-600 font-semibold">
                              {item.size}
                            </p>
                          </div>
                        </div>

                        {item.address && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-600">
                              Delivery Address:
                            </span>
                            <p className="text-gray-700 text-sm">
                              {item.address}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-600">
                              Quantity:
                            </span>
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(index, item.quantity - 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(index, item.quantity + 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-800">
                                Rs. {(1500 * item.quantity).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rs. 1,500 each
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary & Checkout */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Total Amount
                      </h3>
                      <p className="text-gray-600">
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        Rs. {calculateTotal().toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Including all taxes
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate("/select-sport")}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
