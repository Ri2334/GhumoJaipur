import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingApi } from '../services/bookingApi';
import DriverMap from '../components/DriverMap';
import OTPModal from '../components/OTPModal';
import apiClient from '../services/api';

export default function BookingSuccess(){
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await getBookingApi(id);
        console.log('GetBooking response:', res);
        setBooking(res.data);
      }catch(e){
        console.error('Fetch booking failed:', e);
      }
    })();
  },[id]);

  if(!booking) return <div className="p-8">Loading booking...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="rounded-3xl p-6 bg-white/80 shadow-xl">
        <h2 className="text-2xl font-bold">Ride Confirmed</h2>
        <p className="mt-2">Booking ID: <strong>{booking._id}</strong></p>
        <p>Pickup: {booking.pickup}</p>
        <p>Destination: {booking.destination}</p>
        <p>Fare: ₹{booking.fare}</p>
        <p>Status: {booking.status}</p>
        {booking.driver && (
          <div className="mt-4">
            <h3 className="font-semibold">Driver</h3>
            <div>{booking.driver.name} · {booking.driver.vehicle} · {booking.driver.vehicleNumber}</div>
            <div className="mt-4">
              <DriverMap driver={booking.driver} pickupCoord={{ lat: booking.map?.source?.latitude || 26.9196, lng: booking.map?.source?.longitude || 75.7878 }} destCoord={{ lat: booking.map?.destination?.latitude || 26.9265, lng: booking.map?.destination?.longitude || 75.8242 }} />
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={async ()=>{ await apiClient.post(`/bookings/${id}/send-otp`); setOtpOpen(true); }} className="px-4 py-2 bg-amber-500 text-white rounded">Send ride OTP</button>
          <button onClick={async ()=>{ await apiClient.post(`/bookings/${id}/cancel`); alert('Ride cancelled'); }} className="px-4 py-2 border rounded">Cancel Ride</button>
          <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded">Back to dashboard</Link>
        </div>
        <OTPModal open={otpOpen} onClose={()=>setOtpOpen(false)} onVerify={async (otp)=>{ try{ await apiClient.post(`/bookings/${id}/verify-otp`, { otp }); alert('OTP verified'); setOtpOpen(false); }catch(e){ alert('OTP invalid or expired'); } }} />
      </div>
    </div>
  );
}
