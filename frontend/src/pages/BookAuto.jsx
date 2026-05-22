import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBookingApi } from '../services/bookingApi';
import DriverCard from '../components/DriverCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookAuto() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [pickup] = useState(location?.state?.source || 'Sindhi Camp');
  const [destination] = useState(location?.state?.destination || 'Chandpole');
  const [fare] = useState(location?.state?.fare || 60);
  const [eta] = useState(location?.state?.time || '4 mins');
  const [loading, setLoading] = useState(false);

  const matchedDriver = location?.state?.driver;

  const handleBook = async () => {
    if (!matchedDriver) {
      alert("No driver selected");
      return;
    }
    setLoading(true);
    try {
      const payload = { 
        userId: user?.id, 
        type: 'auto', 
        pickup, 
        destination, 
        fare, 
        driverId: matchedDriver._id || matchedDriver.id 
      };
      const res = await createBookingApi(payload);
      const bookingId = res.data?._id || res.data?.id;
      navigate(`/book/success/${bookingId}`);
    } catch (err) {
      alert('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!matchedDriver) {
    return <div className="p-10 text-center text-red-500">Please select an auto from the transport search page first.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="rounded-3xl p-8 bg-white shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Confirm Your Auto Rickshaw</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
             <div>
               <label className="text-xs font-bold uppercase text-gray-400">Pickup</label>
               <input value={pickup} readOnly className="mt-1 w-full p-3 bg-gray-50 border rounded-xl font-medium" />
             </div>
             <div>
               <label className="text-xs font-bold uppercase text-gray-400">Destination</label>
               <input value={destination} readOnly className="mt-1 w-full p-3 bg-gray-50 border rounded-xl font-medium" />
             </div>
             <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl border border-pink-100">
                <div>
                  <div className="text-xs font-bold text-pink-600 uppercase">Fare</div>
                  <div className="text-2xl font-black text-pink-900">₹{fare}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-pink-600 uppercase">ETA</div>
                  <div className="text-xl font-bold text-pink-900">{eta}</div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-gray-400">Your Auto Driver</label>
            <DriverCard driver={matchedDriver} />
            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-xs text-pink-800">
              Your driver is waiting in <strong>{pickup}</strong> area. 
              Please confirm the booking to send a request to the driver.
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleBook} 
                disabled={loading}
                className="flex-1 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold shadow-lg transition shadow-pink-200 disabled:opacity-50"
              >
                {loading ? 'Requesting...' : 'Request Auto'}
              </button>
              <button onClick={()=>navigate(-1)} className="px-6 py-4 border border-gray-200 hover:bg-gray-50 rounded-2xl font-bold transition text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
