import React from "react";

export default function SharedRideCard({ sharedRide }) {
  if (!sharedRide) return null;
  return (
    <div className="rounded-3xl border p-4 shadow-sm bg-white/90">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Shared Cab</div>
          <div className="text-lg font-black">Split ₹{sharedRide.splitFare}</div>
        </div>
        <div className="text-right text-sm text-gray-600">{sharedRide.riderCount} riders</div>
      </div>
      <div className="mt-2 text-sm text-gray-600">Match chance: {sharedRide.sharedProbability}%</div>
    </div>
  );
}
