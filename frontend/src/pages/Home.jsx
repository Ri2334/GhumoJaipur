import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistCity, setWaitlistCity] = useState("Delhi");
  const [submitted, setSubmitted] = useState(false);

  const cities = [
    {
      id: "jaipur",
      name: "Jaipur",
      tagline: "The Pink City",
      status: "active",
      badge: "LIVE NOW 🟢",
      desc: "Full smart transport, metro integration, verified drivers & heritage guides active.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      placesCount: "25+ Places",
      transportTypes: "Bus • Metro • Auto • Cab"
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
      id: "udaipur",
      name: "Udaipur",
      tagline: "City of Lakes",
      status: "coming_soon",
      badge: "COMING SOON ⏳",
      desc: "Lakeside rides & palace trails. Launching late 2026.",
      image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=800&q=80",
      placesCount: "18+ Planned",
      transportTypes: "Boat • Auto • Cab"
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
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
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
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-36 bg-[#2C1E18] text-[#FAF5EF] overflow-hidden">
        {/* Subtle warm glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B35D38]/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D98A5B]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Logo Badge */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-[#FAF5EF] p-3 shadow-2xl border-2 border-[#E6D6C3] mb-8 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <img src="/logo.png" alt="Sheher Saathi Emblem" className="w-full h-full object-contain" />
            </div>

            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-[#3D2B23] border border-[#543C32] px-5 py-2 rounded-full mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#B35D38] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D98A5B]">Har Sheher, Apna Sa.</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-marcellus text-[#FAF5EF] tracking-tight leading-[1.08] max-w-5xl">
              Your Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D98A5B] via-[#E6A373] to-[#B35D38]">
                Urban Companion
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-[#E6D6C3] leading-relaxed font-normal opacity-90">
              Navigating India’s most vibrant cities with real-time public transit logic, 
              verified local drivers, & curated heritage journeys.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a 
                href="#cities" 
                className="w-full sm:w-auto bg-[#B35D38] text-white px-10 py-4.5 rounded-2xl font-bold text-lg hover:bg-[#964B2A] transition shadow-2xl hover:shadow-[#B35D38]/30 flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
              >
                <span>Select Your City</span>
                <span className="text-xl">📍</span>
              </a>

              <Link 
                to="/places" 
                className="w-full sm:w-auto bg-[#3D2B23] border border-[#543C32] text-[#FAF5EF] px-8 py-4.5 rounded-2xl font-bold text-lg hover:bg-[#4A362B] transition flex items-center justify-center gap-2"
              >
                <span>Explore Jaipur Live</span>
                <span className="text-[#D98A5B]">✨</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#3D2B23] w-full max-w-4xl text-center">
              <div>
                <div className="text-3xl font-marcellus text-[#FAF5EF]">100%</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">Verified Drivers</div>
              </div>
              <div>
                <div className="text-3xl font-marcellus text-[#D98A5B]">Live</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">Smart Metro & Bus</div>
              </div>
              <div>
                <div className="text-3xl font-marcellus text-[#FAF5EF]">25+</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">Iconic Jaipur Spots</div>
              </div>
              <div>
                <div className="text-3xl font-marcellus text-[#D98A5B]">6 Cities</div>
                <div className="text-xs uppercase tracking-widest text-[#A37B66] font-bold mt-1">In Expansion</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Multi-City Selection Grid */}
      <section id="cities" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#B35D38] mb-3">Multi-City Network</div>
          <h2 className="text-4xl sm:text-5xl font-marcellus text-[#2C1E18] tracking-tight">Choose Your City</h2>
          <p className="mt-4 text-lg text-[#543C32] font-medium">
            Sheher Saathi is expanding across India. Explore our flagship operational city or request your city next!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((c) => (
            <div 
              key={c.id} 
              className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                c.status === 'active' 
                  ? 'bg-white border-[#B35D38] shadow-2xl ring-2 ring-[#B35D38]/20 scale-[1.02]' 
                  : 'bg-[#FAF5EF] border-[#E6D6C3] opacity-90 hover:opacity-100 hover:shadow-xl'
              }`}
            >
              <div>
                {/* City Image Header */}
                <div className="relative h-52 overflow-hidden bg-[#2C1E18]">
                  <img 
                    src={c.image} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E18]/90 via-[#2C1E18]/30 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      c.status === 'active' 
                        ? 'bg-[#B35D38] text-white shadow-lg' 
                        : 'bg-[#2C1E18]/80 text-[#E6D6C3] backdrop-blur-md border border-white/10'
                    }`}>
                      {c.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-3xl font-marcellus text-white leading-tight">{c.name}</h3>
                    <p className="text-xs font-medium text-[#D98A5B] tracking-wide">{c.tagline}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-sm text-[#543C32] leading-relaxed font-medium mb-6">
                    {c.desc}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-[#F3E8DB]">
                    <div className="flex items-center justify-between text-xs text-[#793A1F] font-semibold">
                      <span>Places Covered</span>
                      <span className="font-bold text-[#2C1E18]">{c.placesCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#793A1F] font-semibold">
                      <span>Transit Options</span>
                      <span className="font-bold text-[#2C1E18]">{c.transportTypes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                {c.status === 'active' ? (
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate('/places')}
                      className="w-full bg-[#B35D38] text-white py-3.5 rounded-xl font-bold hover:bg-[#964B2A] transition shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Explore Jaipur Now</span>
                      <span>→</span>
                    </button>
                    {!user && (
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-[#F3E8DB] text-[#2C1E18] py-2.5 rounded-xl text-xs font-bold hover:bg-[#E6D6C3] transition"
                      >
                        Login to Book Rides
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setWaitlistCity(c.name);
                      document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#FAF5EF] text-[#B35D38] border border-[#B35D38]/30 py-3 rounded-xl font-bold hover:bg-[#B35D38] hover:text-white transition text-sm"
                  >
                    Request {c.name} Launch 🚀
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Flagship Jaipur Spotlight */}
      <section className="py-20 bg-[#2C1E18] text-[#FAF5EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D2B23] border border-[#543C32] text-xs font-bold uppercase tracking-widest text-[#D98A5B] mb-6">
                <span>Flagship Live City</span>
                <span>🏰</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-marcellus text-[#FAF5EF] leading-tight mb-6">
                Experience Jaipur with <br />
                <span className="text-[#D98A5B]">Smart Urban Intelligence</span>
              </h2>
              <p className="text-base sm:text-lg text-[#E6D6C3] leading-relaxed mb-8">
                From the bustling alleys of Johari Bazaar to the heights of Nahargarh Fort, 
                Sheher Saathi provides real-time public transit routes, Metro schedule matching, 
                and instant cab/auto bookings with verified local drivers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#3D2B23] border border-[#543C32]">
                  <div className="text-2xl mb-2">🚇</div>
                  <div className="font-bold text-[#FAF5EF]">Smart Metro Routing</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">Real-time station matching & fare logic</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#3D2B23] border border-[#543C32]">
                  <div className="text-2xl mb-2">🛺</div>
                  <div className="font-bold text-[#FAF5EF]">Verified Auto & Cabs</div>
                  <div className="text-xs text-[#E6D6C3] mt-1">Secure OTP validation & upfront fare</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/transport" className="bg-[#B35D38] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#964B2A] transition shadow-lg">
                  Smart Transport Routes
                </Link>
                <Link to="/places" className="bg-[#3D2B23] border border-[#543C32] text-[#FAF5EF] px-8 py-3.5 rounded-xl font-bold hover:bg-[#4A362B] transition">
                  Browse All Places
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#543C32] bg-[#3D2B23]">
                <img 
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80" 
                  alt="Jaipur Heritage Hawa Mahal" 
                  className="w-full h-[450px] object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#FAF5EF] text-[#2C1E18] p-6 rounded-3xl shadow-2xl border border-[#E6D6C3] max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B35D38] flex items-center justify-center text-white font-bold text-lg">SS</div>
                  <div>
                    <div className="font-bold text-sm">Jaipur Transport</div>
                    <div className="text-xs text-[#793A1F]">100% Operational</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Waitlist / Request City Section */}
      <section id="waitlist-form" className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#FAF5EF] to-[#F3E8DB] rounded-[3rem] p-8 sm:p-14 border border-[#E6D6C3] shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#B35D38] text-white flex items-center justify-center text-2xl mx-auto mb-6 shadow-md">
            📍
          </div>
          <h2 className="text-3xl sm:text-4xl font-marcellus text-[#2C1E18] mb-4">
            Want Sheher Saathi in Your City?
          </h2>
          <p className="text-[#543C32] text-base sm:text-lg font-medium mb-8 max-w-xl mx-auto">
            We are bringing <span className="font-bold text-[#B35D38]">Har Sheher, Apna Sa.</span> to urban explorers nationwide. Vote for your city and get early VIP access!
          </p>

          {submitted ? (
            <div className="bg-[#FAF5EF] border border-[#B35D38] p-6 rounded-2xl text-[#B35D38] font-bold text-lg animate-in fade-in">
              🎉 Thank you! You're added to the {waitlistCity} early access list!
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
              <select 
                value={waitlistCity} 
                onChange={(e) => setWaitlistCity(e.target.value)}
                className="w-full sm:w-auto bg-white border border-[#D7C1A9] text-[#2C1E18] px-4 py-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#B35D38]"
              >
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Agra">Agra</option>
              </select>
              <input 
                type="email" 
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-white border border-[#D7C1A9] text-[#2C1E18] px-5 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#B35D38]"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#B35D38] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#964B2A] transition shadow-md whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-[#E6D6C3] bg-[#2C1E18] text-[#FAF5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] p-1 shadow-md border border-[#E6D6C3] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-marcellus text-2xl tracking-wide leading-none text-[#FAF5EF]">shehersaathi</div>
                <div className="text-[9px] text-[#D98A5B] font-bold uppercase tracking-[0.2em] mt-1">Har Sheher, Apna Sa.</div>
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
