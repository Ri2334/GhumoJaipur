import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/api";
import CitySwitcher from "./CitySwitcher";

// Sticky responsive navbar with warm terracotta branding & connected dropdowns
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);

  // Dropdown states
  const [planDropdown, setPlanDropdown] = useState(false);
  const [metroDropdown, setMetroDropdown] = useState(false);
  const [exploreDropdown, setExploreDropdown] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    return () => setOpen(false);
  }, []);

  // Poll for active ride for the user
  useEffect(() => {
    if (!user || user.role === 'driver') {
      setActiveRideId(null);
      return;
    }

    const checkActiveRide = async () => {
      try {
        const res = await apiClient.get('/bookings/my');
        const bookings = res.data.data || res.data || [];
        const active = bookings.find(r => ['requested', 'accepted', 'waiting_approval', 'approved', 'started'].includes(r.status));
        setActiveRideId(active ? active._id : null);
      } catch (err) {
        console.error("Failed to check active ride", err);
      }
    };

    checkActiveRide();
    const interval = setInterval(checkActiveRide, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeClass = ({ isActive }) =>
    isActive 
      ? "text-[#FAF5EF] bg-[#B35D38] px-3.5 py-2 rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5" 
      : "text-[#E6D6C3] hover:text-white hover:bg-white/10 px-3.5 py-2 transition font-medium flex items-center gap-1.5";

  return (
    <header className="sticky top-0 z-[100] bg-[#2C1E18] border-b border-[#3D2B23] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding + City Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => navigate(user ? '/dashboard' : '/') }>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] p-1 shadow-md group-hover:scale-105 transition-transform duration-300 border border-[#E6D6C3] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[#FAF5EF] font-marcellus text-2xl tracking-wide font-normal leading-none">shehersaathi</div>
                <div className="text-[9px] text-[#D98A5B] font-bold uppercase tracking-[0.2em] mt-1">Har Sheher, Apna Sa.</div>
              </div>
            </div>

            <CitySwitcher className="hidden sm:inline-flex ml-2" />
          </div>

          {/* Desktop Nav Links with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={activeClass}>Home</NavLink>

            {/* Plan Trip Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setPlanDropdown(true)}
              onMouseLeave={() => setPlanDropdown(false)}
            >
              <button className="text-[#E6D6C3] hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition text-xs font-semibold flex items-center gap-1">
                <span>Plan Trip</span>
                <span className="text-[10px]">▼</span>
              </button>

              {planDropdown && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="rounded-2xl bg-white p-2 text-[#2C1E18] shadow-2xl border border-[#E6D6C3] animate-in fade-in slide-in-from-top-2 space-y-1">
                    <NavLink
                      to="/transport"
                      onClick={() => setPlanDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">🚀 Smart Route Planner</span>
                      <span className="text-[10px] text-gray-500">Real-time fare &amp; transit calculation</span>
                    </NavLink>
                    <NavLink
                      to="/metro-directory"
                      onClick={() => setPlanDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">🚇 Metro Directory</span>
                      <span className="text-[10px] text-gray-500">11 Pink Line stations &amp; FAQs</span>
                    </NavLink>
                    <NavLink
                      to="/day-trips"
                      onClick={() => setPlanDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">⛰️ Day Trips</span>
                      <span className="text-[10px] text-gray-500">Excursions &amp; Outstation Guides</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Metro Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setMetroDropdown(true)}
              onMouseLeave={() => setMetroDropdown(false)}
            >
              <button className="text-[#E6D6C3] hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl transition font-medium flex items-center gap-1">
                <span>Metro</span>
                <span className="text-[10px]">▼</span>
              </button>

              {metroDropdown && (
                <div className="absolute left-0 top-full pt-1 w-52 z-50">
                  <div className="rounded-2xl bg-white p-2 text-[#2C1E18] shadow-2xl border border-[#E6D6C3] animate-in fade-in slide-in-from-top-2 space-y-1">
                    <NavLink
                      to="/metro-directory"
                      onClick={() => setMetroDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-pink-50 transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">🚉 Stations</span>
                      <span className="text-[10px] text-gray-500">11 Pink Line stations &amp; timings</span>
                    </NavLink>
                    <NavLink
                      to="/metro-lines"
                      onClick={() => setMetroDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-pink-50 transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">🚇 Metro Lines</span>
                      <span className="text-[10px] text-gray-500">Pink &amp; upcoming Orange Line</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* City Bus Direct Link */}
            <NavLink to="/bus-routes" className={activeClass}>City Bus</NavLink>

            {/* Hotels Direct Link */}
            <NavLink to="/hotels" className={activeClass}>Hotels 🏨</NavLink>

            {/* Explore Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setExploreDropdown(true)}
              onMouseLeave={() => setExploreDropdown(false)}
            >
              <button className="text-[#E6D6C3] hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition text-xs font-semibold flex items-center gap-1">
                <span>Explore</span>
                <span className="text-[10px]">▼</span>
              </button>

              {exploreDropdown && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="rounded-2xl bg-white p-2 text-[#2C1E18] shadow-2xl border border-[#E6D6C3] animate-in fade-in slide-in-from-top-2 space-y-1">
                    <NavLink
                      to="/rentals"
                      onClick={() => setExploreDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition bg-[#FAF1EC] border border-[#EBC5B2]"
                    >
                      <span className="font-bold text-xs text-[#B35D38]">🛵 Activa, Bike &amp; Car Rentals</span>
                      <span className="text-[10px] text-gray-500">Rent Activa 6G, Royal Enfield &amp; cars</span>
                    </NavLink>
                    <NavLink
                      to="/places"
                      onClick={() => setExploreDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">📍 All Tourist Places</span>
                      <span className="text-[10px] text-gray-500">Verified destinations with FAQs &amp; guides</span>
                    </NavLink>
                    <NavLink
                      to="/day-trips"
                      onClick={() => setExploreDropdown(false)}
                      className="flex flex-col p-2.5 rounded-xl hover:bg-[#FAF5EF] transition"
                    >
                      <span className="font-bold text-xs text-[#2C1E18]">⛰️ Day Trips</span>
                      <span className="text-[10px] text-gray-500">Excursions &amp; Outstation Guides</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Active Ride Indicator */}
            {user?.role === 'user' && activeRideId && (
              <NavLink to={`/book/success/${activeRideId}`} className="flex items-center gap-2 bg-[#D98A5B] text-[#2C1E18] px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg hover:scale-105 transition">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C1E18] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2C1E18]"></span>
                </span>
                Active Ride
              </NavLink>
            )}
          </nav>

          {/* Right Action: Plan Journey Button + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/transport')}
              className="text-xs font-black uppercase tracking-wider bg-[#B35D38] text-white px-5 py-2.5 rounded-xl hover:bg-[#964B2A] transition shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>🚀</span>
              <span>Plan Journey</span>
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs font-bold text-[#FAF5EF] px-4 py-2 rounded-xl hover:bg-white/10 transition border border-white/10"
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  className="flex items-center gap-3 bg-[#3D2B23] hover:bg-[#4A362B] p-1.5 pr-4 rounded-2xl transition border border-[#543C32]" 
                  onClick={() => setOpen((v) => !v)}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#B35D38] flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-[#FAF5EF] font-bold text-xs truncate max-w-[90px]">{user.name}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#FAF5EF] rounded-3xl shadow-2xl p-2 border border-[#E6D6C3] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-[#F3E8DB] mb-1">
                       <p className="text-[10px] font-bold text-[#A37B66] uppercase tracking-widest">Signed in as</p>
                       <p className="font-bold text-[#2C1E18] text-xs truncate">{user.email}</p>
                    </div>
                    <div className="pt-1 space-y-1">
                      <NavLink to="/hotels" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-white rounded-xl text-xs font-bold text-[#2C1E18]">🏨 Hotels & Stays</NavLink>
                      <NavLink to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-white rounded-xl text-xs font-bold text-[#2C1E18]">Profile</NavLink>
                      <NavLink to="/saved-trips" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-white rounded-xl text-xs font-bold text-[#2C1E18]">Saved Trips</NavLink>
                      {user?.role === 'admin' && (
                        <NavLink to="/admin/hotels" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-amber-50 rounded-xl text-xs font-bold text-[#B35D38]">👑 Admin Hotel Manager</NavLink>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 rounded-xl font-bold text-xs text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => navigate('/transport')}
              className="text-[11px] font-bold bg-[#B35D38] text-white px-3 py-1.5 rounded-lg"
            >
              Plan Journey
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-[#FAF5EF] p-2 rounded-xl bg-[#3D2B23] border border-[#543C32]"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {open && (
        <div className="lg:hidden bg-[#2C1E18] border-b border-[#3D2B23] px-4 pt-2 pb-6 space-y-2 text-xs">
          <NavLink to="/" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Home</NavLink>
          <NavLink to="/transport" onClick={() => setOpen(false)} className="block text-[#D98A5B] px-3 py-2 rounded-xl font-bold">🚀 Plan Your Route</NavLink>
          <NavLink to="/places" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Explore All Places (20+)</NavLink>
          <NavLink to="/bus-routes" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">City Bus Directory (27 Routes)</NavLink>
          <NavLink to="/hotels" onClick={() => setOpen(false)} className="block text-[#D98A5B] px-3 py-2 rounded-xl font-bold">🏨 Hotels & Heritage Stays</NavLink>
          <NavLink to="/rentals" onClick={() => setOpen(false)} className="block text-[#D98A5B] px-3 py-2 rounded-xl font-bold">🛵 Activa, Bike &amp; Car Rentals</NavLink>
          <NavLink to="/metro-directory" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Metro Directory (11 Stations)</NavLink>
          <NavLink to="/metro-lines" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Metro Lines Overview</NavLink>
          <NavLink to="/day-trips" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Day Trips (Pushkar, Ranthambore...)</NavLink>
          
          <div className="pt-3 border-t border-[#3D2B23] space-y-2">
            {!user ? (
              <div className="flex gap-2">
                <button onClick={() => { setOpen(false); navigate('/login'); }} className="flex-1 text-[#FAF5EF] py-2.5 rounded-xl border border-white/20 font-bold">Login</button>
                <button onClick={() => { setOpen(false); navigate('/signup'); }} className="flex-1 bg-[#B35D38] text-white py-2.5 rounded-xl font-bold">Join Now</button>
              </div>
            ) : (
              <button onClick={handleLogout} className="w-full text-left text-red-400 px-3 py-2 font-bold">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
