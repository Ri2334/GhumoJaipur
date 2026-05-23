import React from "react";

export default function RouteTimeline({ stations = [] }) {
  if (!stations || !Array.isArray(stations) || !stations.length) return null;

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur">
      <h3 className="text-lg font-bold text-gray-900">Metro route timeline</h3>
      <div className="mt-4 space-y-3">
        {stations.map((station, index) => {
          if (!station) return null;
          const name = station.name || "Station";
          const subtitle = station.area || "Metro Station";
          
          return (
            <div key={`${name}-${index}`} className="flex items-start gap-3 group">
              <div className="mt-1 flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 group-hover:scale-125 ${index === 0 ? "bg-indigo-600 ring-4 ring-indigo-100" : index === stations.length - 1 ? "bg-pink-500 ring-4 ring-pink-100" : "bg-gray-300"}`} />
                {index < stations.length - 1 && <div className="h-10 w-0.5 bg-gradient-to-b from-indigo-200 via-gray-200 to-pink-200" />}
              </div>
              <div className="pb-2">
                <div className="font-bold text-gray-900 text-sm">{name}</div>
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
