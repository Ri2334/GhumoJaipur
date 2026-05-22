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
          const subtitle = station.area || station.line || "Metro Station";
          
          return (
            <div key={`${name}-${index}`} className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center">
                <span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-indigo-600" : index === stations.length - 1 ? "bg-pink-500" : "bg-gray-300"}`} />
                {index < stations.length - 1 && <span className="h-8 w-px bg-gradient-to-b from-indigo-300 to-pink-300" />}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{name}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
