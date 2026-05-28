import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import { 
  FiUsers, FiTruck, FiMapPin, FiActivity, 
  FiDollarSign, FiCheckCircle, FiClock, FiGrid, FiArrowRight 
} from "react-icons/fi";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/admin/stats");
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { 
      label: "Total Revenue", 
      value: `₹${stats?.revenue || 0}`, 
      icon: <FiDollarSign />, 
      color: "bg-green-500",
      desc: "Total completed ride earnings"
    },
    { 
      label: "Active Users", 
      value: stats?.users || 0, 
      icon: <FiUsers />, 
      color: "bg-indigo-500",
      desc: "Registered passenger accounts",
      link: "/admin/users"
    },
    { 
      label: "Total Drivers", 
      value: stats?.drivers || 0, 
      icon: <FiTruck />, 
      color: "bg-purple-500",
      desc: "Total registered drivers",
      link: "/admin/drivers"
    },
    { 
      label: "Pending Verification", 
      value: stats?.pendingDrivers || 0, 
      icon: <FiClock />, 
      color: "bg-amber-500",
      desc: "Drivers waiting for approval",
      alert: (stats?.pendingDrivers > 0),
      link: "/admin/drivers"
    },
    { 
      label: "Total Bookings", 
      value: stats?.bookings || 0, 
      icon: <FiActivity />, 
      color: "bg-pink-500",
      desc: "Total rides requested till date"
    },
    { 
      label: "Tourist Places", 
      value: stats?.places || 0, 
      icon: <FiMapPin />, 
      color: "bg-cyan-500",
      desc: "Attractions in the database",
      link: "/admin/places"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 px-6 py-12 mb-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-2">System Control Center</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium mt-2">Oversee Jaipur's smart transport and tourism network.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${card.link ? 'cursor-pointer' : ''}`}
              onClick={() => card.link && navigate(card.link)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-current/20`}>
                  {card.icon}
                </div>
                {card.alert && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{card.label}</h3>
                <p className="text-3xl font-black text-gray-900 mb-2">{card.value}</p>
                <p className="text-gray-500 text-xs font-medium">{card.desc}</p>
              </div>
              {card.link && (
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px] font-black uppercase tracking-widest">Manage Now</span>
                  <FiArrowRight />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Platform Management</h2>
                  <p className="text-sm text-gray-500 font-medium">Quick access to administrative tools</p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><FiGrid size={24} /></div>
             </div>
             <div className="space-y-4">
                <ManagementLink 
                  icon={<FiMapPin />} 
                  title="Places & Attractions" 
                  desc="Add or edit Jaipur's historical sites"
                  onClick={() => navigate("/admin/places")}
                />
                <ManagementLink 
                  icon={<FiTruck />} 
                  title="Driver Network" 
                  desc="Approve and manage driver fleet"
                  onClick={() => navigate("/admin/drivers")}
                />
                <ManagementLink 
                  icon={<FiUsers />} 
                  title="User Management" 
                  desc="View and manage passenger accounts"
                  onClick={() => navigate("/admin/users")}
                />
             </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 shadow-xl text-white relative overflow-hidden">
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black mb-4">System Health</h2>
                  <p className="text-indigo-100 font-medium opacity-80 leading-relaxed">
                    The Ghumo Jaipur platform is currently operational. All systems are running within normal parameters for the 2026 season.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-4">
                   <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold text-xs uppercase tracking-widest border border-white/20">v2.0 Stable</div>
                   <div className="px-4 py-2 bg-green-400 text-green-950 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Live</div>
                </div>
             </div>
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ManagementLink({ icon, title, desc, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-indigo-50 transition-all text-left group"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition shadow-sm border border-gray-100">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-gray-900 font-bold">{title}</h4>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
      <FiArrowRight className="text-gray-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
