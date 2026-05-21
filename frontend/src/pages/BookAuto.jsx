import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBookingApi, confirmBookingApi } from '../services/bookingApi';
import PaymentModal from '../components/PaymentModal';
import DriverCard from '../components/DriverCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookAuto() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [pickup, setPickup] = useState('Sindhi Camp');
  const [destination, setDestination] = useState('Chandpole');
  const [fare, setFare] = useState(60);
  const [eta, setEta] = useState(4);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleBook = async () => {
    try {
      const payload = { userId: user?.id || null, type: 'auto', pickup, destination, fare };
      const res = await createBookingApi(payload);
      setBookingId(res.data._id);
      setShowPayment(true);
    } catch (err) {
      alert('Booking failed');
    }
  };

  const handlePaymentSuccess = async () => {
    if (!bookingId) return;
    const res = await confirmBookingApi(bookingId);
    navigate(`/book/success/${bookingId}`);
  };

  React.useEffect(() => {
    if (location?.state?.source) setPickup(location.state.source);
    if (location?.state?.destination) setDestination(location.state.destination);
  }, [location]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="rounded-3xl p-6 bg-white/80 shadow-xl">
        <h2 className="text-2xl font-bold">Book Auto Rickshaw</h2>
        <div className="mt-4 grid gap-3">
          <input value={pickup} onChange={(e)=>setPickup(e.target.value)} className="p-3 border rounded" />
          <input value={destination} onChange={(e)=>setDestination(e.target.value)} className="p-3 border rounded" />
          <div className="flex items-center justify-between">
            <div>Estimated fare: <strong>₹{fare}</strong></div>
            <div>ETA: <strong>{eta} mins</strong></div>
          </div>
          <div className="mt-4">
            <DriverCard driver={{ name: 'Suresh Kumar', vehicle: 'Auto (Green)', vehicleNumber: 'RJ14 AC 5555', rating: 4.6, arrival: '2 mins' }} />
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
