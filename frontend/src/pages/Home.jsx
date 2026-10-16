import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiShield,
  FiShoppingBag,
  FiZap,
} from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredRes = await api.get("/products?featured=true&limit=8");
        if (featuredRes.success) {
          setFeaturedProducts(featuredRes.data);
        }

        // Fetch latest new arrivals
        const latestRes = await api.get("/products?sort=newest&limit=4");
        if (latestRes.success) {
          setNewArrivals(latestRes.data);
        }

        // Fetch categories
        const catRes = await api.get("/products/categories");
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Error loading home page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categoryImages = {
    Electronics:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    Clothing:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
    Beauty:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    Home:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80",
    Accessories:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    Sports:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80",
    Books:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <FiZap className="text-amber-400" />
                <span>Next-Gen MERN E-Commerce Experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Curated Luxury for Modern Living.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover masterfully crafted audio gear, timeless apparel, and contemporary living essentials. Built for those who appreciate understated elegance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
                >
                  <FiShoppingBag className="text-base" />
                  <span>Explore Collection</span>
                </Link>

                <Link
                  to="/shop?category=Electronics"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition backdrop-blur-md"
                >
                  <span>Featured Electronics</span>
                  <FiArrowRight />
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">20+</span>
                  <span>Premium Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">100%</span>
                  <span>Authentic Items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">Fast</span>
                  <span>Global Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Feature */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Sony Wireless Headphones"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-left">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                    Spotlight Deal
                  </span>
                  <h3 className="text-base font-bold text-white truncate">
                    Sony WH-1000XM5 Wireless Headphones
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-black text-white">$349.99</span>
                    <Link
                      to="/shop?category=Electronics"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                    >
                      Shop Now &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore by Department
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a category to filter products instantly
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
          >
            <span>Browse All</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center p-3"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={
                    categoryImages[cat] ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80"
                  }
                  alt={cat}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              <FiTrendingUp /> Handpicked Items
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
          >
            <span>View All Featured</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-800/40">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
              Limited Time Event
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Upgrade Your Everyday Carry. Enjoy 15% Off Select Lines.
            </h3>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-normal">
              From titanium smartwatches to Italian leather travel bags. Free shipping on every order over $100.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-slate-100 transition shadow-md hover:scale-105 active:scale-95"
              >
                <span>Shop the Promo</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Freshly added to the catalog this week
            </p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
          >
            <span>See New Drops</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

