import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please provide email and password");
    const res = await login({ email, password });
    if (res.success) {
      if (res.user?.role === 'driver') navigate('/driver/dashboard');
      else navigate('/dashboard');
    } else {
      setError(res.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/70 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-center text-white relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back!</h2>
              <p className="text-indigo-100 text-sm font-medium">Sign in to continue your journey.</p>
           </div>
           {/* Abstract patterns */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <FaEnvelope size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border-2 border-gray-100 group-focus-within:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                <button 
                  type="button" 
                  onClick={() => navigate('/forgot-password')}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <FaLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-gray-100 group-focus-within:border-indigo-600 rounded-2xl py-4 pl-12 pr-12 text-gray-900 font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3"
              >
                {loading ? "Signing in..." : "Login"}
                {!loading && <FaArrowRight size={14} />}
              </button>
              
              <div className="mt-8 text-center">
                <p className="text-sm font-bold text-gray-400">
                  Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up now</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
