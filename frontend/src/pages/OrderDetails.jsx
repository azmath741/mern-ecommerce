import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiTruck,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiCreditCard,
  FiClock,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";
import api from "../services/api";
import { ScreenLoader } from "../components/Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/orders/${id}`);
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <ScreenLoader message="Fetching order details..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "Could not locate this order."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          <FiArrowLeft /> Back to My Orders
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <FiCheckCircle /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <FiTruck /> In Transit / Shipped
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <FiClock /> Order Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <FiXCircle /> Order Cancelled
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
            <FiClock /> Order Received (Pending)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <FiArrowLeft /> Back to All Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="self-start sm:self-auto flex items-center gap-3">
          {getStatusBadge(order.status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {order.isPaid ? "Paid in Full" : "Payment Pending"}
          </span>
        </div>
      </div>

      {/* Main Grid: Details + Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Items & Delivery (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Purchased Items ({order.orderItems?.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FiMapPin className="text-indigo-600" /> Shipping & Recipient Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Recipient Name
                </span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FiUser /> {order.shippingAddress?.fullName}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Contact Phone
                </span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FiPhone /> {order.shippingAddress?.phone}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-2 border-t border-slate-50">
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Destination Address
                </span>
                <p className="font-medium text-slate-700 leading-relaxed">
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Payment (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${Number(order.itemsPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900">
                  {order.shippingPrice === 0
                    ? "FREE"
                    : `$${Number(order.shippingPrice).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">
                  ${Number(order.taxPrice).toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-black text-indigo-600 text-lg">
                  ${Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                Payment Channel
              </span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {order.paymentMethod}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    order.isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Due on Delivery"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

