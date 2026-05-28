import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/api";

// Sticky responsive navbar with auth-aware links
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Close mobile menu on navigation
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
        // Find if there is any booking that is not completed or cancelled
        const active = bookings.find(r => ['requested', 'accepted', 'waiting_approval', 'approved', 'started'].includes(r.status));
        setActiveRideId(active ? active._id : null);
      } catch (err) {
        console.error("Failed to check active ride", err);
      }
    };

    checkActiveRide();
    const interval = setInterval(checkActiveRide, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeClass = ({ isActive }) =>
    isActive ? "text-white bg-white/20 px-3 py-2 rounded-xl font-bold" : "text-white/90 hover:text-white px-3 py-2 transition font-medium";

  return (
    <header className="sticky top-0 z-[100] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(user ? '/dashboard' : '/') }>
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-lg group-hover:scale-110 transition">GJ</div>
              <div className="text-white font-black text-xl tracking-tight">Ghumo Jaipur</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {/* Passenger Links */}
            {user?.role === 'user' && (
              <>
                <NavLink to="/" className={activeClass}>Home</NavLink>
                <a href="/#about" className="text-white/90 hover:text-white px-3 py-2 transition font-medium">About</a>
                <NavLink to="/places" className={activeClass}>Explore Places</NavLink>
                <NavLink to="/transport" className={activeClass}>Smart Transport</NavLink>
              </>
            )}

            {/* Active Ride Indicator for Passengers */}
            {user?.role === 'user' && activeRideId && (
              <NavLink to={`/book/success/${activeRideId}`} className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg hover:scale-105 transition">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-900 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-900"></span>
                </span>
                Active Ride
              </NavLink>
            )}

            {/* Driver Links */}
            {user?.role === "driver" && (
              <>
                <NavLink to="/driver/dashboard" className={activeClass}>Dashboard</NavLink>
                <NavLink to="/my-rides" className={activeClass}>History</NavLink>
              </>
            )}

            {/* Admin Links */}
            {user?.role === "admin" && (
              <>
                <NavLink to="/dashboard" className={activeClass}>Dashboard</NavLink>
                <NavLink to="/admin/places" className={activeClass}>Manage Places</NavLink>
                <NavLink to="/admin/drivers" className={activeClass}>Manage Drivers</NavLink>
                <NavLink to="/admin/users" className={activeClass}>Manage Users</NavLink>
              </>
            )}

            {/* Shared Links for all Logged-in Users */}
            {user && (
              <>
                <NavLink to="/profile" className={activeClass}>Profile</NavLink>
                {user.role === 'user' && <NavLink to="/my-rides" className={activeClass}>My Rides</NavLink>}
              </>
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-bold bg-white text-indigo-600 px-6 py-2.5 rounded-xl hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Join Now
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-1.5 pr-4 rounded-2xl transition border border-white/10" 
                  onClick={() => setOpen((v) => !v)}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white font-bold text-sm truncate max-w-[100px]">{user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white/70 transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl p-2 border border-gray-100 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                       <p className="font-bold text-gray-900 truncate">{user.email}</p>
                       <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase tracking-tighter">Rating: {user.rating?.toFixed(1) || '5.0'}</p>
                    </div>
                    <div className="pt-1">
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-2xl transition font-bold text-red-500 hover:text-red-600"
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
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white/30 p-2 rounded"
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
        <div className="lg:hidden bg-gradient-to-b from-indigo-600 to-pink-500">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user?.role === 'user' && (
              <>
                <NavLink to="/" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Home</NavLink>
                <NavLink to="/places" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Explore Places</NavLink>
                <NavLink to="/transport" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Smart Transport</NavLink>
                <NavLink to="/saved-trips" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Saved Trips</NavLink>
              </>
            )}
            {user?.role === 'driver' && (
              <>
                <NavLink to="/driver/dashboard" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Driver Dashboard</NavLink>
                <NavLink to="/my-rides" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Ride History</NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/dashboard" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Admin Dashboard</NavLink>
                <NavLink to="/admin/places" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Manage Places</NavLink>
                <NavLink to="/admin/drivers" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Manage Drivers</NavLink>
                <NavLink to="/admin/users" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded font-bold">Manage Users</NavLink>
              </>
            )}

            <div className="pt-2 border-t border-white/20">
              {!user ? (
                <>
                  <button onClick={() => { setOpen(false); navigate('/login'); }} className="w-full text-left text-white px-2 py-2 rounded">Login</button>
                  <button onClick={() => { setOpen(false); navigate('/signup'); }} className="w-full text-left bg-white text-indigo-600 px-2 py-2 rounded">Signup</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setOpen(false); navigate('/profile'); }} className="w-full text-left text-white px-2 py-2 rounded">Profile</button>
                  {user.role === 'user' && <button onClick={() => { setOpen(false); navigate('/my-rides'); }} className="w-full text-left text-white px-2 py-2 rounded">My Rides</button>}
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left text-white px-2 py-2 rounded font-bold text-red-100">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
