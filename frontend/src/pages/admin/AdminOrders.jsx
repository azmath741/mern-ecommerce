import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiEye,
  FiFilter,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../services/api";
import { ScreenLoader } from "../../components/Loader";
import { useToast } from "../../context/ToastContext";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      if (res.success && res.data) {
        setOrders(res.data);
        setFilteredOrders(res.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  isPaid: newStatus === "Delivered" ? true : o.isPaid,
                }
              : o
          )
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Pending":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Orders Fulfillment Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track shipping schedules, update delivery stages, and verify COD receipts ({orders.length} total)
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold self-start sm:self-auto transition"
        >
          <FiRefreshCw /> Refresh List
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FiFilter /> Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredOrders.length} records
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20">
            <ScreenLoader message="Loading orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <FiShoppingBag className="text-3xl mx-auto text-slate-300" />
            <p>No orders found for this filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Current Status</th>
                  <th className="py-4 px-6">Update Stage</th>
                  <th className="py-4 px-6 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">
                        {order.shippingAddress?.fullName || order.user?.username || "Guest"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {order.user?.email || "No email"}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ${Number(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          order.isPaid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none cursor-pointer focus:border-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Order Inspect Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">
                  Recipient: {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})
                </p>
                <p className="text-slate-500">
                  Address: {selectedOrder.shippingAddress?.address},{" "}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                  {selectedOrder.shippingAddress?.postalCode},{" "}
                  {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px]">
                  Ordered Items:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-2 divide-y divide-slate-100">
                  {selectedOrder.orderItems?.map((item, i) => (
                    <div key={i} className="pt-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="font-medium text-slate-800 truncate max-w-xs">
                          {item.title}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm">
                <span>Grand Total:</span>
                <span className="text-indigo-600">
                  ${Number(selectedOrder.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

