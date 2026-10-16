import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiZap,
  FiCheck,
  FiTruck,
  FiShield,
  FiArrowLeft,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import api from "../services/api";
import Rating from "../components/Rating";
import ProductCard from "../components/ProductCard";
import { ScreenLoader } from "../components/Loader";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/products/${id}`);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.image);
          setQuantity(1);

          // Fetch related products in the same category
          const relatedRes = await api.get(
            `/products?category=${encodeURIComponent(res.data.category)}&limit=4`
          );
          if (relatedRes.success) {
            setRelatedProducts(
              relatedRes.data.filter((p) => p._id !== res.data._id)
            );
          }
        }
      } catch (err) {
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return <ScreenLoader message="Loading product information..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The item you requested does not exist."}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const nextVal = prev + delta;
      if (nextVal < 1) return 1;
      if (nextVal > product.stock) return product.stock;
      return nextVal;
    });
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery / Images (Left - 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm relative group">
            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                Featured Item
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === img
                      ? "border-indigo-600 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form (Right - 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs font-semibold text-slate-500">
                  By {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <Rating
                value={product.rating}
                text={`${product.rating.toFixed(1)} / 5.0 (${product.numReviews} customer reviews)`}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-sm text-slate-400 line-through">
              ${(product.price * 1.2).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
              Save 20%
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Stock availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Availability:
            </span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                Low Stock — Only {product.stock} items remaining
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <FiCheck /> In Stock ({product.stock} units ready to ship)
              </span>
            )}
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isOutOfStock || quantity <= 1}
                  className="p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <FiPlus className="text-xs" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                <FiShoppingCart className="text-base" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-indigo-200"
              >
                <FiZap className="text-base" />
                <span>Buy It Now</span>
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <FiTruck className="text-indigo-600 text-sm" />
              <span>Complimentary insured shipping on all orders over $100</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiShield className="text-indigo-600 text-sm" />
              <span>Full 30-day money-back satisfaction guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              More in {product.category}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You might also be interested in these complementary selections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

