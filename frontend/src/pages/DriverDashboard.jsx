import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { jaipurPlaces } from "../data/jaipurPlaces";
import { default as apiClient } from "../services/api";

export default function DriverDashboard() {
  const { user } = useContext(AuthContext);
  const [driverInfo, setDriverInfo] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [availableShared, setAvailableShared] = useState([]);
  const [mySharedRide, setMySharedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpInputs, setOtpInputs] = useState({});

  const fetchDriverData = async () => {
    try {
      const res = await apiClient.get("/driver/me");
      setDriverInfo(res.data.data);
    } catch (err) {
      console.error("Failed to fetch driver data", err);
    }
  };

  const fetchRideRequests = async () => {
    try {
      const res = await apiClient.get("/driver/requests");
      setRideRequests(res.data.data);
      
      // Look for a shared ride in active bookings
      const shared = res.data.data.find(r => r.type === 'shared');
      if (shared && shared.sharedRide) {
        const rideRes = await apiClient.get(`/shared-rides/matches`); // We'll need a better way to get specific ride, but for now we can filter
        const rideData = (rideRes.data.data || []).find(r => r._id === shared.sharedRide);
        setMySharedRide(rideData);
      } else {
        setMySharedRide(null);
      }
    } catch (err) {
      console.error("Failed to fetch ride requests", err);
    }
  };

  const fetchAvailableShared = async () => {
    try {
      const res = await apiClient.get("/shared-rides/available");
      setAvailableShared(res.data.data);
    } catch (err) {
      console.error("Failed to fetch available shared rides", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDriverData(), fetchRideRequests(), fetchAvailableShared()]);
      setLoading(false);
    };
    init();

    // Poll for new requests every 10 seconds
    const interval = setInterval(() => {
      fetchRideRequests();
      fetchAvailableShared();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (status) => {
    setSaving(true);
    try {
      const res = await apiClient.put("/driver/update", { availability: status });
      setDriverInfo(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
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

  const handleRequestSharedStart = async (rideId) => {
    try {
      await apiClient.post("/shared-rides/request-start", { rideId });
      fetchRideRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request start");
    }
  };

  const handleConfirmSharedStart = async (rideId) => {
    try {
      await apiClient.post("/shared-rides/confirm-start", { rideId });
      fetchRideRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start ride. Make sure all passengers have approved.");
    }
  };

  const handleUpdateLocation = async (areaName) => {
    const place = jaipurPlaces.find(p => p.name === areaName);
    if (!place) return;

    setSaving(true);
    try {
      const res = await apiClient.put("/driver/update", { 
        currentLocation: { 
          areaName: place.name, 
          latitude: place.coordinates.lat, 
          longitude: place.coordinates.lng 
        } 
      });
      setDriverInfo(res.data.data);
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
      fetchDriverData(); // Update status to Busy
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleCompleteRide = async (bookingId) => {
    try {
      await apiClient.post("/driver/complete", { bookingId });
      fetchRideRequests();
      fetchDriverData(); // Update status to Available and new location
    } catch (err) {
      alert("Failed to complete ride");
    }
  };

  const handleOtpChange = (bookingId, value) => {
    setOtpInputs(prev => ({ ...prev, [bookingId]: value }));
  };

  const hasActiveRide = rideRequests.some(r => r.status === 'accepted' || r.status === 'started');

  if (loading) return <div className="p-10 text-center">Loading Driver Dashboard...</div>;
  if (!driverInfo) return <div className="p-10 text-center text-red-500">Only drivers can access this page.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {!driverInfo.isVerified && (
          <div className="mb-8 rounded-3xl bg-red-50 border-2 border-red-100 p-8 shadow-xl text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h2 className="text-2xl font-black text-red-900">Verification Required</h2>
            <p className="text-red-700 font-medium mt-2">
              Your account is not yet verified. You must complete your profile and wait for admin approval before you can go online or accept rides.
            </p>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="mt-6 bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100"
            >
              Complete Profile
            </button>
          </div>
        )}

        <div className={`mb-8 rounded-3xl bg-white p-8 shadow-xl ${!driverInfo.isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-gray-500">{driverInfo.vehicle} • {driverInfo.vehicleNumber}</p>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-bold ${driverInfo.availability === 'Available' ? 'bg-green-100 text-green-700' : driverInfo.availability === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
              {driverInfo.availability}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <button 
              disabled={saving || hasActiveRide}
              onClick={() => handleUpdateStatus('Available')}
              className={`rounded-2xl p-4 text-center border-2 transition ${driverInfo.availability === 'Available' ? 'border-green-500 bg-green-50' : 'border-transparent bg-gray-100 hover:bg-gray-200'} disabled:opacity-50`}
            >
              <div className="text-2xl mb-1">🚗</div>
              <div className="font-bold">Go Online</div>
              <div className="text-xs text-gray-500">Ready for rides</div>
            </button>
            <button 
              disabled={saving || hasActiveRide}
              onClick={() => handleUpdateStatus('Offline')}
              className={`rounded-2xl p-4 text-center border-2 transition ${driverInfo.availability === 'Offline' ? 'border-gray-500 bg-gray-50' : 'border-transparent bg-gray-100 hover:bg-gray-200'} disabled:opacity-50`}
            >
              <div className="text-2xl mb-1">💤</div>
              <div className="font-bold">Go Offline</div>
              <div className="text-xs text-gray-500">Take a break</div>
            </button>
            <div className="rounded-2xl p-4 text-center bg-indigo-50 border-2 border-indigo-100">
              <div className="text-2xl mb-1">📍</div>
              <div className="font-bold truncate px-2">{driverInfo.currentLocation.areaName}</div>
              <div className="text-xs text-gray-500">Current Position</div>
            </div>
            <div className="rounded-2xl p-4 text-center bg-indigo-50 border-2 border-indigo-100">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-bold">{driverInfo.rating} Rating</div>
              <div className="text-xs text-gray-500">Keep it up!</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-xl sticky top-24 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Set Current Location</h2>
                <p className="text-sm text-gray-500 mb-4">Select the Jaipur area where you are currently waiting.</p>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {jaipurPlaces.map(place => (
                    <button
                      key={place.id}
                      onClick={() => handleUpdateLocation(place.name)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition ${driverInfo.currentLocation.areaName === place.name ? 'bg-indigo-600 text-white font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
              </div>

              {driverInfo.isVerified && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>👥</span> Shared Pools
                  </h2>
                  <p className="text-xs text-gray-500 mb-4 uppercase font-black tracking-widest">Available Near You</p>
                  <div className="space-y-3">
                    {availableShared.length === 0 ? (
                      <div className="p-4 bg-gray-50 rounded-2xl text-xs text-center text-gray-400">No open pools currently</div>
                    ) : (
                      availableShared.map(ride => (
                        <div key={ride._id} className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">₹{ride.totalFare} Total</span>
                            <span className="text-[10px] font-bold text-indigo-400">{ride.riderCount} Riders</span>
                          </div>
                          <p className="text-xs font-bold text-indigo-900 truncate">To {ride.destinationName}</p>
                          <button 
                            onClick={() => handleAcceptShared(ride._id)}
                            className="mt-3 w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                          >
                            Accept Pool
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className={`rounded-3xl bg-white p-6 shadow-xl min-h-[500px] ${!driverInfo.isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Active Requests</h2>
                <button onClick={fetchRideRequests} className="text-sm text-indigo-600 font-bold hover:underline">Refresh</button>
              </div>

              {rideRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-3xl mb-4">🔔</div>
                  <p className="text-gray-500 max-w-xs">No active ride requests right now. Make sure you are "Online" to see new ones.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rideRequests.map(request => (
                    <div key={request._id} className="border-2 border-gray-50 rounded-2xl p-6 bg-white hover:border-indigo-100 transition">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              request.status === 'requested' || request.status === 'waiting_approval' ? 'bg-amber-100 text-amber-700' :
                              request.status === 'accepted' || request.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {request.status.replace('_', ' ')}
                            </span>
                            {request.type === 'shared' && (
                              <span className="text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase">Shared Pool</span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">{request.user?.fullName}</h3>
                          <p className="text-gray-500 text-sm">📞 {request.user?.mobile}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-indigo-600">₹{request.fare}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fare</div>
                        </div>
                      </div>

                      {request.type === 'shared' && mySharedRide && (
                        <div className="mb-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                          <div className="flex justify-between items-center text-xs font-bold text-purple-900 mb-2">
                            <span>POOL PROGRESS</span>
                            <span>{mySharedRide.riderCount} / 4 Riders</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-purple-600 h-full" style={{ width: `${(mySharedRide.riderCount / 4) * 100}%` }}></div>
                          </div>
                          <p className="mt-3 text-[10px] text-purple-600 font-medium">
                            {mySharedRide.status === 'open' ? 'Waiting for more passengers to join...' : 'Approval phase initiated.'}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-4 mb-6 border-y border-gray-50 py-4">
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Pickup</p>
                            <p className="text-sm font-semibold text-gray-800">{request.pickup}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Destination</p>
                            <p className="text-sm font-semibold text-gray-800">{request.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {request.status === 'requested' && (
                          <button 
                            onClick={() => handleAcceptRide(request._id)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-indigo-100"
                          >
                            Accept Request
                          </button>
                        )}

                        {request.type === 'shared' && mySharedRide?.status === 'open' && (
                          <button 
                            onClick={() => handleRequestSharedStart(mySharedRide._id)}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-amber-100"
                          >
                            Request Approval to Start
                          </button>
                        )}

                        {request.type === 'shared' && mySharedRide?.status === 'waiting_approval' && (
                          <button 
                            onClick={() => handleConfirmSharedStart(mySharedRide._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-green-100"
                          >
                            Start Ride (Confirm Approvals)
                          </button>
                        )}

                        {(request.status === 'accepted' || request.status === 'approved') && request.type !== 'shared' && (
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Ride OTP"
                              maxLength="4"
                              value={otpInputs[request._id] || ''}
                              onChange={(e) => handleOtpChange(request._id, e.target.value)}
                              className="flex-1 border-2 border-gray-100 rounded-xl px-4 font-bold text-center tracking-widest focus:border-indigo-600 outline-none"
                            />
                            <button 
                              onClick={() => handleStartRide(request._id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-green-100"
                            >
                              Start
                            </button>
                          </div>
                        )}

                        {request.status === 'started' && (
                          <button 
                            onClick={() => handleCompleteRide(request._id)}
                            className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-gray-200"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
