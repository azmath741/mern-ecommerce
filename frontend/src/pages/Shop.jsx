import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiSliders,
  FiCheck,
  FiRotateCcw,
} from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL query parameters
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "All";
  const sortParam = searchParams.get("sort") || "newest";
  const featuredParam = searchParams.get("featured") === "true";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter inputs
  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  // Keep search input in sync if URL changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/products/categories");
        if (res.success) {
          setCategories(["All", ...res.data]);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (searchParam) queryParams.set("search", searchParam);
        if (categoryParam && categoryParam !== "All")
          queryParams.set("category", categoryParam);
        if (sortParam) queryParams.set("sort", sortParam);
        if (featuredParam) queryParams.set("featured", "true");
        if (minPriceParam) queryParams.set("minPrice", minPriceParam);
        if (maxPriceParam) queryParams.set("maxPrice", maxPriceParam);
        queryParams.set("page", pageParam);
        queryParams.set("limit", 12);

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.success) {
          setProducts(res.data);
          setTotal(res.total);
          setPages(res.pages);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchParam,
    categoryParam,
    sortParam,
    featuredParam,
    pageParam,
    minPriceParam,
    maxPriceParam,
  ]);

  // Handlers for URL parameter updates
  const updateQueryParam = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Whenever filters change (except direct page change), reset to page 1
    if (!updates.page) {
      newParams.set("page", 1);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: searchInput.trim() || null });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateQueryParam({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
    setShowMobileFilter(false);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchParams({});
    setShowMobileFilter(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner & Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Shop The Collection
        </h1>
        <p className="text-sm text-slate-500">
          Showing {total} {total === 1 ? "product" : "products"} available for delivery
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FiFilter /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <FiRotateCcw className="text-[10px]" /> Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      updateQueryParam({
                        category: cat === "All" ? null : cat,
                      })
                    }
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      (categoryParam === cat) ||
                      (cat === "All" && categoryParam === "All")
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    {((categoryParam === cat) ||
                      (cat === "All" && categoryParam === "All")) && (
                      <FiCheck className="text-indigo-600 text-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Price Range ($)
              </h3>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                >
                  Apply Filter
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilter(false)}
            ></div>
            <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateQueryParam({
                            category: cat === "All" ? null : cat,
                          });
                          setShowMobileFilter(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                          (categoryParam === cat) ||
                          (cat === "All" && categoryParam === "All")
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Price Range ($)
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={handlePriceApply}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Search, Mobile filter toggle, Sort */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQueryParam({ search: null });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
              >
                <FiSliders /> Filters
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  Sort:
                </span>
                <select
                  value={sortParam}
                  onChange={(e) => updateQueryParam({ sort: e.target.value })}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="newest">Newest Additions</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="top-rated">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {(searchParam ||
            (categoryParam && categoryParam !== "All") ||
            minPriceParam ||
            maxPriceParam ||
            featuredParam) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active filters:</span>
              {searchParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  Search: "{searchParam}"
                  <button onClick={() => updateQueryParam({ search: null })}>
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
              {categoryParam && categoryParam !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  {categoryParam}
                  <button onClick={() => updateQueryParam({ category: null })}>
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  ${minPriceParam || 0} - ${maxPriceParam || "Any"}
                  <button
                    onClick={() =>
                      updateQueryParam({ minPrice: null, maxPrice: null })
                    }
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <ProductSkeleton count={9} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your criteria"
              description="Try adjusting your search terms, categories, or price filter range."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={pageParam}
            pages={pages}
            onPageChange={(p) => updateQueryParam({ page: p })}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;

