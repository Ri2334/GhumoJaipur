import React, { useState, useEffect } from "react";
import { getAllUsersApi, deleteUserApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import { FiUser, FiMail, FiPhone, FiTrash2, FiShield, FiStar } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show: showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersApi();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      showToast("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete their bookings.")) return;
    try {
      const res = await deleteUserApi(userId);
      if (res.success) {
        showToast("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900">User Management</h1>
            <p className="text-gray-500 font-medium mt-1">Manage passenger accounts and access details</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-sm border border-indigo-200">
            {users.length} Registered Users
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 truncate">{user.fullName}</h3>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase">
                    <FiStar size={10} /> {user.rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(user._id)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"
                  title="Delete User"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <FiMail className="text-gray-400" />
                  <span className="text-xs font-bold truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <FiPhone className="text-gray-400" />
                  <span className="text-xs font-bold">{user.mobile}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</span>
                <span className="text-[10px] font-black text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
            <FiUser size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No users found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
