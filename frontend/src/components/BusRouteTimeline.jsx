import React from "react";

/**
 * Intelligent Multi-Modal Transit Timeline Component
 * Dynamically handles Metro (Subway), DTC Bus, Train, and Walk legs
 * with mode-specific icons, badges, transfer callouts, and clean formatting.
 */
export default function BusRouteTimeline({ busRoute }) {
  if (!busRoute) return null;

  const isMetroLeg = (legInfo) => {
    if (!legInfo) return false;
    const mode = String(legInfo.mode || legInfo.vehicleType || '').toUpperCase();
    const name = String(legInfo.routeName || legInfo.routeNumber || '').toLowerCase();
    const number = String(legInfo.routeNumber || '').toLowerCase();
    return mode === 'SUBWAY' || mode === 'METRO' || mode === 'TRAIN' || name.includes('line') || name.includes('metro') || number.includes('line') || number.includes('metro');
  };

  const renderLeg = (legInfo, stepTitle, fromStop, toStop) => {
    if (!legInfo) return null;

    const isMetro = isMetroLeg(legInfo);
    const rNo = legInfo.routeNumber || legInfo.routeNo || legInfo.route?.routeNumber || (isMetro ? 'Metro' : 'Bus');
    const rName = legInfo.routeName || legInfo.name || legInfo.route?.routeName || '';
    const stopsPassed = legInfo.stopsPassed || legInfo.stops || [fromStop || legInfo.boardStop, toStop || legInfo.alightStop];

    const icon = isMetro ? "🚇" : "🚌";
    const modeTitle = isMetro 
      ? `Delhi Metro ${rNo.toLowerCase().includes('line') ? rNo : `${rNo} Line`}`
      : `DTC Bus Route ${rNo}`;

    return (
      <div className={`mt-4 p-5 rounded-2xl border ${isMetro ? 'bg-indigo-50/50 border-indigo-200' : 'bg-[#FAF5EF] border-[#E6D6C3]'}`}>
        <div className="flex items-center justify-between border-b border-[#E6D6C3] pb-3 mb-4">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isMetro 
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300' 
                : 'bg-[#FAF1EC] text-[#B35D38] border-[#EBC5B2]'
            }`}>
              {stepTitle} • {isMetro ? 'Metro Train' : 'City Bus'}
            </span>
            <h4 className="text-base font-bold text-[#2C1E18] mt-1 flex items-center gap-2">
              <span>{icon}</span>
              <span>{modeTitle} {rName && rName !== rNo ? `(${rName})` : ''}</span>
            </h4>
          </div>
          <div className="text-xs font-bold text-[#793A1F]">
            {legInfo.stopsCount || stopsPassed.length} Stops
          </div>
        </div>

        <div className="space-y-3 pl-2">
          {stopsPassed.map((stop, index) => (
            <div key={`${stop}-${index}`} className="flex items-start gap-3 group">
              <div className="mt-1 flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 group-hover:scale-125 ${
                  index === 0 
                    ? (isMetro ? "bg-indigo-600 ring-4 ring-indigo-100" : "bg-[#B35D38] ring-4 ring-[#FAF1EC]")
                    : index === stopsPassed.length - 1 
                      ? "bg-[#2C1E18] ring-4 ring-[#E6D6C3]" 
                      : "bg-[#D98A5B]"
                }`} />
                {index < stopsPassed.length - 1 && <div className="h-8 w-0.5 bg-[#E6D6C3]" />}
              </div>
              <div className="pb-1">
                <div className="font-bold text-[#2C1E18] text-xs sm:text-sm">{stop}</div>
                {index === 0 && (
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isMetro ? 'bg-indigo-100 text-indigo-900' : 'bg-[#FAF1EC] text-[#B35D38]'
                  }`}>
                    BOARD {isMetro ? 'METRO' : 'BUS'} HERE
                  </span>
                )}
                {index === stopsPassed.length - 1 && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                    ALIGHT {isMetro ? 'METRO' : 'BUS'} HERE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const leg1IsMetro = isMetroLeg(busRoute.route1 || busRoute.route || busRoute);
  const leg2IsMetro = isMetroLeg(busRoute.route2);

  const getTransferText = () => {
    if (leg1IsMetro && !leg2IsMetro) {
      return `🔄 Transfer from Delhi Metro to DTC Bus at ${busRoute.transferStop}`;
    }
    if (!leg1IsMetro && leg2IsMetro) {
      return `🔄 Transfer from DTC Bus to Delhi Metro at ${busRoute.transferStop}`;
    }
    if (leg1IsMetro && leg2IsMetro) {
      return `🔄 Interchange Metro Line at ${busRoute.transferStop}`;
    }
    return `🔄 Change Bus at ${busRoute.transferStop}`;
  };

  const hasMetro = leg1IsMetro || leg2IsMetro;
  const hasBus = (!leg1IsMetro && busRoute.route1) || (!leg2IsMetro && busRoute.route2) || (!leg1IsMetro && !busRoute.route1);

  const mainHeaderTitle = hasMetro && hasBus
    ? 'Multi-Modal Transit Journey (Metro + Bus)'
    : hasMetro
      ? 'Delhi Metro Transit Journey'
      : 'City Bus Route Journey';

  return (
    <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-marcellus text-[#2C1E18] flex items-center gap-2">
            <span>{hasMetro ? '🚇' : '🚌'}</span>
            <span>{mainHeaderTitle}</span>
          </h3>
          <p className="text-xs text-[#543C32] font-medium mt-0.5">
            {busRoute.transfers === 0 
              ? 'Direct Route — No Vehicle Transfer Required' 
              : `${busRoute.transfers} Transfer${busRoute.transfers > 1 ? 's' : ''} Required`}
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3.5 py-1.5 text-xs font-bold text-[#B35D38]">
            Est. {busRoute.fare && busRoute.fare !== 'Information unavailable' ? busRoute.fare : 'Fare Info'}
          </span>
        </div>
      </div>

      {/* First-Mile Walk/Auto Banner */}
      {busRoute.firstMile ? (
        <div className="mb-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>🚶 First-Mile Access:</span>
          <span>{busRoute.firstMile.label} to official boarding stop <strong>{busRoute.boardStop || busRoute.sourceStop}</strong>.</span>
        </div>
      ) : (busRoute.originPlace && busRoute.originPlace !== busRoute.sourceStop && (
        <div className="mb-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>🚶 First-Mile Access:</span>
          <span>{busRoute.firstLegWalk || "Walk / Auto"} from <strong>{busRoute.originPlace}</strong> to official <strong>{busRoute.sourceStop}</strong>.</span>
        </div>
      ))}

      {/* Direct Walk Card */}
      {busRoute.type === 'walk' && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
          <div className="text-emerald-950 font-bold text-base">🚶 Direct Walk Available</div>
          <p className="text-xs text-emerald-800 font-medium">
            <strong>{busRoute.originPlace}</strong> and <strong>{busRoute.destPlace}</strong> are located in close proximity within the <strong>{busRoute.sourceStop}</strong> cluster.
          </p>
          <div className="text-xs font-bold text-emerald-700 bg-white/80 inline-block px-4 py-1.5 rounded-full border border-emerald-300">
            Est. 3-5 min walk (under 350 meters) — No transit ride needed!
          </div>
        </div>
      )}

      {/* Direct Route */}
      {busRoute.type !== 'walk' && (!busRoute.transfers || busRoute.transfers === 0 || busRoute.type === 'direct') && (
        renderLeg(busRoute.route || busRoute, "Step 1: Direct Transit", busRoute.boardStop || busRoute.sourceStop, busRoute.alightStop || busRoute.destStop)
      )}

      {/* 1 Transfer (2 Vehicles) */}
      {busRoute.transfers === 1 && (
        <>
          {renderLeg(busRoute.route1, "Step 1", busRoute.boardStop || busRoute.sourceStop, busRoute.transferStop)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              {getTransferText()}
            </span>
          </div>
          {renderLeg(busRoute.route2, "Step 2", busRoute.transferStop, busRoute.alightStop || busRoute.destStop)}
        </>
      )}

      {/* 2 Transfers (3 Vehicles) */}
      {busRoute.transfers === 2 && (
        <>
          {renderLeg(busRoute.route1, "Step 1", busRoute.boardStop || busRoute.sourceStop, busRoute.transferStop1)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              🔄 1st Transfer at {busRoute.transferStop1}
            </span>
          </div>
          {renderLeg(busRoute.route2, "Step 2", busRoute.transferStop1, busRoute.transferStop2)}
          <div className="my-4 border-t-2 border-dashed border-[#B35D38]/40 pt-4 text-center">
            <span className="inline-block bg-[#2C1E18] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm">
              🔄 2nd Transfer at {busRoute.transferStop2}
            </span>
          </div>
          {renderLeg(busRoute.route3, "Step 3", busRoute.transferStop2, busRoute.alightStop || busRoute.destStop)}
        </>
      )}

      {/* Last-Mile Walk/Auto Banner */}
      {busRoute.lastMile && (
        <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>🏁 Last-Mile Access:</span>
          <span>{busRoute.lastMile.label} from alighting stop <strong>{busRoute.alightStop || busRoute.destStop}</strong> to destination.</span>
        </div>
      )}
    </div>
  );
}
