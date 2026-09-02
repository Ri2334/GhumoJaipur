import React from "react";
import SEOHead from "../components/SEOHead";
import { UDAIPUR_ELECTRIC_BUS_ROUTES } from "../data/udaipurTransitEngine";

export default function UdaipurTransit() {
  const ferries = [
    {
      name: "Lake Pichola Ferry Jetty (Rameshwar Ghat)",
      location: "Inside City Palace Complex",
      fare: "₹500 (Standard) / ₹800 (Sunset)",
      operatingHours: "9:00 AM - 6:00 PM",
      destinations: "Jag Mandir Island Palace & Taj Lake Palace View"
    },
    {
      name: "Fatehsagar Speedboat Jetty",
      location: "Fatehsagar Lake Promenade",
      fare: "₹100 - ₹300",
      operatingHours: "8:00 AM - 6:30 PM",
      destinations: "Nehru Park Island & Solar Observatory View"
    }
  ];

  const ropeway = {
    name: "Mansapurna Karni Mata Cable Car Ropeway",
    location: "Doodh Talai Lake Base Station",
    fare: "₹120 (Round Trip)",
    operatingHours: "9:00 AM - 9:00 PM",
    duration: "4 Mins Aerial Ride to Machhala Magra Hilltop"
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title="Udaipur Public Transit Directory — Electric Bus, Boat Ferries & Cable Car | Sheher Saathi"
        description="Official directory of Udaipur Electric City Bus routes, Lake Pichola boat ferries to Jag Mandir, Karni Mata Cable Car Ropeway, and Udiapole RSRTC Bus Stand."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
              Official Transit Network 🌅
            </span>
            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight">
              Udaipur Transit &amp; <br />
              <span className="text-[#D98A5B]">Lake Ferry Directory</span>
            </h1>
            <p className="text-sm sm:text-base text-[#E6D6C3] font-medium leading-relaxed">
              Explore official Electric City Bus routes, Lake Pichola &amp; Fatehsagar boat ferry jetties, and the Karni Mata Cable Car Ropeway.
            </p>
          </div>
        </div>

        {/* Electric Bus Routes */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚌</span>
            <div>
              <h2 className="text-2xl font-marcellus text-[#2C1E18]">Electric City Bus Routes</h2>
              <p className="text-xs text-[#543C32] font-semibold">Zero-emission air-conditioned municipal city buses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UDAIPUR_ELECTRIC_BUS_ROUTES.map((route) => (
              <div key={route.id} className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#FAF1EC] text-[#B35D38] text-xs font-black uppercase border border-[#EBC5B2]">
                    {route.busNumber}
                  </span>
                  <span className="text-xs font-bold text-[#D98A5B]">{route.operatingHours}</span>
                </div>
                <h3 className="font-marcellus text-xl text-[#2C1E18]">{route.routeName}</h3>
                <div className="text-xs font-bold text-[#543C32]">Fare: {route.fare} • {route.frequency}</div>
                
                <div className="pt-2 border-t border-[#E6D6C3] space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#A37B66]">Major Stops:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {route.stops.map((stop, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-[#FAF5EF] text-[#2C1E18] px-2.5 py-1 rounded-lg border border-[#E6D6C3]">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boat Ferries */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛥️</span>
            <div>
              <h2 className="text-2xl font-marcellus text-[#2C1E18]">Lake Boat Ferries &amp; Jetties</h2>
              <p className="text-xs text-[#543C32] font-semibold">Official municipal lake transit &amp; island access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ferries.map((f, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B35D38] text-sm">{f.location}</span>
                  <span className="text-xs font-bold text-[#2C1E18] bg-[#FAF1EC] px-3 py-1 rounded-full">{f.operatingHours}</span>
                </div>
                <h3 className="font-marcellus text-2xl text-[#2C1E18]">{f.name}</h3>
                <p className="text-xs text-[#543C32] font-medium">Destinations: {f.destinations}</p>
                <div className="text-sm font-black text-[#D98A5B]">Fare: {f.fare}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ropeway Section */}
        <div className="bg-white rounded-3xl border border-[#E6D6C3] p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚡</span>
            <div>
              <h2 className="text-2xl font-marcellus text-[#2C1E18]">{ropeway.name}</h2>
              <p className="text-xs text-[#543C32] font-semibold">{ropeway.location} • {ropeway.operatingHours}</p>
            </div>
          </div>
          <p className="text-sm text-[#543C32] font-medium leading-relaxed">{ropeway.duration}</p>
          <div className="text-lg font-black text-[#B35D38]">Fare: {ropeway.fare}</div>
        </div>

      </div>
    </div>
  );
}
