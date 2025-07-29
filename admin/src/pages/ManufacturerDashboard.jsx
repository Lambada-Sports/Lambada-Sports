import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Sidebar from "../components/ManufacturerSidebar";
import { Menu } from "lucide-react";
import Orders from "./manufacturerLayouts/orders";
import Dashboard from "./manufacturerLayouts/dashboard";

const ManufacturerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const { logout } = useAuth0();

  const handleSidebarItemClick = (item) => {
    setActivePage(item.label);
    // Close sidebar on mobile after selection
    setIsSidebarOpen(false);
    console.log("Navigation to:", item.path);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const renderPageContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Orders":
        return <Orders />;

      default:
        return (
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Dashboard
              </h1>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-gray-600">Welcome to the Dashboard!</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem={activePage}
        onItemClick={handleSidebarItemClick}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {activePage}
            </h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        {renderPageContent()}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
