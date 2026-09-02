import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CityContext } from "../context/CityContext";
import GoogleAd from "../components/GoogleAd";
import SEOHead from "../components/SEOHead";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { currentCity, switchCity, cityDetails, isUdaipur } = useContext(CityContext);
  const navigate = useNavigate();

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistCity, setWaitlistCity] = useState("Delhi");
  const [submitted, setSubmitted] = useState(false);
  const [quickSource, setQuickSource] = useState(cityDetails.defaultSource);
  const [quickDest, setQuickDest] = useState(cityDetails.defaultDest);

  useEffect(() => {
    setQuickSource(cityDetails.defaultSource);
    setQuickDest(cityDetails.defaultDest);
  }, [currentCity, cityDetails]);

  const cities = [
    {
      id: "jaipur",
      name: "Jaipur",
      tagline: "The Pink City",
      status: "active",
      badge: "LIVE NOW 🟢",
      desc: "Full smart transport, metro integration, verified drivers & 140+ heritage guides active.",
      image: "https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/hawamahal_owadja.jpg",
      placesCount: "140+ Places",
      transportTypes: "Bus • Metro • Auto • Cab"
    },
    {
      id: "udaipur",
      name: "Udaipur",
      tagline: "City of Lakes",
      status: "active",
      badge: "LIVE NOW 🟢",
      desc: "Full lakeside boat ferries, Karni Mata ropeway, UCTSL electric city bus, & heritage palace guides active.",
      image: "/udaipur.jpg",
      placesCount: "30+ Places",
      transportTypes: "Boat • Ropeway • Bus • Auto"
    },
    {
      id: "delhi",
      name: "Delhi",
      tagline: "Capital of Heritage",
      status: "coming_soon",
      badge: "COMING SOON ⏳",
      desc: "Connecting Chandni Chowk to CP. Launching winter 2026.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      placesCount: "35+ Planned",
      transportTypes: "DMRC Metro • Auto"
    },
    {
      id: "mumbai",
      name: "Mumbai",
      tagline: "The Dream City",
      status: "coming_soon",
      badge: "COMING SOON ⏳",
      desc: "Local train integration & coastal transit logic.",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
      placesCount: "40+ Planned",
      transportTypes: "Local • Metro • Cabs"
    },
    {
      id: "varanasi",
      name: "Varanasi",
      tagline: "Spiritual Capital",
      status: "coming_soon",
      badge: "COMING SOON ⏳",
      desc: "Ghat navigation & heritage walking paths.",
      image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80",
      placesCount: "20+ Planned",
      transportTypes: "E-Rickshaw • Boats"
    },
    {
      id: "bengaluru",
      name: "Bengaluru",
      tagline: "Garden City",
      status: "coming_soon",
      badge: "COMING SOON ⏳",
      desc: "Namma Metro logic & tech park ride-pooling.",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      placesCount: "30+ Planned",
      transportTypes: "Namma Metro • Auto"
    }
  ];

  const handleQuickRouteSearch = (e) => {
    e.preventDefault();
    if (quickDest) {
      navigate(`/transport?destination=${encodeURIComponent(quickDest)}`);
    }
  };

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setWaitlistEmail("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title={`Sheher Saathi (Shehar App) — Har Sheher. Apna Sa. | Smart City Travel App for ${cityDetails.name}`}
        description={`Sheher Saathi (Shehar App) is India's premier smart city companion. Explore ${cityDetails.placesCount} verified places, real-time public transit routes, local food, and royal hotel stays in ${cityDetails.name}.`}
        keywords={`Sheher Saathi, Shehar Saathi, Shehar App, Sheher App, ${cityDetails.name} travel app, ${cityDetails.name} transport app, Ghumo ${cityDetails.name}`}
      />
      
      {/* HYPER ATTRACTIVE HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#1C110C] via-[#2C1E18] to-[#241712] text-[#FAF5EF] overflow-hidden">
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#B35D38]/20 rounded-full blur-[150px] pointer-events-none animate-ambient" />
        <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-[#D98A5B]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Dynamic Logo Crest */}
            <div className="relative mb-8 group">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#D98A5B] via-[#F3C4A5] to-[#B35D38] opacity-75 blur-md group-hover:opacity-100 transition duration-500" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-[#FAF5EF] p-3.5 shadow-2xl border-2 border-[#E6D6C3] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.png" alt="Sheher Saathi Emblem" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Live Ticker Pill */}
            <div className="inline-flex items-center gap-2.5 bg-[#3D2B23]/90 border border-[#D98A5B]/40 px-5 py-2 rounded-full mb-8 shadow-xl backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D98A5B]">
                HAR SHEHER, APNA SA. • ACTIVE IN {cityDetails.name.toUpperCase()} {isUdaipur ? "🌅" : "🏰"}
              </span>
            </div>

            {/* Main Shimmer Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-marcellus tracking-tight leading-[1.08] max-w-5xl">
              Your Intelligent <br />
              <span className="gradient-text-shimmer drop-shadow-md">
                Urban Companion
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-[#E6D6C3] leading-relaxed font-medium opacity-90">
              Navigating India’s most vibrant cities with real-time public transit logic, 
              verified local drivers, &amp; curated heritage journeys.
            </p>

            {/* Interactive Hero Quick Route Search Widget */}
            <div className="mt-10 w-full max-w-3xl glass-dark-gold p-6 rounded-3xl shadow-2xl gold-glow-border border border-[#D98A5B]/30">
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#D98A5B] mb-3 text-left flex items-center justify-between">
                <span>🚀 Instant {cityDetails.name} Transit Finder</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  Real-time Route &amp; Fare Logic
                </span>
              </div>
              
              <form onSubmit={handleQuickRouteSearch} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-sm">📍</span>
                  <input
                    type="text"
                    value={quickSource}
                    onChange={(e) => setQuickSource(e.target.value)}
                    placeholder={`Origin e.g. ${cityDetails.defaultSource}`}
                    className="w-full rounded-2xl bg-[#1C110C]/90 border border-[#D98A5B]/30 pl-9 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-white placeholder-gray-400 outline-none focus:border-[#D98A5B]"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-sm">{isUdaipur ? "🌅" : "🏰"}</span>
                  <input
                    type="text"
                    value={quickDest}
                    onChange={(e) => setQuickDest(e.target.value)}
                    placeholder={`Destination e.g. ${cityDetails.defaultDest}`}
                    className="w-full rounded-2xl bg-[#1C110C]/90 border border-[#D98A5B]/30 pl-9 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-white placeholder-gray-400 outline-none focus:border-[#D98A5B]"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-[#B35D38] to-[#D98A5B] hover:from-[#964B2A] hover:to-[#B35D38] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span>Find Route</span>
                  <span>→</span>
                </button>
              </form>

              {/* Popular Destination Shortcuts */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-left">
                <span className="text-[11px] font-bold text-[#A37B66] uppercase tracking-wider">Quick Spots:</span>
                {cityDetails.popularSpots.map((spot) => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => {
                      setQuickDest(spot);
                      navigate(`/transport?destination=${encodeURIComponent(spot)}`);
                    }}
                    className="rounded-xl bg-[#3D2B23]/80 border border-[#543C32] hover:border-[#D98A5B] px-3 py-1 text-[11px] font-bold text-[#E6D6C3] hover:text-white transition"
                  >
                    📍 {spot}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to={`/places?city=${currentCity}`}
                className="w-full sm:w-auto bg-gradient-to-r from-[#B35D38] via-[#D98A5B] to-[#B35D38] text-white px-10 py-4.5 rounded-2xl font-bold text-lg hover:brightness-110 transition shadow-2xl hover:shadow-[#B35D38]/40 flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
              >
                <span>Explore {cityDetails.placesCount} {cityDetails.name} Places</span>
                <span className="text-xl">{isUdaipur ? "🌅" : "🏰"}</span>
              </Link>

              <Link 
                to="/transport" 
                className="w-full sm:w-auto bg-[#3D2B23]/90 border border-[#543C32] text-[#FAF5EF] px-8 py-4.5 rounded-2xl font-bold text-lg hover:bg-[#4A362B] transition flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Smart {cityDetails.name} Transit</span>
                <span className="text-[#D98A5B]">🚌</span>
              </Link>
            </div>

            {/* Glowing Stats Counter Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#3D2B23]/80 w-full max-w-4xl text-center">
              <div className="p-4 rounded-2xl bg-[#241712]/60 border border-[#3D2B23]">
                <div className="text-3xl sm:text-4xl font-marcellus text-[#FAF5EF]">170+</div>
                <div className="text-xs uppercase tracking-widest text-[#D98A5B] font-bold mt-1">Verified Destinations</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#241712]/60 border border-[#3D2B23]">
                <div className="text-3xl sm:text-4xl font-marcellus text-emerald-400">100%</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">Live Multi-City Engine</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#241712]/60 border border-[#3D2B23]">
                <div className="text-3xl sm:text-4xl font-marcellus text-[#FAF5EF]">4.9 ★</div>
                <div className="text-xs uppercase tracking-widest text-[#D98A5B] font-bold mt-1">Traveler Rating</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#241712]/60 border border-[#3D2B23]">
                <div className="text-3xl sm:text-4xl font-marcellus text-[#D98A5B]">6 Cities</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">In Expansion</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ADVERTISEMENT CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <GoogleAd slot="1234567890" format="auto" responsive="true" />
      </section>

      {/* ACTIVE CITIES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-[#FAF1EC] text-[#B35D38] text-xs font-black uppercase tracking-widest border border-[#EBC5B2]">
            Multi-City Network Expansion 🌐
          </span>
          <h2 className="text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">
            Explore Operational &amp; <br />
            <span className="text-[#B35D38]">Upcoming Smart Cities</span>
          </h2>
          <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
            Sheher Saathi is scaling across India's top heritage and urban hubs. Click any live city to explore places and transit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((c) => (
            <div 
              key={c.id} 
              className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl ${
                c.status === 'active' 
                  ? 'border-[#E6D6C3] bg-white hover:shadow-2xl hover:-translate-y-1' 
                  : 'border-[#E6D6C3]/60 bg-[#FAF5EF]/60 opacity-80'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
                      c.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-[#3D2B23] text-[#D98A5B]'
                    }`}>
                      {c.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-marcellus text-3xl leading-none">{c.name}</h3>
                    <p className="text-xs text-[#E6D6C3] font-medium mt-1">{c.tagline}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#543C32] leading-relaxed font-medium">{c.desc}</p>
                  
                  <div className="pt-3 border-t border-[#E6D6C3] flex items-center justify-between text-xs font-bold text-[#A37B66]">
                    <span>Places Covered</span>
                    <span className="bg-[#FAF1EC] text-[#B35D38] px-3 py-1 rounded-full border border-[#EBC5B2] font-black">{c.placesCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#543C32] font-semibold">
                    <span>Transit Options</span>
                    <span className="font-bold text-[#2C1E18]">{c.transportTypes}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                {c.status === 'active' ? (
                  <div className="space-y-2.5">
                    <button 
                      onClick={() => {
                        switchCity(c.id);
                        navigate(`/places?city=${c.id}`);
                      }}
                      className="w-full bg-[#B35D38] hover:bg-[#964B2A] text-white py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:shadow-[#B35D38]/30 flex items-center justify-center gap-2"
                    >
                      <span>Explore {c.placesCount} {c.name} Spots</span>
                      <span>→</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setWaitlistCity(c.name);
                      document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#FAF5EF] text-[#B35D38] border border-[#B35D38]/30 py-3.5 rounded-2xl font-bold hover:bg-[#B35D38] hover:text-white transition text-xs uppercase tracking-wider"
                  >
                    Request {c.name} Launch 🚀
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC CITY SPOTLIGHT */}
      <section className="py-24 bg-gradient-to-br from-[#2C1E18] via-[#241712] to-[#1C110C] text-[#FAF5EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D2B23] border border-[#543C32] text-xs font-bold uppercase tracking-widest text-[#D98A5B] mb-6">
                <span>Operational City Network</span>
                <span>{isUdaipur ? "🌅" : "🏰"}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-marcellus text-[#FAF5EF] leading-tight mb-6">
                Experience <span className="text-[#D98A5B]">{cityDetails.name}</span> with <br />
                Smart Urban Intelligence
              </h2>
              
              <p className="text-base sm:text-lg text-[#E6D6C3] leading-relaxed mb-8 font-medium opacity-90">
                {isUdaipur
                  ? "From the pristine shores of Lake Pichola to the heights of Sajjangarh Monsoon Palace, Sheher Saathi provides real-time UCTSL electric bus routes, lake boat ferries, Karni Mata cable car ropeway, and instant cab/auto bookings with verified drivers."
                  : "From the bustling alleys of Johari Bazaar to the heights of Nahargarh Fort, Sheher Saathi provides real-time public transit routes, Pink Line Metro schedule matching, and instant cab/auto bookings with verified local drivers."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-[#3D2B23]/90 border border-[#543C32] shadow-lg">
                  <div className="text-3xl mb-2">{isUdaipur ? "🛥️" : "🚇"}</div>
                  <div className="font-bold text-[#FAF5EF]">{isUdaipur ? "Electric Bus & Boat Ferries" : "Smart Metro & Bus Routing"}</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">
                    {isUdaipur ? "UCTSL electric buses, Pichola & Fatehsagar ferry jetties & ropeway fares" : "Real-time station matching, JCTSL bus routes & fare logic"}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#3D2B23]/90 border border-[#543C32] shadow-lg">
                  <div className="text-3xl mb-2">🛺</div>
                  <div className="font-bold text-[#FAF5EF]">Verified Auto &amp; Cabs</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">Upfront distance fare transparency &amp; doorstep pickups</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#3D2B23]/90 border border-[#543C32] shadow-lg">
                  <div className="text-3xl mb-2">{isUdaipur ? "🌅" : "🏰"}</div>
                  <div className="font-bold text-[#FAF5EF]">{cityDetails.placesCount} Places Catalog</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">Ticket prices, visiting hours, FAQs &amp; visitor guidelines</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#3D2B23]/90 border border-[#543C32] shadow-lg">
                  <div className="text-3xl mb-2">☕</div>
                  <div className="font-bold text-[#FAF5EF]">Famous {isUdaipur ? "Mewari" : "Local"} Taste Guide</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">Curated cafes, legendary street stalls &amp; authentic dishes</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/transport" className="bg-gradient-to-r from-[#B35D38] to-[#D98A5B] text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-xl text-sm">
                  Smart Transit Engine →
                </Link>
                <Link to={`/places?city=${currentCity}`} className="bg-[#3D2B23] border border-[#543C32] text-[#FAF5EF] px-8 py-4 rounded-2xl font-bold hover:bg-[#4A362B] transition text-sm">
                  Browse {cityDetails.name} Places
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#543C32] bg-[#3D2B23] transform hover:scale-[1.02] transition duration-500">
                <img 
                  src={isUdaipur ? "/udaipur.jpg" : "https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/hawamahal_owadja.jpg"} 
                  alt={`${cityDetails.name} Landmark`} 
                  className="w-full h-[500px] object-cover" 
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-[#FAF5EF] text-[#2C1E18] p-5 rounded-2xl shadow-2xl border border-[#E6D6C3] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#B35D38] text-white flex items-center justify-center font-black text-lg shadow-md">
                  {cityDetails.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#2C1E18]">{cityDetails.name} Network</div>
                  <div className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    100% Operational
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WAITLIST SECTION */}
      <section id="waitlist-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl border border-[#E6D6C3] p-8 sm:p-12 shadow-2xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B35D38] bg-[#FAF1EC] px-4 py-1.5 rounded-full border border-[#EBC5B2]">
            Expansion Notification 🚀
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-marcellus text-[#2C1E18]">
            Want Sheher Saathi in <span className="text-[#B35D38]">{waitlistCity}</span>?
          </h2>

          <p className="text-sm text-[#543C32] font-medium max-w-lg mx-auto leading-relaxed">
            Join the waitlist to receive instant access when we launch real-time transport and local guide features in {waitlistCity}.
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-200 animate-in fade-in text-sm">
              🎉 Thank you! You've been added to the VIP waitlist for {waitlistCity}.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                required 
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-white border border-[#D7C1A9] text-[#2C1E18] px-5 py-4 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-[#B35D38] shadow-sm text-sm"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-[#B35D38] to-[#D98A5B] text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-xl whitespace-nowrap text-sm"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER & SEO KEYWORD INDEX MATRIX */}
      <footer className="py-14 border-t border-[#3D2B23] bg-[#1C110C] text-[#FAF5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* SEO Search Index Matrix */}
          <div className="pt-6 border-t border-[#3D2B23]/60 text-[11px] text-[#A37B66] leading-relaxed space-y-4">
            <div className="font-extrabold uppercase tracking-widest text-[#D98A5B]">
              Popular Searches &amp; Keywords Index:
            </div>
            <p>
              <strong className="text-[#E6D6C3]">Sheher Saathi (Shehar App / Sheher App / Shehar Saathi / SheherSathi / SheharSathi / Ghumo Jaipur / Ghumo Udaipur)</strong> is India's leading smart city travel companion and urban transport routing platform. 
              Search and compare <strong>Jaipur travel app</strong> features, <strong>Udaipur travel app</strong> guides, <strong>Hawa Mahal &amp; City Palace Udaipur ticket price &amp; timings</strong>, <strong>Amer Fort &amp; Sajjangarh bus metro routes</strong>, <strong>JCTSL &amp; UCTSL city bus schedules</strong>, <strong>Pink Line Metro station directory</strong>, <strong>Lake Pichola &amp; Fatehsagar boat ferries</strong>, <strong>auto cab fare calculator</strong>, <strong>verified local food spots</strong>, and <strong>royal haveli hotel bookings</strong>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#3D2B23]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] p-1.5 shadow-xl border border-[#E6D6C3] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-marcellus text-2xl tracking-wide leading-none text-[#FAF5EF]">shehersaathi</div>
                <div className="text-[9px] text-[#D98A5B] font-extrabold uppercase tracking-[0.25em] mt-1">Har Sheher, Apna Sa.</div>
              </div>
            </div>

            <p className="text-xs font-bold text-[#A37B66] uppercase tracking-widest text-center md:text-right">
              © 2026 Sheher Saathi (shehersaathi.com) • Built with ❤️ for Urban Explorers
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
