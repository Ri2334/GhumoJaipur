import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingApi, confirmBookingApi, cancelBookingApi, rateDriverApi, passengerApproveStartApi } from '../services/bookingApi';
import { AuthContext } from '../context/AuthContext';
import DriverMap from '../components/DriverMap';
import PaymentModal from '../components/PaymentModal';

export default function BookingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [driverRating, setDriverRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [approving, setApproving] = useState(false);

  // Poll for status updates every 5 seconds
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingApi(id);
        setBooking(res.data);
      } catch (e) {
        console.error('Fetch booking failed:', e);
      }
    };

    fetchBooking();
    const timer = setInterval(fetchBooking, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const handlePaymentSuccess = async () => {
    try {
      await confirmBookingApi(id);
      const res = await getBookingApi(id);
      setBooking(res.data);
      alert("Payment successful! Thank you for riding with us.");
    } catch (err) {
      alert("Payment confirmation failed");
    }
  };

  const handleCancelRide = async () => {
    if (!window.confirm("Are you sure you want to cancel? Your user rating will decrease by 0.1.")) return;
    try {
      const res = await cancelBookingApi(id);
      await refreshUser();
      alert(`Ride cancelled. Your rating has been updated.`);
      navigate('/dashboard');
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const handleRateDriver = async (score) => {
    try {
      await rateDriverApi(id, score);
      setDriverRating(score);
      setRated(true);
      alert("Thank you for your feedback!");
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  const handleApproveRide = async () => {
    try {
      setApproving(true);
      await passengerApproveStartApi(id);
      const res = await getBookingApi(id);
      setBooking(res.data);
      alert("Ride approved! Waiting for the driver to start.");
    } catch (err) {
      alert("Approval failed");
    } finally {
      setApproving(false);
    }
  };

  if (!booking) return <div className="p-10 text-center">Loading booking details...</div>;

  const getStatusDisplay = () => {
    switch (booking.status) {
      case 'requested': 
        return booking.type === 'shared' 
          ? { text: 'Pooling Active', color: 'bg-purple-100 text-purple-700', sub: 'Waiting for more passengers to join and a driver to accept.' }
          : { text: 'Waiting for Driver', color: 'bg-amber-100 text-amber-700', sub: 'Your request has been sent to the driver.' };
      case 'accepted': return { text: 'Driver Arriving', color: 'bg-blue-100 text-blue-700', sub: `Please share OTP ${booking.rideOtp} with the driver.` };
      case 'waiting_approval': return { text: 'Approval Required', color: 'bg-purple-100 text-purple-700', sub: 'The driver is ready to start. Please approve the ride.' };
      case 'approved': return { text: 'Ready to Go', color: 'bg-indigo-100 text-indigo-700', sub: 'You have approved. Waiting for others or driver to start.' };
      case 'started': return { text: 'Ride Ongoing', color: 'bg-green-100 text-green-700', sub: 'Enjoy your trip through Jaipur!' };
      case 'completed': return { text: 'Ride Completed', color: 'bg-indigo-100 text-indigo-700', sub: 'You have reached your destination.' };
      case 'cancelled': return { text: 'Cancelled', color: 'bg-red-100 text-red-700', sub: 'This ride was cancelled.' };
      default: return { text: booking.status, color: 'bg-gray-100 text-gray-700', sub: '' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {booking.status === 'waiting_approval' && (
        <div className="mb-8 p-6 bg-purple-600 text-white rounded-[2rem] shadow-2xl animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Driver is ready to start! 🚖</h3>
              <p className="font-bold text-purple-100">Your final split fare is ₹{booking.fare}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleApproveRide}
                disabled={approving}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-black shadow-lg hover:bg-purple-50 transition disabled:opacity-50"
              >
                Approve Ride
              </button>
              <button 
                onClick={handleCancelRide}
                className="px-6 py-3 bg-purple-800 text-white rounded-xl font-bold hover:bg-purple-900 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl p-8 bg-white shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Ride Details</h2>
            <p className="text-sm text-gray-500 font-medium">Booking ID: {booking._id}</p>
          </div>
          <div className="text-right">
             <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${statusInfo.color}`}>
                {statusInfo.text}
             </div>
             <p className="text-xs text-gray-500 mt-1 font-medium">{statusInfo.sub}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
             {booking.driver && (
               <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Your Driver</h3>
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚕</div>
                     <div>
                        <div className="font-bold text-gray-900 text-lg">{booking.driver.userId?.fullName || 'Driver'}</div>
                        <div className="text-sm text-gray-500 font-medium">{booking.driver.vehicle} • {booking.driver.vehicleNumber}</div>
                        <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">⭐ <strong>{booking.driver.rating}</strong></div>
                     </div>
                  </div>
               </div>
             )}

             {booking.status === 'completed' && (
               <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-center">
                 <h3 className="text-lg font-bold text-amber-900 mb-3">
                   {booking.isRated ? "Your Feedback" : "Rate your Driver"}
                 </h3>
                 <div className="flex justify-center gap-2">
                   {[1, 2, 3, 4, 5].map(star => (
                     <button 
                       key={star} 
                       disabled={booking.isRated || rated}
                       onClick={() => handleRateDriver(star)}
                       className={`text-3xl transition ${(booking.userRating || driverRating) >= star ? 'scale-110' : 'opacity-30'}`}
                     >
                       {(booking.userRating || driverRating) >= star ? '⭐' : '☆'}
                     </button>
                   ))}
                 </div>
                 {booking.isRated && (
                   <p className="text-xs font-bold text-amber-600 mt-3 uppercase tracking-widest">You rated this ride {booking.userRating} stars</p>
                 )}
               </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                   <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Fare</div>
                   <div className="text-xl font-black text-indigo-900">₹{booking.fare}</div>
                </div>
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50">
                   <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Type</div>
                   <div className="text-xl font-black text-pink-900 capitalize">{booking.type}</div>
                </div>
             </div>

             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Pickup Location</label>
                  <div className="mt-1 font-bold text-gray-800">{booking.pickup}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Destination</label>
                  <div className="mt-1 font-bold text-gray-800">{booking.destination}</div>
                </div>
             </div>

             <div className="pt-4 flex flex-wrap gap-3">
                {['requested', 'accepted', 'waiting_approval', 'approved'].includes(booking.status) && (
                  <button 
                    onClick={handleCancelRide}
                    className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition"
                  >
                    Cancel Ride
                  </button>
                )}
                {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                  <button onClick={() => setShowPayment(true)} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 transition">Pay Now ₹{booking.fare}</button>
                )}
                {booking.paymentStatus === 'paid' && (
                  <div className="flex-1 py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-center">Paid Successfully ✅</div>
                )}
                <button onClick={() => navigate('/dashboard')} className="px-6 py-4 border border-gray-200 hover:bg-gray-50 rounded-2xl font-bold transition text-gray-600">Back to Home</button>
             </div>
          </div>

          <div className="h-[400px] md:h-auto overflow-hidden rounded-3xl border border-gray-100 shadow-inner">
             <DriverMap 
                driver={booking.driver} 
                pickupCoord={{ lat: booking.map?.source?.latitude || 26.9124, lng: booking.map?.source?.longitude || 75.7873 }} 
                destCoord={{ lat: booking.map?.destination?.latitude || 26.9265, lng: booking.map?.destination?.longitude || 75.8242 }} 
             />
          </div>
        </div>
      </div>

      {showPayment && <PaymentModal amount={booking.fare} onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
