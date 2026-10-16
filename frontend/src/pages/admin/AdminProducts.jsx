import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiAlertCircle,
  FiBox,
} from "react-icons/fi";
import api from "../../services/api";
import { ScreenLoader } from "../../components/Loader";
import { useToast } from "../../context/ToastContext";
import Pagination from "../../components/Pagination";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (category && category !== "All") query.set("category", category);
      query.set("page", page);
      query.set("limit", 10);

      const res = await api.get(`/products?${query.toString()}`);
      if (res.success) {
        setProducts(res.data);
        setPages(res.pages);
        setTotal(res.total);
        if (res.categories) {
          setCategories(["All", ...res.categories]);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/products/${productId}`);
      if (res.success) {
        toast.success(`Product "${title}" was deleted.`);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setTotal((prev) => prev - 1);
      }
    } catch (err) {
      toast.error(err.message || "Could not delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Catalog Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, edit, update stock, and manage store products ({total} total)
          </p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="text-sm" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20">
            <ScreenLoader message="Loading catalog..." />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <FiBox className="text-3xl mx-auto text-slate-300" />
            <p>No products matched the given criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-6">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                      />
                    </td>
                    <td className="py-3 px-6 max-w-xs">
                      <p className="font-bold text-slate-900 truncate" title={p.title}>
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {p.brand ? `Brand: ${p.brand}` : "Unbranded"}
                      </p>
                    </td>
                    <td className="py-3 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-900">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`font-bold ${
                          p.stock <= 0
                            ? "text-rose-600"
                            : p.stock <= 5
                            ? "text-amber-600"
                            : "text-slate-800"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {p.stock <= 0 ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-center">
          <Pagination
            page={page}
            pages={pages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

