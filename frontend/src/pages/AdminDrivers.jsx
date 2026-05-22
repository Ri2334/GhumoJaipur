import React, { useState, useEffect } from "react";
import { getPendingDriversApi, verifyDriverApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show: showToast } = useToast();

  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);
      const res = await getPendingDriversApi();
      if (res.success) {
        setDrivers(res.data);
      }
    } catch (error) {
      showToast("Failed to fetch pending drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const handleVerify = async (driverId, status) => {
    try {
      const res = await verifyDriverApi(driverId, status);
      if (res.success) {
        showToast(`Driver ${status} successfully`);
        fetchPendingDrivers();
      }
    } catch (error) {
      showToast("Verification action failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Driver Verifications</h1>
            <p className="text-gray-500 font-medium mt-1">Review and approve driver registration requests</p>
          </div>
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl font-bold text-sm">
            {drivers.length} Pending Requests
          </div>
        </div>

        {drivers.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2">No pending driver verifications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivers.map((driver) => (
              <div key={driver._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="p-8 flex-grow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      {driver.profilePicture ? (
                        <img src={driver.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{driver.userId?.fullName}</h3>
                      <p className="text-gray-500 text-sm font-medium">{driver.userId?.email}</p>
                      <p className="text-indigo-600 text-xs font-bold mt-1">{driver.userId?.mobile}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle</p>
                      <p className="text-sm font-bold text-gray-800">{driver.vehicle}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Plate Number</p>
                      <p className="text-sm font-bold text-gray-800">{driver.vehicleNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Documents</p>
                    <div className="flex flex-wrap gap-2">
                      <DocLink label="ID Proof" url={driver.idProof} />
                      <DocLink label="License" url={driver.licenseProof} />
                      <DocLink label="RC Proof" url={driver.vehicleProof} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => handleVerify(driver._id, 'verified')}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleVerify(driver._id, 'rejected')}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition"
                  >
                    Reject
                  </button>
                </div>
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
      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
    >
      View {label}
    </a>
  );
}
