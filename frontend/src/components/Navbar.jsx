import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out");
    setUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight flex-shrink-0"
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <span className="text-xl font-black">L</span>
            </span>
            <span>
              Luxe<span className="text-indigo-600">Mart</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`hover:text-indigo-600 transition-colors ${
                location.pathname === "/" ? "text-indigo-600 font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`hover:text-indigo-600 transition-colors ${
                location.pathname === "/shop" ? "text-indigo-600 font-bold" : ""
              }`}
            >
              Shop
            </Link>
            <Link
              to="/shop?category=Electronics"
              className="hover:text-indigo-600 transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/shop?category=Clothing"
              className="hover:text-indigo-600 transition-colors"
            >
              Clothing
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-xs xl:max-w-md mx-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-500 rounded-full outline-none transition duration-200 shadow-inner"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="View Cart"
            >
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm animate-scale">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Buttons */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm uppercase">
                    {user.username ? user.username.charAt(0) : "U"}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[100px] truncate text-slate-800">
                    {user.username}
                  </span>
                  <FiChevronDown className="hidden sm:inline-block text-slate-400 text-xs" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <FiUser className="text-sm" /> Profile Settings
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <FiPackage className="text-sm" /> My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                      >
                        <FiShield className="text-sm text-indigo-600" /> Admin Portal
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <FiLogOut className="text-sm" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl md:hidden text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 flex flex-col gap-4 animate-in fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            </form>

            <nav className="flex flex-col gap-2 font-medium text-slate-700">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                Shop All Products
              </Link>
              <Link
                to="/shop?category=Electronics"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                Electronics
              </Link>
              <Link
                to="/shop?category=Clothing"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                Clothing
              </Link>
              <Link
                to="/shop?category=Home"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                Home & Living
              </Link>

              {user ? (
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold transition"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2 text-center rounded-xl border border-slate-200 text-slate-700 font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

