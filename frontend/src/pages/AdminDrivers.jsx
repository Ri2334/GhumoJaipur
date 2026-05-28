import React, { useState, useEffect } from "react";
import { getAllDriversApi, verifyDriverApi, deleteDriverApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import { FiTrash2, FiStar, FiTruck, FiAlertCircle, FiCheckCircle, FiShield } from "react-icons/fi";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'pending'
  const { show: showToast } = useToast();

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const params = filter === 'pending' ? { status: 'pending' } : {};
      const res = await getAllDriversApi(params);
      if (res.success) {
        setDrivers(res.data);
      }
    } catch (error) {
      showToast("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const handleVerify = async (driverId, status) => {
    try {
      const res = await verifyDriverApi(driverId, status);
      if (res.success) {
        showToast(`Driver ${status} successfully`);
        fetchDrivers();
      }
    } catch (error) {
      showToast("Verification action failed");
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver profile?")) return;
    try {
      const res = await deleteDriverApi(driverId);
      if (res.success) {
        showToast("Driver deleted successfully");
        fetchDrivers();
      }
    } catch (error) {
      showToast("Failed to delete driver");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Driver Management</h1>
            <p className="text-gray-500 font-medium mt-1">Review, approve and manage the platform's driver network</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              All Drivers
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Pending Approval
            </button>
          </div>
        </div>

        {drivers.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🚚</div>
            <h3 className="text-xl font-bold text-gray-900">No drivers found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try changing your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivers.map((driver) => (
              <div key={driver._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col group">
                <div className="p-8 flex-grow">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        {driver.profilePicture ? (
                          <img src={driver.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-indigo-50 text-indigo-300">👤</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{driver.userId?.fullName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                            driver.status === 'verified' ? 'bg-green-100 text-green-700' : 
                            driver.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {driver.status}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase">
                            <FiStar size={10} /> {driver.rating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(driver._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FiTruck /> Vehicle</p>
                      <p className="font-bold text-gray-900">{driver.vehicle}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FiShield /> Plate</p>
                      <p className="font-bold text-gray-900">{driver.vehicleNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Verification Documents</p>
                    <div className="flex flex-wrap gap-2">
                      <DocLink label="ID Proof" url={driver.idProof} />
                      <DocLink label="License" url={driver.licenseProof} />
                      <DocLink label="RC Proof" url={driver.vehicleProof} />
                    </div>
                  </div>
                </div>

                {driver.status === 'pending' && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button 
                      onClick={() => handleVerify(driver._id, 'verified')}
                      className="flex-1 py-3.5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-green-200"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleVerify(driver._id, 'rejected')}
                      className="flex-1 py-3.5 bg-white text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {driver.status === 'verified' && (
                  <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 tracking-widest">
                       <FiCheckCircle /> Verified Partner
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       {driver.type || 'cab'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocLink({ label, url }) {
  if (!url) return null;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition border border-indigo-100"
    >
      {label}
    </a>
  );
}
