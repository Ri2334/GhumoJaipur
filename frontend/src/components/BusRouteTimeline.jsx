import React from "react";

export default function BusRouteTimeline({ busRoute }) {
  if (!busRoute) return null;

  const renderRoute = (route, title, sourceStop, destStop) => {
    if (!route || !route.stops) return null;
    
    // Find relevant stops in the sequence
    const stops = route.stops;
    const startIndex = stops.indexOf(sourceStop);
    const endIndex = stops.indexOf(destStop);
    
    let relevantStops = [];
    if (startIndex !== -1 && endIndex !== -1) {
        relevantStops = startIndex <= endIndex 
            ? stops.slice(startIndex, endIndex + 1)
            : stops.slice(endIndex, startIndex + 1).reverse();
    } else {
        relevantStops = stops;
    }

    return (
      <div className="mt-4">
        <h4 className="text-sm font-bold text-gray-700 mb-3">{title}</h4>
        <div className="space-y-3">
          {relevantStops.map((stop, index) => (
            <div key={`${stop}-${index}`} className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center">
                <span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-sky-600" : index === relevantStops.length - 1 ? "bg-sky-500" : "bg-gray-300"}`} />
                {index < relevantStops.length - 1 && <span className="h-8 w-px bg-gradient-to-b from-sky-300 to-sky-100" />}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{stop}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur">
      <h3 className="text-lg font-bold text-gray-900">Bus route timeline</h3>
      {busRoute.type === 'direct' ? (
        renderRoute(busRoute.route, `Route ${busRoute.route.routeNumber}`, busRoute.sourceStop, busRoute.destStop)
      ) : (
        <>
          {renderRoute(busRoute.route1, `Step 1: Route ${busRoute.route1.routeNumber}`, busRoute.sourceStop, busRoute.transferStop)}
          <div className="my-4 border-t border-dashed border-gray-300 pt-4">
            <div className="text-xs font-black text-amber-600 uppercase tracking-widest">Transfer at {busRoute.transferStop}</div>
          </div>
          {renderRoute(busRoute.route2, `Step 2: Route ${busRoute.route2.routeNumber}`, busRoute.transferStop, busRoute.destStop)}
        </>
      )}
    </div>
  );
}
