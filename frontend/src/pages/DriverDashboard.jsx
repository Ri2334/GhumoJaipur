import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { default as apiClient } from "../services/api";
import { 
  FiMapPin, FiStar, FiTruck, FiActivity, 
  FiUser, FiPhone, FiDollarSign, FiClock,
  FiZap, FiCheckCircle, FiXCircle, FiCompass,
  FiLayers, FiRefreshCw, FiAlertCircle, FiShield, FiTrendingUp, FiCalendar, FiUsers
} from "react-icons/fi";

export default function DriverDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [availableShared, setAvailableShared] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpInputs, setOtpInputs] = useState({});
  const [error, setError] = useState(null); // Local error catch
  
  const [stats, setStats] = useState({
    totals: { earnings: 0, trips: 0, distance: 0 },
    history: [],
    chartData: []
  });
  const [analysisTab, setAnalysisTab] = useState("earnings"); 
  const [period, setPeriod] = useState("daily"); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDriverData = useCallback(async () => {
    try {
      const res = await apiClient.get("/driver/me");
      if (res.data?.data) setDriverInfo(res.data.data);
    } catch (err) {
      console.error("Fetch Driver Error", err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiClient.get(`/driver/stats?period=${period}&date=${selectedDate}`);
      if (res.data?.success && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Stats Error", err);
    }
  }, [period, selectedDate]);

  const fetchRideRequests = useCallback(async () => {
    try {
      const res = await apiClient.get("/driver/requests");
      setRideRequests(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Requests Error", err);
    }
  }, []);

  const fetchAvailableShared = useCallback(async () => {
    try {
      const res = await apiClient.get("/shared-rides/available");
      setAvailableShared(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Shared Error", err);
    }
  }, []);

  const fetchAllLocations = useCallback(async () => {
    try {
      const [locRes, staRes] = await Promise.all([
        apiClient.get("/transport/locations"),
        apiClient.get("/transport/stations")
      ]);
      
      const combined = [
        ...(locRes.data?.data || []).map(l => ({ name: l.name, lat: l.latitude, lng: l.longitude, category: l.category })),
        ...(staRes.data?.data || []).map(s => ({ name: s.name, lat: s.latitude, lng: s.longitude, category: "Metro Station" }))
      ].filter(l => l.name).sort((a, b) => a.name.localeCompare(b.name));

      setAllLocations(combined);
    } catch (err) {
      console.error("Fetch Locations Error", err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDriverData(), fetchRideRequests(), fetchAvailableShared(), fetchAllLocations(), fetchStats()]);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchDriverData, fetchRideRequests, fetchAvailableShared, fetchAllLocations, fetchStats]);

  // Polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRideRequests();
      fetchAvailableShared();
      fetchStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchRideRequests, fetchAvailableShared, fetchStats]);

  const handleUpdateStatus = async (status) => {
    setSaving(true);
    try {
      const res = await apiClient.put("/driver/update", { availability: status });
      setDriverInfo(res.data?.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLocation = async (loc) => {
    setSaving(true);
    try {
      const res = await apiClient.put("/driver/update", { 
        currentLocation: { areaName: loc.name, latitude: loc.lat, longitude: loc.lng } 
      });
      setDriverInfo(res.data?.data);
    } catch (err) {
      alert("Failed to update location");
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptRide = async (bookingId) => {
    try {
      await apiClient.post("/driver/accept", { bookingId });
      fetchRideRequests();
    } catch (err) {
      alert("Failed to accept ride");
    }
  };

  const handleStartRide = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp || otp.length !== 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }
    try {
      await apiClient.post("/driver/start", { bookingId, otp });
      fetchRideRequests();
      fetchDriverData();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleCompleteRide = async (bookingId) => {
    try {
      await apiClient.post("/driver/complete", { bookingId });
      fetchRideRequests();
      fetchDriverData();
      fetchStats();
    } catch (err) {
      alert("Failed to complete ride");
    }
  };

  const handleAcceptShared = async (rideId) => {
    try {
      await apiClient.post("/shared-rides/accept", { rideId });
      fetchRideRequests();
      fetchAvailableShared();
    } catch (err) {
      alert("Failed to accept shared ride");
    }
  };

  const handleOtpChange = (bookingId, value) => {
    setOtpInputs(prev => ({ ...prev, [bookingId]: value }));
  };

  // Safe chart data calculation
  const chartMemo = useMemo(() => {
    const data = stats?.chartData || [];
    const max = Math.max(...data.map(d => Number(d[analysisTab]) || 0), 1);
    return { data, max };
  }, [stats, analysisTab]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-xs font-medium">Loading Command Center...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4 p-6">
      <FiAlertCircle size={40} className="text-red-500" />
      <p className="text-gray-900 font-bold">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Retry</button>
    </div>
  );

  if (!driverInfo) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm">
        <FiUser size={32} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 text-xs">Driver profile not detected. Ensure you are signed in as a driver.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b border-gray-100 px-6 py-6 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100"><FiTruck size={24} /></div>
             <div>
                <h1 className="text-xl font-black text-gray-900">Driver Dashboard</h1>
                <p className="text-[10px] text-gray-400 font-bold">{driverInfo.vehicle} • {driverInfo.vehicleNumber}</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-8">
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-400 uppercase">Rating</p>
                   <p className="text-sm font-black text-indigo-600">{driverInfo.rating || '5.0'} <FiStar className="inline" size={10} /></p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-400 uppercase">Revenue</p>
                   <p className="text-sm font-black text-green-600">₹{stats?.totals?.earnings || 0}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-400 uppercase">Trips</p>
                   <p className="text-sm font-black text-gray-900">{stats?.totals?.trips || 0}</p>
                </div>
             </div>
             <div className={`px-4 py-2 rounded-xl font-black uppercase text-[9px] border-2 ${
               driverInfo.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
             }`}>
               {driverInfo.availability}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {!driverInfo.isVerified && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4"><FiShield className="text-red-500" size={24} />
              <div><p className="text-sm font-black text-red-900">Verification Pending</p><p className="text-xs text-red-600">Complete your profile to start accepting rides.</p></div>
            </div>
            <button onClick={() => navigate('/profile')} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black">Complete Profile</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
              <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4">Availability Control</h2>
              <div className="grid grid-cols-2 gap-3">
                <button disabled={saving || !driverInfo.isVerified} onClick={() => handleUpdateStatus('Available')} className={`p-4 rounded-2xl border-2 transition-all ${driverInfo.availability === 'Available' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400'}`}><FiActivity className="mx-auto" size={20} /><span className="block font-bold text-[9px] mt-2">GO ONLINE</span></button>
                <button disabled={saving || !driverInfo.isVerified} onClick={() => handleUpdateStatus('Offline')} className={`p-4 rounded-2xl border-2 transition-all ${driverInfo.availability === 'Offline' ? 'bg-gray-800 border-gray-800 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400'}`}><FiClock className="mx-auto" size={20} /><span className="block font-bold text-[9px] mt-2">GO OFFLINE</span></button>
              </div>
            </section>

            <section className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
              <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4">Set Position</h2>
              <div className="relative mb-4">
                <FiCompass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search areas..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full bg-gray-50 border-transparent focus:border-indigo-100 rounded-xl pl-10 pr-4 py-3 text-xs outline-none font-bold" />
              </div>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                {allLocations.filter(l => l.name?.toLowerCase().includes(locationSearch.toLowerCase())).map(loc => (
                  <button key={loc.name} onClick={() => handleUpdateLocation(loc)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${driverInfo.currentLocation?.areaName === loc.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                    <div className="flex items-center gap-2.5"><FiLayers size={12} /><div><p className="text-[11px] font-bold">{loc.name}</p><p className="text-[8px] opacity-70">{loc.category}</p></div></div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
              <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4">Shared Feed</h2>
              <div className="space-y-3">
                {availableShared.length === 0 ? <div className="p-8 text-center text-[10px] text-gray-400 font-bold border-2 border-dashed border-gray-50 rounded-2xl">NO POOLS NEARBY</div> : availableShared.map(ride => (
                    <div key={ride._id} className="p-4 bg-indigo-50/50 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-800 mb-3 truncate">To {ride.destinationName}</p>
                      <button onClick={() => handleAcceptShared(ride._id)} className="w-full py-2 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase">Accept Pool</button>
                    </div>
                  ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-4">
               <div><h2 className="text-lg font-black text-gray-900">Active Requests</h2><p className="text-[10px] text-gray-400 font-bold">Pending bookings</p></div>
               <button onClick={fetchRideRequests} className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100"><FiRefreshCw size={16} className="text-indigo-600" /></button>
            </div>

            <div className={`space-y-4 min-h-[250px] ${!driverInfo.isVerified ? 'opacity-40' : ''}`}>
              {rideRequests.length === 0 ? <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2.5rem] shadow-xl"><FiTruck size={32} className="text-indigo-100 mb-3" /><h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">All Caught Up</h3></div> : rideRequests.map(request => (
                  <div key={request._id} className="bg-white rounded-[2rem] p-6 shadow-lg border-l-[8px] border-l-indigo-600">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><FiUser size={18} /></div><div><h3 className="text-sm font-black text-gray-900">{request.user?.fullName}</h3><p className="text-[10px] text-gray-500">{request.user?.mobile}</p></div></div>
                            <p className="text-xl font-black text-indigo-600">₹{request.fare}</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4 text-xs font-bold py-4 border-y border-gray-50"><div><p className="text-[8px] text-green-500 uppercase">Pickup</p><p className="truncate">{request.pickup}</p></div><div><p className="text-[8px] text-rose-500 uppercase">Dropoff</p><p className="truncate">{request.destination}</p></div></div>
                      </div>
                      <div className="md:w-48 flex flex-col justify-center space-y-2">
                         {request.status === 'requested' && <button onClick={() => handleAcceptRide(request._id)} className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Accept Trip</button>}
                         {(request.status === 'accepted' || request.status === 'approved') && <div className="space-y-2"><input type="text" placeholder="OTP" value={otpInputs[request._id] || ''} onChange={(e) => handleOtpChange(request._id, e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-2.5 text-center font-black" /><button onClick={() => handleStartRide(request._id)} className="w-full bg-green-600 text-white font-black py-3 rounded-xl text-[10px]">Start Ride</button></div>}
                         {request.status === 'started' && <button onClick={() => handleCompleteRide(request._id)} className="w-full bg-gray-900 text-white font-black py-3 rounded-xl text-[10px]">Complete</button>}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div><h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2"><FiTrendingUp className="text-indigo-600" /> Analysis</h2><p className="text-[10px] text-gray-400 font-bold uppercase">Performance tracking</p></div>
                  <div className="flex flex-wrap gap-2">
                     <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">{["daily", "monthly", "lifetime"].map(p => (<button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${period === p ? "bg-indigo-600 text-white shadow-md" : "text-gray-400"}`}>{p}</button>))}</div>
                     <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">{["earnings", "trips", "distance"].map(tab => (<button key={tab} onClick={() => setAnalysisTab(tab)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${analysisTab === tab ? "bg-indigo-600 text-white shadow-md" : "text-gray-400"}`}>{tab}</button>))}</div>
                  </div>
               </div>

               {period !== 'lifetime' && (
                  <div className="flex items-center gap-3 mb-8 bg-indigo-50/50 w-fit px-4 py-2.5 rounded-2xl border border-indigo-100/50"><FiCalendar className="text-indigo-600" size={14} /><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent outline-none text-xs font-black text-indigo-900" /></div>
               )}

               <div className="h-64 flex items-end gap-2 px-2 border-b border-gray-100 pb-2 overflow-x-auto custom-scrollbar">
                  {chartMemo.data.length === 0 ? <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-[10px] font-bold text-gray-300">NO RECORDS</div> : chartMemo.data.map((day, idx) => {
                      const value = Number(day[analysisTab]) || 0;
                      const h = (value / chartMemo.max) * 100;
                      return (
                         <div key={idx} className="flex-1 group relative flex flex-col justify-end items-center h-full min-w-[32px]">
                            <div style={{ height: `${h}%` }} className={`w-full max-w-[28px] rounded-t-lg transition-all duration-700 ease-out min-h-[4px] relative ${analysisTab === 'earnings' ? 'bg-green-400' : analysisTab === 'trips' ? 'bg-indigo-400' : 'bg-rose-400'}`}>
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-20 shadow-xl border border-white/10 pointer-events-none">
                                  {analysisTab === 'earnings' ? '₹' : ''}{value}{analysisTab === 'distance' ? ' km' : ''}
                                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                               </div>
                               {h > 15 && <span className="absolute inset-x-0 bottom-2 text-center text-[7px] font-black text-white pointer-events-none">{value}</span>}
                            </div>
                            <div className="mt-3 text-[8px] font-black text-gray-400 uppercase tracking-tighter text-center">{day._id?.split('-').pop() || day._id}</div>
                         </div>
                      );
                    })}
               </div>
               <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Revenue</p><p className="text-lg font-black text-indigo-600">₹{stats?.totals?.earnings || 0}</p></div>
                  <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Trips</p><p className="text-lg font-black text-gray-900">{stats?.totals?.trips || 0}</p></div>
                  <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[8px] font-black text-gray-400 uppercase mb-1">Distance</p><p className="text-lg font-black text-indigo-600">{stats?.totals?.distance || 0} km</p></div>
               </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
               <div className="flex items-center justify-between mb-6"><h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h2><button onClick={() => navigate("/my-rides")} className="text-[9px] font-black text-indigo-600 uppercase hover:underline">View All</button></div>
               <div className="space-y-3">
                  {(stats?.history || []).slice(0, 3).map(trip => (
                     <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100"><FiCheckCircle className="text-green-500" /></div><div><p className="text-[11px] font-black text-gray-800 leading-none mb-1.5">To {trip.to}</p><p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(trip.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div>
                        <div className="text-right"><p className="text-sm font-black text-indigo-600">₹{trip.fare}</p><p className="text-[8px] font-bold text-gray-400 uppercase">{trip.distance} km</p></div>
                     </div>
                  ))}
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
