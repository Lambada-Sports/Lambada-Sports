/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Search,
  Download,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
} from "lucide-react";

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    dateRange: "",
  });
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const orderData = [
    {
      id: "ORD-001",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 234 567 8900",
      },
      orderDate: "2024-07-19",
      products: [
        { name: "Cricket Jersey", quantity: 2, price: 500 },
        { name: "Football Jersey", quantity: 1, price: 600 },
      ],
      totalAmount: 1600,
      assignedManufacturer: "Elite Sports",
      status: "Processing",
      paymentStatus: "Paid",
      deliveryDate: "2024-07-25",
    },
    {
      id: "ORD-002",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 234 567 8901",
      },
      orderDate: "2024-07-18",
      products: [{ name: "Basketball Jersey", quantity: 3, price: 550 }],
      totalAmount: 1650,
      assignedManufacturer: "SportsTech Ltd",
      status: "Shipped",
      paymentStatus: "Paid",
      deliveryDate: "2024-07-24",
    },
    {
      id: "ORD-003",
      customer: {
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "+1 234 567 8902",
      },
      orderDate: "2024-07-17",
      products: [{ name: "Cricket Jersey", quantity: 1, price: 500 }],
      totalAmount: 500,
      assignedManufacturer: "Pro Athletic",
      status: "Pending",
      paymentStatus: "Pending",
      deliveryDate: "2024-07-26",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orderData.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
    setShowBulkActions(checked && orderData.length > 0);
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
    console.log(`Bulk ${action} for orders:`, selectedOrders);
    // Implement bulk actions here
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // Implement status change logic here
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "Processing":
        return <Package className="h-4 w-4 text-yellow-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
              Order Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {orderData.length}
                </p>
                <p className="text-sm text-gray-500">All time orders</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Pending Orders
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    orderData.filter(
                      (order) =>
                        order.status === "Pending" ||
                        order.status === "Processing"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Need attention</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Delivered Orders
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {
                    orderData.filter((order) => order.status === "Delivered")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-500">Successfully completed</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  Rs.
                  {orderData
                    .filter((order) => order.paymentStatus === "Paid")
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">From completed orders</p>
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
                        placeholder="Search orders by ID, customer name, or email..."
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
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.paymentStatus}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Payment Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>

                    <input
                      type="date"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters({ ...filters, dateRange: e.target.value })
                      }
                    />
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
                        onClick={() => handleBulkAction("ship")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleBulkAction("deliver")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleBulkAction("cancel")}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel Orders
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order List Header */}
              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {orderData.slice(0, 5).map((order, index) => (
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
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Amount:</span> ₹
                          {order.totalAmount.toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Payment:</span>{" "}
                          <span
                            className={`px-1 py-0.5 text-xs rounded ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {order.orderDate}
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
                              selectedOrders.length === orderData.length &&
                              orderData.length > 0
                            }
                          />
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Products
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Assigned Manufacturer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Payment
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.map((order, index) => (
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
                                  {getStatusIcon(order.status)}
                                  <span className="ml-2">{order.id}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.orderDate}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {order.customer.phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.products.map((product, idx) => (
                                <div key={idx} className="mb-1">
                                  <span className="font-medium">
                                    {product.name}
                                  </span>
                                  <span className="text-gray-500">
                                    {" "}
                                    x{product.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900">
                              Rs.{order.totalAmount.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900">
                              {order.assignedManufacturer}
                            </div>
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
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                title="Edit Order"
                              >
                                <Edit className="h-4 w-4" />
                              </button>

                              <button
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Cancel Order"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
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
                    Showing 1 to {orderData.length} of {orderData.length} orders
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
