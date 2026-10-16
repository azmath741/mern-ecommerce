import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPlusCircle,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";
import { ScreenLoader } from "../../components/Loader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/stats/overview");
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <ScreenLoader message="Loading dashboard telemetry..." />;
  }

  const {
    totalProducts = 0,
    totalOrders = 0,
    totalUsers = 0,
    totalRevenue = 0,
    statusBreakdown = {},
    recentOrders = [],
    recentProducts = [],
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics and inventory health synced with MongoDB
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
          >
            <FiPlusCircle />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            <FiShoppingBag />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <p className="text-2xl font-black text-slate-900">
              ${Number(totalRevenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <FiArrowUpRight /> Validated orders
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            <FiDollarSign />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Across all lifecycles
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
            <FiShoppingBag />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Catalog
            </span>
            <p className="text-2xl font-black text-slate-900">{totalProducts}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Products in database
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl">
            <FiBox />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customers
            </span>
            <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Registered user accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
            <FiUsers />
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Fulfillment Status Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Pending</p>
            <p className="text-lg font-black text-slate-800">
              {statusBreakdown.Pending || 0}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700">Processing</p>
            <p className="text-lg font-black text-amber-800">
              {statusBreakdown.Processing || 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700">Shipped</p>
            <p className="text-lg font-black text-blue-800">
              {statusBreakdown.Shipped || 0}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700">Delivered</p>
            <p className="text-lg font-black text-emerald-800">
              {statusBreakdown.Delivered || 0}
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700">Cancelled</p>
            <p className="text-lg font-black text-rose-800">
              {statusBreakdown.Cancelled || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all ({totalOrders}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No orders registered yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      #{order._id.substring(order._id.length - 8).toUpperCase()} •{" "}
                      {order.user?.username || "Guest"}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {order.orderItems?.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      ${Number(order.totalPrice).toFixed(2)}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "Processing"
                          ? "bg-amber-50 text-amber-700"
                          : order.status === "Shipped"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Added Products (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Inventory Additions
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              All products &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProducts.map((p) => (
              <div
                key={p._id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate" title={p.title}>
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {p.category} • Stock:{" "}
                      <span
                        className={
                          p.stock <= 5 ? "text-amber-600 font-bold" : "text-slate-600"
                        }
                      >
                        {p.stock}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 whitespace-nowrap">
                  ${p.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

