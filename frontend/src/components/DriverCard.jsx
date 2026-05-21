import React from 'react';

export default function DriverCard({ driver }) {
  if (!driver) return null;
  return (
    <div className="rounded-xl border p-4 flex items-center gap-4 bg-white">
      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">🚗</div>
      <div className="flex-1">
        <div className="font-semibold">{driver.name} <span className="text-sm text-gray-500">· {driver.rating || ''}</span></div>
        <div className="text-sm text-gray-600">{driver.vehicle} · {driver.vehicleNumber}</div>
        <div className="text-sm text-gray-500">Arrival: {driver.arrival || '3 mins'}</div>
      </div>
    </div>
  );
}
