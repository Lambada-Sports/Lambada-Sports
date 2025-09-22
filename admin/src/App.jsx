import "./App.css";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManufacturerDashboard from "./pages/ManufacturerDashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function AppContent() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
