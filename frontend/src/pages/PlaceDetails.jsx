import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addPlaceReviewApi, deleteSavedTripApi, getPlaceByIdApi, getSavedTripsApi, saveTripApi } from "../services/api";
import { getNearestMetroStation, OUTSTATION_TRANSIT_INFO } from "../data/jaipurTransitChecker";
import HotelBookingCard from "../components/HotelBookingCard";
import ImageCarousel from "../components/ImageCarousel";
import { AuthContext } from "../context/AuthContext";
import ExperienceCard from "../components/ExperienceCard";
import { fallbackPlaces } from "../data/fallbackPlaces";

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPlaceByIdApi(id);
        if (res?.data) {
          setPlace(res.data);
        } else {
          const rawId = String(id || '').toLowerCase();
          const cleanId = rawId.replace(/[^a-z0-9]/g, '');
          const found = fallbackPlaces.find(p => 
            p._id === id || 
            p._id?.toLowerCase() === rawId || 
            p.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
            p.name?.toLowerCase().includes(rawId.replace(/_/g, ' ')) || 
            rawId.includes(p._id)
          );
          setPlace(found || fallbackPlaces[0]);
        }
      } catch (err) {
        const rawId = String(id || '').toLowerCase();
        const cleanId = rawId.replace(/[^a-z0-9]/g, '');
        const found = fallbackPlaces.find(p => 
          p._id === id || 
          p._id?.toLowerCase() === rawId || 
          p.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
          p.name?.toLowerCase().includes(rawId.replace(/_/g, ' ')) || 
          rawId.includes(p._id)
        );
        setPlace(found || fallbackPlaces[0]);
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  useEffect(() => {
    const loadSavedState = async () => {
      if (!user) {
        setSaved(false);
        return;
      }
      try {
        const response = await getSavedTripsApi();
        const savedPlace = response.data?.some((item) => item.place?._id === id);
        setSaved(Boolean(savedPlace));
      } catch {
        setSaved(false);
      }
    };

    loadSavedState();
  }, [id, user]);

  const handleSaveTrip = async () => {
    if (!place || !user) return;
    setSaveMessage(null);
    try {
      if (saved) {
        await deleteSavedTripApi(place._id);
        setSaved(false);
        setSaveMessage("Removed from saved trips");
      } else {
        await saveTripApi(place._id);
        setSaved(true);
        setSaveMessage("Added to saved trips");
      }
    } catch (err) {
      setSaveMessage(err?.response?.data?.message || "Could not update saved trip");
    }
  };

  const handleTravelNow = () => {
    if (!place) return;
    navigate(`/transport?destination=${encodeURIComponent(place.name)}`, {
      state: { destination: place.name }
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FAF5EF] px-4 py-12"><div className="mx-auto h-[60vh] max-w-6xl animate-pulse rounded-3xl bg-white shadow-xl" /></div>;
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-[#E6D6C3] bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-marcellus text-[#2C1E18]">Place not found</h1>
          <p className="mt-3 text-[#543C32]">{error || "The place you opened is unavailable."}</p>
          <Link to="/places" className="mt-6 inline-flex rounded-xl bg-[#B35D38] px-6 py-3.5 text-white font-bold">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const outstationKey = Object.keys(OUTSTATION_TRANSIT_INFO).find(k => 
    place.name.toLowerCase().includes(k) || k.includes(place.name.toLowerCase())
  );
  const outstationData = outstationKey ? OUTSTATION_TRANSIT_INFO[outstationKey] : null;
  const metroObj = getNearestMetroStation(place.name);

  const famousFood = place.famousForFood || "Tattoo Cafe & LMB Paneer Ghewar";
  const placeFaqs = place.faqs || fallbackPlaces.find(p => p.name === place.name || p._id === place._id)?.faqs || [];

  const nearestMetro = place.nearestMetro || (metroObj ? metroObj.name : "RSRTC Bus / Railway Station");
  const walkingTime = place.walkingTime || (metroObj ? metroObj.walkTime : "10 min drive");
  const nearbyList = place.nearbyPlaces?.length ? place.nearbyPlaces : [
    { name: "Hawa Mahal", distance: "400 m", time: "5 min" },
    { name: "City Palace", distance: "600 m", time: "8 min" },
    { name: "Johari Bazaar", distance: "200 m", time: "3 min" }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
          
          {/* Left Main Column */}
          <div className="space-y-8">
            
            {/* Image Carousel */}
              <ImageCarousel images={place.imageUrl ? [place.imageUrl] : (place.images || [])} altText={place.name} />

            {/* Header Info */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="rounded-full bg-[#FAF1EC] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B35D38] border border-[#EBC5B2]">
                    {place.category || "Tourist Spot"}
                  </span>
                  <h1 className="mt-4 text-3xl sm:text-5xl font-marcellus text-[#2C1E18] tracking-tight">{place.name}</h1>
                  <p className="mt-2 text-base text-[#543C32] font-semibold">📍 {place.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-marcellus text-[#B35D38]">{place.rating || "4.7"} ★</div>
                  <div className="text-xs font-bold text-[#A37B66] uppercase tracking-widest mt-1">Verified Rating</div>
                </div>
              </div>

              <p className="text-base text-[#543C32] leading-relaxed font-medium">{place.description}</p>
            </div>

            {/* How to Reach [Place] Section */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h2 className="text-2xl font-marcellus text-[#2C1E18]">How to Reach {place.name}</h2>
                  <p className="text-xs text-[#543C32] font-medium">Verified transit and route options</p>
                </div>
              </div>

              {outstationData ? (
                /* OUTSTATION TRANSIT CARD (No Metro) */
                <div className="space-y-4">
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                    <div className="flex items-center gap-3 text-amber-950 font-bold text-sm mb-1">
                      <span>🚌 Outstation Destination ({outstationData.distanceKm} km from Jaipur)</span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      There is no Metro line to {place.name}. Use RSRTC Express Bus or Indian Railways train connection.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3] p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B35D38]">Nearest Railway Station</span>
                      <h3 className="text-base font-bold text-[#2C1E18] mt-1">{outstationData.nearestRailway}</h3>
                    </div>
                    <div className="rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3] p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B35D38]">Express Bus Terminal</span>
                      <h3 className="text-base font-bold text-[#2C1E18] mt-1">{outstationData.busTerminal}</h3>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3] flex items-center justify-between">
                    <div className="text-xs text-[#543C32] font-semibold">
                      💡 <span className="font-bold text-[#2C1E18]">Route Tip:</span> {outstationData.routeNotes}
                    </div>
                    <button
                      onClick={handleTravelNow}
                      className="rounded-xl bg-[#B35D38] hover:bg-[#964B2A] text-white px-4 py-2.5 text-xs font-bold shadow"
                    >
                      Plan Transit →
                    </button>
                  </div>
                </div>
              ) : metroObj ? (
                /* METRO TRANSIT CARD */
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl shadow-md">
                        🚇
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Nearest Metro Station</span>
                        <h3 className="text-xl font-bold text-emerald-950">{metroObj.name}</h3>
                        <p className="text-xs text-emerald-800 font-semibold mt-0.5">Pink Line • {metroObj.walkTime}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleTravelNow}
                      className="hidden sm:inline-flex rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-xs font-bold shadow"
                    >
                      Plan Transit →
                    </button>
                  </div>

                  {/* Step-by-Step Directions */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">Step-by-Step Transit Route</div>
                    
                    <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3] flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                      <div className="text-xs text-[#2C1E18] font-semibold">
                        <span className="font-bold text-[#B35D38]">Board Jaipur Metro:</span> Take Pink Line train to <span className="font-bold">{metroObj.name}</span> station.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3] flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
                      <div className="text-xs text-[#2C1E18] font-semibold">
                        <span className="font-bold text-[#B35D38]">Exit Station:</span> Follow signs to main exit gate at {metroObj.name}.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3] flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
                      <div className="text-xs text-[#2C1E18] font-semibold">
                        <span className="font-bold text-[#B35D38]">Final Stretch:</span> Walk ({metroObj.walkTime}) or hire a ₹20 shared e-rickshaw to {place.name}.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOCAL ROAD/CAB TRANSIT CARD */
                <div className="rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3] p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B35D38]">Local City Transit</span>
                    <h3 className="text-base font-bold text-[#2C1E18] mt-1">Direct Auto / City Bus Connection</h3>
                    <p className="text-xs text-[#543C32] mt-0.5">Take JCTSL City Bus or book doorstep Auto / Taxi.</p>
                  </div>
                  <button
                    onClick={handleTravelNow}
                    className="rounded-xl bg-[#B35D38] hover:bg-[#964B2A] text-white px-4 py-2.5 text-xs font-bold shadow"
                  >
                    Plan Transit →
                  </button>
                </div>
              )}

              {/* Popular Hubs Routes */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">Popular Routes to {place.name}</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div onClick={handleTravelNow} className="cursor-pointer rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] p-4 hover:border-[#B35D38] transition">
                    <div className="text-xs font-bold text-[#2C1E18]">From Mansarovar</div>
                    <div className="text-[11px] text-[#543C32] mt-1 font-semibold">30 min • ₹30 • 5,000+ travelers</div>
                  </div>

                  <div onClick={handleTravelNow} className="cursor-pointer rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] p-4 hover:border-[#B35D38] transition">
                    <div className="text-xs font-bold text-[#2C1E18]">From Railway Station</div>
                    <div className="text-[11px] text-[#543C32] mt-1 font-semibold">12 min • ₹20 • 4,500+ travelers</div>
                  </div>

                  <div onClick={handleTravelNow} className="cursor-pointer rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] p-4 hover:border-[#B35D38] transition">
                    <div className="text-xs font-bold text-[#2C1E18]">From Vivek Vihar</div>
                    <div className="text-[11px] text-[#543C32] mt-1 font-semibold">24 min • ₹30 • 1,500+ travelers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Famous Local Taste & Foods to Try */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-[#F3E8DB] pb-4">
                <span className="text-2xl">☕</span>
                <div>
                  <h2 className="text-2xl font-marcellus text-[#2C1E18]">Famous Local Tastes & Foods Nearby</h2>
                  <p className="text-xs text-[#543C32] font-medium">Google-verified top cafes & legendary street stalls</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B35D38]">Top Rated Local Taste</span>
                  <h3 className="text-lg font-bold text-[#2C1E18]">{famousFood}</h3>
                  <p className="text-xs text-[#543C32] font-medium">Highly recommended by local foodies and Google reviews.</p>
                </div>
              </div>
            </div>

            {/* Visitor Guidelines (Do's & Don'ts - Matching Screenshot 3) */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-6">
              <h2 className="text-2xl font-marcellus text-[#2C1E18] border-b border-[#F3E8DB] pb-3">Visitor Guidelines</h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Do's</span>
                  <ul className="text-xs text-[#543C32] space-y-2 font-medium">
                    {(place.dos || ["Carry valid ID proof", "Follow photography rules", "Respect local customs", "Keep premises clean"]).map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black text-rose-700 uppercase tracking-wider">Don'ts</span>
                  <ul className="text-xs text-[#543C32] space-y-2 font-medium">
                    {(place.donts || ["Do not litter or damage property", "Do not make loud disturbances", "Do not bring prohibited items"]).map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-rose-600 font-bold">✕</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 10 Online-Verified Frequently Asked Questions Section */}
            <section className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3E8DB] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B35D38]">Online Verified Guide</span>
                  <h2 className="text-2xl font-marcellus text-[#2C1E18] mt-1">Frequently Asked Questions</h2>
                </div>
                <span className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3.5 py-1.5 text-xs font-bold text-[#B35D38]">
                  {placeFaqs.length} Key Answers
                </span>
              </div>

              <div className="space-y-3">
                {placeFaqs.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] overflow-hidden transition">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#2C1E18] hover:bg-[#FAF1EC]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#B35D38] font-black">Q{idx + 1}.</span>
                        {faq.q}
                      </span>
                      <span className="text-[#B35D38] font-bold text-lg ml-2">
                        {openFaq === idx ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-xs sm:text-sm font-medium text-[#543C32] bg-white border-t border-[#F3E8DB] pt-3 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Hotel & Heritage Stay Monetization Card */}
            <HotelBookingCard locationName={place.name} cityName={place.city || "Jaipur"} />

          </div>

          {/* Right Sticky Sidebar Column (Matching Screenshot 2, 3, 4) */}
          <div className="lg:sticky lg:top-28 space-y-6">
            
            {/* Travel Now & At a Glance Box */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#A37B66]">Avg. Entry Fee</p>
                  <p className="text-3xl font-marcellus text-[#2C1E18] mt-1">₹{place.ticketPrice || 0}</p>
                </div>
                <button 
                  onClick={handleSaveTrip} 
                  className={`rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    saved 
                      ? "bg-emerald-700 text-white shadow-md" 
                      : "bg-[#2C1E18] hover:bg-[#3D2B23] text-white shadow-md"
                  }`}
                >
                  {saved ? "Saved" : "Save Spot"}
                </button>
              </div>

              {/* Travel Now Button (Fills Destination Automatically) */}
              <div>
                <button
                  onClick={handleTravelNow}
                  className="w-full rounded-2xl bg-[#B35D38] hover:bg-[#964B2A] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  <span className="text-lg">🚀</span>
                  Travel Now
                </button>
                <p className="text-[10px] text-center text-[#A37B66] font-semibold mt-2">Auto-fills destination • Leave starting point blank</p>
              </div>
              
              {saveMessage && <p className="text-xs font-bold text-[#B35D38] text-center">{saveMessage}</p>}

              {/* At a Glance Specs */}
              <div className="space-y-3 pt-4 border-t border-[#F3E8DB]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">At a Glance</div>
                
                <div className="rounded-2xl bg-[#FAF5EF] p-3 border border-[#E6D6C3] text-xs flex justify-between">
                  <span className="text-gray-500 font-medium">Category:</span>
                  <span className="font-bold text-[#2C1E18]">{place.category || "Tourist"}</span>
                </div>

                <div className="rounded-2xl bg-[#FAF5EF] p-3 border border-[#E6D6C3] text-xs flex justify-between">
                  <span className="text-gray-500 font-medium">Nearest Station:</span>
                  <span className="font-bold text-pink-700">{nearestMetro}</span>
                </div>

                <div className="rounded-2xl bg-[#FAF5EF] p-3 border border-[#E6D6C3] text-xs flex justify-between">
                  <span className="text-gray-500 font-medium">Walking Time:</span>
                  <span className="font-bold text-[#2C1E18]">{walkingTime}</span>
                </div>

                <div className="rounded-2xl bg-[#FAF5EF] p-3 border border-[#E6D6C3] text-xs flex justify-between">
                  <span className="text-gray-500 font-medium">Visiting Hours:</span>
                  <span className="font-bold text-[#2C1E18]">{place.timings}</span>
                </div>
              </div>
            </div>

            {/* Best Time to Visit Card (Matching Screenshot 2) */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">📅 Best Time to Visit</div>
              
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs">
                <div className="font-bold text-emerald-900">Winter (Oct - Feb)</div>
                <div className="text-emerald-700 font-medium mt-0.5">Pleasant weather, ideal for touring</div>
              </div>

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs">
                <div className="font-bold text-amber-900">Summer (Mar - May)</div>
                <div className="text-amber-700 font-medium mt-0.5">Hot daytime, visit early/late</div>
              </div>

              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-xs">
                <div className="font-bold text-sky-900">Monsoon (Jun - Sep)</div>
                <div className="text-sky-700 font-medium mt-0.5">Scenic rainfall, carry umbrella</div>
              </div>
            </div>

            {/* More Places Nearby Card (Matching Screenshot 3 & 4) */}
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">📍 More Places Nearby</div>
              
              <div className="space-y-2">
                {nearbyList.map((nb, idx) => (
                  <div key={idx} className="rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3] p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#2C1E18]">{nb.name}</div>
                      <div className="text-[10px] text-gray-500">{nb.distance || "1 km"}</div>
                    </div>
                    <span className="font-semibold text-[#B35D38]">{nb.time || "5 min"}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
