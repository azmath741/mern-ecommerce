import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import Rating from "./Rating";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Visual old price calculation for premium shopping feel
  const hasDiscount = product.featured || product.price > 100;
  const originalPrice = hasDiscount ? (product.price * 1.2).toFixed(2) : null;
  const discountPercent = hasDiscount ? 15 : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <Link
        to={`/product/${product._id}`}
        className="relative block w-full aspect-square overflow-hidden bg-slate-100"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-indigo-600 text-white shadow-sm">
              Featured
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-rose-500 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900/80 text-white backdrop-blur-md">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500 text-white shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        {/* Quick View Hover Indicator */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FiEye className="text-sm" /> View Details
          </span>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 truncate">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-xs text-slate-400 font-medium truncate max-w-[100px]">
              {product.brand}
            </span>
          )}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2 min-h-[2.5rem]"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <Rating
            value={product.rating}
            text={`(${product.numReviews || 0})`}
            size="text-xs"
          />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white active:scale-95 shadow-sm"
            }`}
            title={isOutOfStock ? "Out of stock" : "Add to Cart"}
          >
            <FiShoppingCart className="text-sm" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

