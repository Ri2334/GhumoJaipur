import React from "react";

export default function SharedRideCard({ sharedRide }) {
  if (!sharedRide) return null;
  return (
    <div className="rounded-3xl border-2 border-indigo-50 p-6 shadow-xl bg-white transition hover:border-indigo-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Shared Pool</div>
          <div className="text-2xl font-black text-gray-900">₹{sharedRide.splitFare}</div>
          <div className="text-xs text-gray-500 font-medium">Final split depends on riders</div>
        </div>
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {sharedRide.riderCount} {sharedRide.riderCount === 1 ? 'Rider' : 'Riders'}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${(sharedRide.riderCount / 4) * 100}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          <span>Match: {sharedRide.sharedProbability}%</span>
          <span>{4 - sharedRide.riderCount} Seats Left</span>
        </div>
      </div>
    </div>
  );
}
