// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-zinc-400/20 shadow-md py-4">
      <div className="max-w-8xl mx-auto px-1 flex justify-between items-center">
        {/* Left: Logo + App Name */}
        <div className="flex items-center space-x-2 ml-6">
          <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Right: Login Button */}
        <div>
          <Link to="/">
            <button className="bg-zing-500 text-black px-4 py-2 rounded hover:bg-zing-700 transition">
              Home
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-zing-500 text-black px-4 py-2 rounded hover:bg-zing-700 transition mr-4">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
