/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Search,
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
} from "lucide-react";

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateRange: "",
  });
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");

  // Production Orders Data
  const productionOrders = [
    {
      id: "PRD-001",
      products: [
        {
          name: "Football Jersey ",
        },
        { name: "Matching Shorts" },
      ],
      totalQuantity: 2,
      deadline: "2025-01-28",
      status: "In Production",
      priority: "High",
      customer: {
        name: "John Martinez",
        email: "john@bluelionsfc.com",
      },
      assignedDate: "2025-01-15",
      assets: {
        available: true,
        files: ["design_specs.pdf", "logo_files.zip", "size_chart.pdf"],
        templates: 3,
      },
    },
    {
      id: "PRD-002",
      products: [
        {
          name: "Basketball Jersey ",
        },
      ],
      totalQuantity: 4,
      deadline: "2025-02-05",
      status: "Materials Sourcing",
      priority: "Medium",
      customer: {
        name: "Sarah Williams",
        email: "sarah@thunderhoops.com",
      },
      assignedDate: "2025-01-18",
      assets: {
        available: true,
        files: ["jersey_design.ai", "number_templates.zip"],
        templates: 2,
      },
    },
  ];

  // Helper functions for production status styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Ready to Ship":
        return "bg-green-100 text-green-800";

      case "In Production":
        return "bg-yellow-100 text-yellow-800";

      case "Design Review":
        return "bg-purple-100 text-purple-800";
      case "On Hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ready to Ship":
        return <CheckCircle className="h-4 w-4 text-green-600" />;

      case "In Production":
        return <Package className="h-4 w-4 text-yellow-600" />;

      case "Design Review":
        return <FileText className="h-4 w-4 text-purple-600" />;
      case "On Hold":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return "text-red-600 font-bold"; // Overdue
    if (days <= 3) return "text-red-500 font-semibold"; // Urgent
    if (days <= 7) return "text-yellow-600 font-medium"; // Soon
    return "text-gray-600"; // Normal
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(productionOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
    setShowBulkActions(checked && productionOrders.length > 0);
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      const newSelected = [...selectedOrders, orderId];
      setSelectedOrders(newSelected);
      setShowBulkActions(newSelected.length > 0);
    } else {
      const newSelected = selectedOrders.filter((id) => id !== orderId);
      setSelectedOrders(newSelected);
      setShowBulkActions(newSelected.length > 0);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for production orders:`, selectedOrders);
    // Implement bulk actions here
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Changing production order ${orderId} status to ${newStatus}`);
    // Implement status change logic here
  };

  const handleDownloadAssets = (orderId) => {
    const order = productionOrders.find((o) => o.id === orderId);
    if (order && order.assets.available) {
      console.log(
        `Downloading assets for order ${orderId}:`,
        order.assets.files
      );
      // Implement asset download logic here
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Production Orders
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {productionOrders.length}
                </p>
                <p className="text-sm text-gray-500">Assigned to you</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  In Production
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    productionOrders.filter(
                      (order) =>
                        order.status === "In Production" ||
                        order.status === "Quality Check"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Currently active</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Ready to Ship
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {
                    productionOrders.filter(
                      (order) => order.status === "Ready to Ship"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Completed orders</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Urgent Orders
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {
                    productionOrders.filter(
                      (order) =>
                        order.priority === "High" &&
                        getDaysUntilDeadline(order.deadline) <= 3
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Due within 3 days</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Product, or Customer..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Materials Sourcing">
                        Materials Sourcing
                      </option>
                      <option value="In Production">In Production</option>
                      <option value="Ready to Ship">Ready to Ship</option>
                      <option value="On Hold">On Hold</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.priority}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="">All Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="bg-blue-50 border-b border-blue-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedOrders.length} order(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("start-production")}
                        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Start Production
                      </button>

                      <button
                        onClick={() => handleBulkAction("ready-to-ship")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark Ready
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order List Content */}
              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {productionOrders.slice(0, 5).map((order, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) =>
                              handleSelectOrder(order.id, e.target.checked)
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              {getStatusIcon(order.status)}
                              <span className="ml-2">{order.id}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {order.assets.available && (
                            <button
                              onClick={() => handleDownloadAssets(order.id)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority} Priority
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Quantity:</span>{" "}
                          {order.totalQuantity}
                        </p>
                        <p className={getDeadlineColor(order.deadline)}>
                          <span className="font-medium">Deadline:</span>{" "}
                          {order.deadline}
                          <span className="ml-2">
                            ({getDaysUntilDeadline(order.deadline)} days)
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Product:</span>{" "}
                          {order.products[0].name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            checked={
                              selectedOrders.length ===
                                productionOrders.length &&
                              productionOrders.length > 0
                            }
                          />
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Product(s)
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Deadline
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Assets
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionOrders.map((order, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            selectedOrders.includes(order.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedOrders.includes(order.id)}
                                onChange={(e) =>
                                  handleSelectOrder(order.id, e.target.checked)
                                }
                              />
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  <span className="ml-2">{order.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.products.map((product, idx) => (
                                <div key={idx} className="mb-2">
                                  <div className="font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 text-lg">
                              {order.totalQuantity}
                            </div>
                            <div className="text-xs text-gray-500">pieces</div>
                          </td>
                          <td className="py-3 px-4">
                            <div
                              className={`font-medium ${getDeadlineColor(
                                order.deadline
                              )}`}
                            >
                              {order.deadline}
                            </div>

                            <span
                              className={`px-1 py-0.5 text-xs rounded border ${getPriorityColor(
                                order.priority
                              )}`}
                            >
                              {order.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              <option value="Design Review">
                                Design Review
                              </option>

                              <option value="In Production">
                                In Production
                              </option>

                              <option value="Ready to Ship">
                                Ready to Ship
                              </option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900 flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {order.customer.name}
                              </div>

                              <div className="text-xs text-gray-500">
                                {order.customer.email}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col space-y-2">
                              {order.assets.available ? (
                                <button
                                  onClick={() => handleDownloadAssets(order.id)}
                                  className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  {order.assets.files.length} files
                                </button>
                              ) : (
                                <div className="flex items-center px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Pending
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing 1 to {productionOrders.length} of{" "}
                    {productionOrders.length} production orders
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
