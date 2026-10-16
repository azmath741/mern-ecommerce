import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiEye,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";
import api from "../services/api";
import { ScreenLoader } from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/myorders");
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="text-xs" /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FiTruck className="text-xs" /> Shipped
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock className="text-xs" /> Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle className="text-xs" /> Cancelled
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FiClock className="text-xs" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return <ScreenLoader message="Retrieving your orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={FiPackage}
          title="No Orders Found"
          description="You haven't placed any orders with us yet. Explore our curated collections to get started."
          actionText="Explore Collection"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review details and track the progress of your past purchases ({orders.length} total)
        </p>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">
                        {order.orderItems?.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                      </span>
                      <span>items</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition"
                    >
                      <FiEye className="text-xs" />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Stack View */}
        <div className="md:hidden divide-y divide-slate-100">
          {orders.map((order) => (
            <div key={order._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-800">
                  #{order._id.substring(order._id.length - 8).toUpperCase()}
                </span>
                {getStatusBadge(order.status)}
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span>
                  {order.orderItems?.length} products (
                  {order.orderItems?.reduce((acc, i) => acc + i.quantity, 0)} total)
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">
                  ${Number(order.totalPrice).toFixed(2)}
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs"
                >
                  <FiEye /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

