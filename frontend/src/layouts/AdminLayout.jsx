import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiShoppingBag,
  FiUsers,
  FiArrowLeft,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Logged out from admin console");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/admin/products", label: "All Products", icon: FiBox, end: true },
    { to: "/admin/products/add", label: "Add Product", icon: FiPlusCircle },
    { to: "/admin/orders", label: "Orders Management", icon: FiShoppingBag },
    { to: "/admin/users", label: "Registered Users", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            <FiShield />
          </span>
          <span className="font-bold text-base tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-white"
        >
          {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
            <FiShield className="text-lg" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">
              LuxeMart Admin
            </h1>
            <p className="text-[11px] text-indigo-400 font-medium">Control Center</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`
                }
              >
                <Icon className="text-base flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <FiArrowLeft className="text-sm" />
            <span>Back to Storefront</span>
          </Link>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between px-2">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-white truncate">
                {user?.username || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
              title="Logout"
            >
              <FiLogOut className="text-base" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header - Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Store Management</h2>
            <p className="text-xs text-slate-500">Live system status and inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
            >
              View Live Store &rarr;
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-600">Database Online</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

