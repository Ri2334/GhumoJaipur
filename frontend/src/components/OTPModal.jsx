import React, { useState } from 'react';

export default function OTPModal({ open=true, onClose=()=>{}, onVerify=async ()=>{} }){
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try{ await onVerify(otp); }
    finally{ setLoading(false); }
  };

  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="font-semibold">Enter ride OTP</h3>
        <p className="text-sm text-gray-600">Check your email for the 4-digit OTP</p>
        <input value={otp} onChange={e=>setOtp(e.target.value)} className="mt-3 w-full p-2 border rounded" placeholder="1234" />
        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
          <button onClick={handleVerify} disabled={loading} className="px-3 py-2 bg-indigo-600 text-white rounded">{loading ? 'Verifying...' : 'Verify'}</button>
        </div>
      </div>
    </div>
  );
}
