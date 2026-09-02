import React from "react";

export default function BusRouteTimeline({ busRoute }) {
  if (!busRoute) return null;

  const renderLeg = (legInfo, stepTitle, fromStop, toStop) => {
    if (!legInfo) return null;
    const rNo = legInfo.routeNumber || legInfo.routeNo || legInfo.route?.routeNumber || 'Bus';
    const rName = legInfo.routeName || legInfo.name || legInfo.route?.routeName || '';
    const stopsPassed = legInfo.stopsPassed || legInfo.stops || [fromStop || legInfo.boardStop, toStop || legInfo.alightStop];

    return (
      <div className="mt-4 bg-[#FAF5EF] p-5 rounded-2xl border border-[#E6D6C3]">
        <div className="flex items-center justify-between border-b border-[#E6D6C3] pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B35D38] bg-[#FAF1EC] px-2.5 py-1 rounded-full border border-[#EBC5B2]">
              {stepTitle}
            </span>
            <h4 className="text-base font-bold text-[#2C1E18] mt-1">Bus Route {rNo} ({rName})</h4>
          </div>
          <div className="text-xs font-bold text-[#793A1F]">
            {legInfo.stopsCount || stopsPassed.length} Stops
          </div>
        </div>

        <div className="space-y-3 pl-2">
          {stopsPassed.map((stop, index) => (
            <div key={`${stop}-${index}`} className="flex items-start gap-3 group">
              <div className="mt-1 flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 group-hover:scale-125 ${index === 0 ? "bg-[#B35D38] ring-4 ring-[#FAF1EC]" : index === stopsPassed.length - 1 ? "bg-[#2C1E18] ring-4 ring-[#E6D6C3]" : "bg-[#D98A5B]"}`} />
                {index < stopsPassed.length - 1 && <div className="h-8 w-0.5 bg-[#E6D6C3]" />}
              </div>
              <div className="pb-1">
                <div className="font-bold text-[#2C1E18] text-xs sm:text-sm">{stop}</div>
                {index === 0 && <span className="text-[10px] font-bold text-[#B35D38]">BOARD HERE</span>}
                {index === stopsPassed.length - 1 && <span className="text-[10px] font-bold text-[#2C1E18]">ALIGHT HERE</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-marcellus text-[#2C1E18]">City Bus Route Journey</h3>
          <p className="text-xs text-[#543C32] font-medium mt-0.5">
            {busRoute.transfers === 0 
              ? 'Direct Route — No Bus Change Required' 
              : `${busRoute.transfers} Bus Transfer${busRoute.transfers > 1 ? 's' : ''} Required`}
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3.5 py-1.5 text-xs font-bold text-[#B35D38]">
            Est. ₹{busRoute.fare || 15} Total
          </span>
        </div>
      </div>

      {/* First-Mile Walk/Auto Banner if place differs from bus stop */}
      {busRoute.originPlace && busRoute.originPlace !== busRoute.sourceStop && (
        <div className="mb-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>🚶 First-Mile Access:</span>
          <span>{busRoute.firstLegWalk || "Walk / Auto"} from <strong>{busRoute.originPlace}</strong> to official <strong>{busRoute.sourceStop}</strong>.</span>
        </div>
      )}

      {/* Direct Walk Card */}
      {busRoute.type === 'walk' && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
          <div className="text-emerald-950 font-bold text-base">🚶 Direct Walk Available</div>
          <p className="text-xs text-emerald-800 font-medium">
            <strong>{busRoute.originPlace}</strong> and <strong>{busRoute.destPlace}</strong> are located in close proximity within the <strong>{busRoute.sourceStop}</strong> cluster.
          </p>
          <div className="text-xs font-bold text-emerald-700 bg-white/80 inline-block px-4 py-1.5 rounded-full border border-emerald-300">
            Est. 3-5 min walk (under 350 meters) — No bus ride needed!
          </div>
        </div>
      )}

      {/* Direct Route */}
      {busRoute.type !== 'walk' && (!busRoute.transfers || busRoute.transfers === 0 || busRoute.type === 'direct') && (
        renderLeg(busRoute.route || busRoute, "Direct Bus", busRoute.sourceStop, busRoute.destStop)
      )}

      {/* 1 Transfer (2 Buses) */}
      {busRoute.transfers === 1 && (
        <>
          {renderLeg(busRoute.route1, "Step 1: First Bus", busRoute.sourceStop, busRoute.transferStop)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              🔄 Change Bus at {busRoute.transferStop}
            </span>
          </div>
          {renderLeg(busRoute.route2, "Step 2: Second Bus", busRoute.transferStop, busRoute.destStop)}
        </>
      )}

      {/* 2 Transfers (3 Buses) */}
      {busRoute.transfers === 2 && (
        <>
          {renderLeg(busRoute.route1, "Step 1: First Bus", busRoute.sourceStop, busRoute.transferStop1)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              🔄 1st Transfer at {busRoute.transferStop1}
            </span>
          </div>
          {renderLeg(busRoute.route2, "Step 2: Second Bus", busRoute.transferStop1, busRoute.transferStop2)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              🔄 2nd Transfer at {busRoute.transferStop2}
            </span>
          </div>
          {renderLeg(busRoute.route3, "Step 3: Third Bus", busRoute.transferStop2, busRoute.destStop)}
        </>
      )}
    </div>
  );
}
