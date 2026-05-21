import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Sticky responsive navbar with auth-aware links
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Close mobile menu on navigation
    return () => setOpen(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeClass = ({ isActive }) =>
    isActive ? "text-white bg-blue-600 px-3 py-2 rounded" : "text-white/90 hover:text-white";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard') }>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">GJ</div>
              <div className="text-white font-semibold text-lg">Ghumo Jaipur</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={activeClass}>Home</NavLink>
            <NavLink to="/places" className={activeClass}>Explore Places</NavLink>
            <NavLink to="/transport" className={activeClass}>Smart Transport</NavLink>
            <NavLink to="/saved-trips" className={activeClass}>Saved Trips</NavLink>
            {user?.role === "admin" && <NavLink to="/admin/places" className={activeClass}>Admin</NavLink>}
            <NavLink to="/" className={activeClass}>About</NavLink>
            <NavLink to="/" className={activeClass}>Contact</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium bg-white/20 text-white px-4 py-2 rounded hover:scale-105 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-medium bg-white text-indigo-600 px-4 py-2 rounded hover:scale-105 transition"
                >
                  Signup
                </button>
              </>
            ) : (
              <div className="relative">
                <button className="flex items-center gap-2 text-white" onClick={() => setOpen((v) => !v)}>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">{user.name?.[0] || 'U'}</div>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow p-2 text-sm">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/saved-trips')}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Saved Trips
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                      Logout
                    </button>
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
        <div className="md:hidden bg-gradient-to-b from-indigo-600 to-pink-500">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink to="/" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Home</NavLink>
            <NavLink to="/places" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Explore Places</NavLink>
            <NavLink to="/transport" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Smart Transport</NavLink>
            <NavLink to="/saved-trips" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Saved Trips</NavLink>
            {user?.role === "admin" && <NavLink to="/admin/places" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Admin</NavLink>}
            <NavLink to="/" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">About</NavLink>
            <NavLink to="/" onClick={() => setOpen(false)} className="block text-white px-2 py-2 rounded">Contact</NavLink>

            <div className="pt-2 border-t border-white/20">
              {!user ? (
                <>
                  <button onClick={() => { setOpen(false); navigate('/login'); }} className="w-full text-left text-white px-2 py-2 rounded">Login</button>
                  <button onClick={() => { setOpen(false); navigate('/signup'); }} className="w-full text-left bg-white text-indigo-600 px-2 py-2 rounded">Signup</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setOpen(false); navigate('/profile'); }} className="w-full text-left text-white px-2 py-2 rounded">Profile</button>
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left text-white px-2 py-2 rounded">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
