import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBookingApi, confirmBookingApi } from '../services/bookingApi';
import PaymentModal from '../components/PaymentModal';
import DriverCard from '../components/DriverCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookCab() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [pickup, setPickup] = useState('Jaipur Railway Station');
  const [destination, setDestination] = useState('Badi Chopar');
  const [fare, setFare] = useState(120);
  const [eta, setEta] = useState(6);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleBook = async () => {
    try {
      const payload = { userId: user?.id || null, type: 'cab', pickup, destination, fare };
      const res = await createBookingApi(payload);
      console.log('CreateBooking response:', res);
      const id = res.data?._id || res.data?.id;
      setBookingId(id);
      setShowPayment(true);
    } catch (err) {
      console.error('Booking creation failed:', err);
      alert('Booking failed: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handlePaymentSuccess = async () => {
    if (!bookingId) {
      console.error('No bookingId set');
      return;
    }
    try {
      const res = await confirmBookingApi(bookingId);
      console.log('Confirm response:', res);
      navigate(`/book/success/${bookingId}`);
    } catch (err) {
      console.error('Confirm booking failed:', err);
      alert('Failed to confirm booking: ' + (err?.response?.data?.message || err.message));
    }
  };

  React.useEffect(() => {
    if (location?.state?.source) setPickup(location.state.source);
    if (location?.state?.destination) setDestination(location.state.destination);
  }, [location]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="rounded-3xl p-6 bg-white/80 shadow-xl">
        <h2 className="text-2xl font-bold">Book Cab</h2>
        <div className="mt-4 grid gap-3">
          <input value={pickup} onChange={(e)=>setPickup(e.target.value)} className="p-3 border rounded" />
          <input value={destination} onChange={(e)=>setDestination(e.target.value)} className="p-3 border rounded" />
          <div className="flex items-center justify-between">
            <div>Estimated fare: <strong>₹{fare}</strong></div>
            <div>ETA: <strong>{eta} mins</strong></div>
          </div>
          <div className="mt-4">
            <DriverCard driver={{ name: 'Rahul Sharma', vehicle: 'WagonR (White)', vehicleNumber: 'RJ14 AB 1234', rating: 4.8, arrival: '3 mins' }} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleBook} className="px-4 py-2 bg-indigo-600 text-white rounded">Book Ride</button>
            <button onClick={()=>navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </div>

      {showPayment && <PaymentModal amount={fare} onSuccess={handlePaymentSuccess} onClose={()=>setShowPayment(false)} />}
    </div>
  );
}
