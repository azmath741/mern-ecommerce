import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

const Cart = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={FiShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any luxury pieces or essentials to your bag yet."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected items before proceeding to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FiTrash2 /> Clear Entire Cart
        </button>
      </div>

      {/* Main Grid: Item List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table / Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/product/${item.product}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <Link
                    to={`/product/${item.product}`}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Unit Price: ${item.price.toFixed(2)}
                  </p>
                  {item.quantity > item.stock && (
                    <p className="text-xs font-semibold text-rose-600">
                      Only {item.stock} in stock! Please reduce quantity.
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="p-2 text-slate-600 hover:bg-slate-200 transition"
                    title="Decrease quantity"
                  >
                    <FiMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Increase quantity"
                  >
                    <FiPlus className="text-xs" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Remove item"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <Link
              to="/shop"
              className="text-indigo-600 hover:underline font-semibold"
            >
              &larr; Continue Shopping
            </Link>
            <span>Prices are in USD and include basic processing.</span>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${itemsPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold text-[11px]">
                      FREE
                    </span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>

              {itemsPrice < 100 && (
                <p className="text-[11px] text-indigo-600 bg-indigo-50 p-2 rounded-lg leading-relaxed">
                  Add ${(100 - itemsPrice).toFixed(2)} more of eligible items to get free shipping!
                </p>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">
                  ${taxPrice.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-black text-indigo-600 text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>

            {/* Badges */}
            <div className="pt-2 flex flex-col gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <FiTruck className="text-indigo-600 text-sm" />
                <span>Standard delivery: 2–4 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-indigo-600 text-sm" />
                <span>100% Secure Checkout guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

