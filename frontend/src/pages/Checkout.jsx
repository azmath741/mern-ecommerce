import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiShield,
  FiLock,
  FiTruck,
  FiArrowLeft,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ButtonLoader } from "../components/Loader";

const Checkout = () => {
  const { user } = useAuth();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Form state prefilled with user data
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "USA",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim())
      newErrors.address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          title: item.title,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await api.post("/orders", orderPayload);

      if (res.success && res.data) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-success/${res.data._id}`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <FiArrowLeft /> Return to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Finalize Order
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <FiLock /> 256-Bit SSL Encrypted
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Shipping + Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Information Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiTruck className="text-indigo-600" /> Shipping Details
                </h3>
                <span className="text-xs text-slate-400">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.fullName
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (for delivery updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.phone
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Way, Apt 4B"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.address
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.city
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State / Province */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="California"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.state
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="94103"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.postalCode
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none transition ${
                      errors.country
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.country && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiDollarSign className="text-indigo-600" /> Payment Selection
                </h3>
                <span className="text-xs text-slate-400">Step 2 of 2</span>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay conveniently in cash or local QR scan upon physical arrival of your parcel.
                    </p>
                  </div>
                </label>

                {/* Credit / Debit Card (Architecture ready) */}
                <label
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed bg-slate-50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    disabled
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FiCreditCard /> Credit / Debit Card (Stripe Gateway)
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Direct card processing integration ready for live merchant setup.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Items + Cost Total (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({cartItems.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="pt-2 flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Costs Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ${itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900">
                    ${taxPrice.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between text-base">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="font-black text-indigo-600 text-xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm transition shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <ButtonLoader text="Submitting Order..." />
                ) : (
                  <span>Place Order • ${totalPrice.toFixed(2)}</span>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                By clicking "Place Order", you agree to our Terms of Sale and authorize fulfillment.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

