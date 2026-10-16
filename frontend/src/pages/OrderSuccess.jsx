import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiFileText,
  FiTruck,
  FiArrowRight,
} from "react-icons/fi";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8">
      {/* Icon */}
      <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
        <FiCheckCircle />
      </div>

      {/* Message */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank You For Your Purchase!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          We've received your order and have begun prepping your parcel for dispatch.
          A confirmation with tracking details has been generated.
        </p>
      </div>

      {/* Order ID Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-2">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Order Reference Identifier
        </p>
        <p className="text-sm sm:text-base font-mono font-bold text-slate-800 break-all select-all bg-slate-50 py-2 px-3 rounded-lg border border-slate-200">
          {id}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 pt-2 font-medium">
          <FiTruck />
          <span>Fulfillment: Standard Delivery (2-4 business days)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-200 active:scale-95"
        >
          <FiFileText className="text-sm" />
          <span>View Order Details</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition active:scale-95"
        >
          <FiShoppingBag className="text-sm" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

