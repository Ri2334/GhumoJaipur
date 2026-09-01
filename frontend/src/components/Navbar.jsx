import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/api";

// Sticky responsive navbar with warm terracotta branding
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);
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
      ? "text-[#FAF5EF] bg-[#B35D38] px-3.5 py-2 rounded-xl font-bold shadow-md transition-all" 
      : "text-[#E6D6C3] hover:text-white hover:bg-white/10 px-3.5 py-2 transition font-medium";

  return (
    <header className="sticky top-0 z-[100] bg-[#2C1E18] border-b border-[#3D2B23] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => navigate(user ? '/dashboard' : '/') }>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] p-1 shadow-md group-hover:scale-105 transition-transform duration-300 border border-[#E6D6C3] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[#FAF5EF] font-marcellus text-2xl tracking-wide font-normal leading-none">shehersaathi</div>
                <div className="text-[9px] text-[#D98A5B] font-bold uppercase tracking-[0.2em] mt-1">Har Sheher, Apna Sa.</div>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {user?.role === 'user' && (
              <>
                <NavLink to="/" className={activeClass}>Home</NavLink>
                <a href="/#cities" className="text-[#E6D6C3] hover:text-white px-3.5 py-2 transition font-medium">Cities</a>
                <NavLink to="/places" className={activeClass}>Explore Places</NavLink>
                <NavLink to="/transport" className={activeClass}>Smart Transport</NavLink>
                <NavLink to="/bus-routes" className={activeClass}>Bus Directory</NavLink>
              </>
            )}

            {!user && (
              <>
                <NavLink to="/" className={activeClass}>Home</NavLink>
                <a href="/#cities" className="text-[#E6D6C3] hover:text-white px-3.5 py-2 transition font-medium">Cities</a>
                <NavLink to="/places" className={activeClass}>Explore Places</NavLink>
                <NavLink to="/transport" className={activeClass}>Smart Transport</NavLink>
                <NavLink to="/bus-routes" className={activeClass}>Bus Directory</NavLink>
              </>
            )}

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

            {user?.role === "driver" && (
              <>
                <NavLink to="/driver/dashboard" className={activeClass}>Dashboard</NavLink>
                <NavLink to="/my-rides" className={activeClass}>History</NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink to="/dashboard" className={activeClass}>Dashboard</NavLink>
                <NavLink to="/admin/places" className={activeClass}>Places</NavLink>
                <NavLink to="/admin/drivers" className={activeClass}>Drivers</NavLink>
                <NavLink to="/admin/users" className={activeClass}>Users</NavLink>
              </>
            )}

            {user && (
              <>
                <NavLink to="/profile" className={activeClass}>Profile</NavLink>
                {user.role === 'user' && <NavLink to="/my-rides" className={activeClass}>My Rides</NavLink>}
              </>
            )}
          </nav>

          {/* Desktop Right Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-[#FAF5EF] px-5 py-2.5 rounded-xl hover:bg-white/10 transition border border-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-bold bg-[#B35D38] text-white px-6 py-2.5 rounded-xl hover:bg-[#964B2A] transition shadow-lg hover:shadow-terracotta-500/20 transform hover:-translate-y-0.5"
                >
                  Join Now
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  className="flex items-center gap-3 bg-[#3D2B23] hover:bg-[#4A362B] p-1.5 pr-4 rounded-2xl transition border border-[#543C32]" 
                  onClick={() => setOpen((v) => !v)}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#B35D38] flex items-center justify-center text-white font-black shadow-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-[#FAF5EF] font-bold text-sm truncate max-w-[110px]">{user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[#D98A5B] transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#FAF5EF] rounded-3xl shadow-2xl p-2 border border-[#E6D6C3] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-[#F3E8DB] mb-1">
                       <p className="text-[10px] font-bold text-[#A37B66] uppercase tracking-widest">Signed in as</p>
                       <p className="font-bold text-[#2C1E18] truncate">{user.email}</p>
                       <p className="text-[10px] font-bold text-[#B35D38] mt-1 uppercase tracking-tighter">Rating: {user.rating?.toFixed(1) || '5.0'}</p>
                    </div>
                    <div className="pt-1">
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-2xl transition font-bold text-red-600"
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
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-[#FAF5EF] focus:outline-none p-2 rounded-xl bg-[#3D2B23] border border-[#543C32]"
              aria-label="Toggle menu"
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="lg:hidden bg-[#2C1E18] border-b border-[#3D2B23] px-4 pt-2 pb-6 space-y-2">
          {user?.role === 'user' && (
            <>
              <NavLink to="/" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Home</NavLink>
              <NavLink to="/places" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Explore Places</NavLink>
              <NavLink to="/transport" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Smart Transport</NavLink>
              <NavLink to="/bus-routes" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Bus Directory</NavLink>
              <NavLink to="/saved-trips" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Saved Trips</NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Home</NavLink>
              <NavLink to="/places" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Explore Places</NavLink>
              <NavLink to="/transport" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Smart Transport</NavLink>
              <NavLink to="/bus-routes" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-medium">Bus Directory</NavLink>
            </>
          )}

          {user?.role === 'driver' && (
            <>
              <NavLink to="/driver/dashboard" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Driver Dashboard</NavLink>
              <NavLink to="/my-rides" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Ride History</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Admin Dashboard</NavLink>
              <NavLink to="/admin/places" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Manage Places</NavLink>
              <NavLink to="/admin/drivers" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Manage Drivers</NavLink>
              <NavLink to="/admin/users" onClick={() => setOpen(false)} className="block text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Manage Users</NavLink>
            </>
          )}

          <div className="pt-3 border-t border-[#3D2B23] space-y-2">
            {!user ? (
              <>
                <button onClick={() => { setOpen(false); navigate('/login'); }} className="w-full text-left text-[#FAF5EF] px-3 py-2 rounded-xl font-bold">Login</button>
                <button onClick={() => { setOpen(false); navigate('/signup'); }} className="w-full bg-[#B35D38] text-white px-3 py-2.5 rounded-xl font-bold text-center">Join Now</button>
              </>
            ) : (
              <>
                <button onClick={() => { setOpen(false); navigate('/profile'); }} className="w-full text-left text-[#FAF5EF] px-3 py-2 rounded-xl">Profile</button>
                {user.role === 'user' && <button onClick={() => { setOpen(false); navigate('/my-rides'); }} className="w-full text-left text-[#FAF5EF] px-3 py-2 rounded-xl">My Rides</button>}
                <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left text-red-400 px-3 py-2 rounded-xl font-bold">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
