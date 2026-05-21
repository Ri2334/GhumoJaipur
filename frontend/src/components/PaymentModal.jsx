import React, { useState } from 'react';

export default function PaymentModal({ amount = 100, onSuccess = ()=>{}, onClose = ()=>{} }) {
  const [status, setStatus] = useState('idle');

  const handlePay = () => {
    setStatus('processing');
    setTimeout(()=>{
      setStatus('success');
      onSuccess({ txn: `TXN_${Date.now().toString(36)}` });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-6">
        <h3 className="text-xl font-bold">Payment</h3>
        <p className="mt-2 text-sm text-gray-600">Amount to pay: <strong>₹{amount}</strong></p>
        <div className="mt-4">
          {status === 'idle' && <button onClick={handlePay} className="px-4 py-2 bg-green-600 text-white rounded">Pay Now</button>}
          {status === 'processing' && <div className="flex items-center gap-2"><div className="animate-spin h-5 w-5 border-2 border-green-600 rounded-full"/> Processing payment...</div>}
          {status === 'success' && <div className="text-green-600">Payment successful — allocating driver...</div>}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-1 text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
