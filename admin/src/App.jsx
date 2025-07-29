import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManufacturerDashboard from "./pages/ManufacturerDashboard.jsx";
import Login from "./pages/Adminlogin.jsx";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const roles = user["https://sports-system.com/roles"];

      if (roles?.includes("admin")) {
        navigate("/admin");
      } else if (roles?.includes("manufacturer")) {
        navigate("/manufacturer");
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <div className="App">
      {!isAdminRoute}
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
