import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiCheck,
  FiBox,
  FiDollarSign,
  FiTag,
  FiImage,
} from "react-icons/fi";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { ButtonLoader } from "../../components/Loader";

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    brand: "",
    image: "",
    additionalImages: "",
    stock: "10",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    "Electronics",
    "Clothing",
    "Beauty",
    "Home",
    "Accessories",
    "Sports",
    "Books",
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim())
      newErrors.description = "Product description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price greater than $0 is required";
    if (!formData.image.trim()) newErrors.image = "Main image URL is required";
    if (formData.stock === "" || Number(formData.stock) < 0)
      newErrors.stock = "Stock must be 0 or greater";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve highlighted validation errors");
      return;
    }

    try {
      setLoading(true);

      const imagesArray = formData.additionalImages
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        image: formData.image.trim(),
        images: [formData.image.trim(), ...imagesArray],
        stock: parseInt(formData.stock, 10),
        featured: formData.featured,
      };

      const res = await api.post("/products", payload);
      if (res.success) {
        toast.success(`Product "${formData.title}" created successfully!`);
        navigate("/admin/products");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
        >
          <FiArrowLeft /> Back to Product Inventory
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create New Product
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add an item to the store catalog with specifications and stock count
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiTag className="text-indigo-600" /> Basic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Master & Dynamic MH40 Wireless Headphones"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 ${
                    errors.title ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 cursor-pointer font-semibold text-slate-700"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Sony, Apple, Nike"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide comprehensive specifications, features, materials, and benefits..."
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 ${
                    errors.description ? "border-rose-400" : "border-slate-200"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiDollarSign className="text-indigo-600" /> Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299.99"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 ${
                    errors.price ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.price && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Stock Units *
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="25"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 ${
                    errors.stock ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.stock && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.stock}</p>
                )}
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Mark as Featured Product (Highlights on Homepage showcase)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Media & Images */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiImage className="text-indigo-600" /> Imagery & Assets
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 ${
                    errors.image ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.image && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.image}</p>
                )}
              </div>

              {formData.image && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover bg-white border border-slate-200"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/100x100?text=Invalid+URL";
                    }}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Image Preview</p>
                    <p className="text-[11px] text-slate-400">
                      Successfully loaded asset link
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Gallery Images (comma separated URLs)
                </label>
                <input
                  type="text"
                  name="additionalImages"
                  value={formData.additionalImages}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..., https://..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? (
                <ButtonLoader text="Creating..." />
              ) : (
                <span>Save & Publish Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductAdd;

