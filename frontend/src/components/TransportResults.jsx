import React from "react";
import TransportCard from "./TransportCard";
import RouteTimeline from "./RouteTimeline";

export default function TransportResults({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Distance</div>
            <div className="text-2xl font-black">{result.route.distanceKm} km</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Recommended</div>
            <div className="text-xl font-bold">{result.route.recommendedMode}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.recommendations.map((item) => (
          <TransportCard key={item.mode} mode={item.mode} fare={item.fare} time={item.time} badge={item.isRecommended? 'best' : item.isCheapest? 'cheapest' : item.isFastest? 'fastest' : 'default'} note={item.note} />
        ))}
      </div>

      <RouteTimeline stations={result.metroRoute?.stationSequence || []} />

      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Shared cab</h3>
        <div className="mt-3 text-sm text-gray-600">
          <div>Riders: {result.sharedRide?.riderCount}</div>
          <div>Split fare: ₹{result.sharedRide?.splitFare}</div>
          <div>Match chance: {result.sharedRide?.sharedProbability}%</div>
        </div>
      </div>
    </div>
  );
}
