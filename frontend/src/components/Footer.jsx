import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
} from "react-icons/fi";
import { useToast } from "../context/ToastContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thank you for subscribing to LuxeMart newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
              <FiTruck />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all domestic orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
              <FiShield />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Checkout</h4>
              <p className="text-xs text-slate-400">Protected with 256-bit encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
              <FiRefreshCw />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
              <FiHeadphones />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Instant expert chat assistance</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-extrabold text-2xl text-white tracking-tight mb-4"
            >
              <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                L
              </span>
              <span>
                Luxe<span className="text-indigo-400">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Curated premium lifestyle essentials, cutting-edge electronics, and modern apparel crafted for contemporary living.
            </p>
            <form onSubmit={handleNewsletter} className="max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
              >
                <span>Join</span>
                <FiArrowRight />
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link to="/shop?category=Electronics" className="hover:text-white transition">Electronics</Link>
              </li>
              <li>
                <Link to="/shop?category=Clothing" className="hover:text-white transition">Clothing & Fashion</Link>
              </li>
              <li>
                <Link to="/shop?category=Home" className="hover:text-white transition">Home & Kitchen</Link>
              </li>
              <li>
                <Link to="/shop?category=Beauty" className="hover:text-white transition">Health & Beauty</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-white transition">Track Order</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">My Account</Link>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Shipping & Delivery</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Returns & Exchanges</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              100 Market St, Suite 400<br />
              San Francisco, CA 94105
            </p>
            <p className="text-sm text-slate-400 mb-1">
              Email: <span className="text-white">support@luxemart.com</span>
            </p>
            <p className="text-sm text-slate-400">
              Mon - Fri: 9:00 AM - 6:00 PM EST
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuxeMart Inc. All rights reserved. MERN Stack E-Commerce Platform.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Security</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

