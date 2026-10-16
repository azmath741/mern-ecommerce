import React, { useState, useEffect } from "react";
import { FiUsers, FiShield, FiUser, FiMail, FiPhone } from "react-icons/fi";
import api from "../../services/api";
import { ScreenLoader } from "../../components/Loader";
import { useToast } from "../../context/ToastContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users");
        if (res.success && res.data) {
          setUsers(res.data);
        }
      } catch (err) {
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Registered Accounts Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete listing of customer and administrative accounts ({users.length} registered)
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20">
            <ScreenLoader message="Loading registered users..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <FiUsers className="text-3xl mx-auto mb-2 text-slate-300" />
            <p>No user accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Contact / Phone</th>
                  <th className="py-4 px-6">Primary Location</th>
                  <th className="py-4 px-6">Assigned Role</th>
                  <th className="py-4 px-6 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {u.username ? u.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span>{u.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {u.phone || <span className="text-slate-300 italic">None provided</span>}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {u.address?.city && u.address?.country
                        ? `${u.address.city}, ${u.address.country}`
                        : u.address?.country || (
                            <span className="text-slate-300 italic">Unspecified</span>
                          )}
                    </td>
                    <td className="py-4 px-6">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <FiShield className="text-[10px]" /> Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          <FiUser className="text-[10px]" /> Customer
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

