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
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#E6D6C3] rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-[#2C1E18] p-8 text-center text-[#FAF5EF] relative overflow-hidden border-b border-[#3D2B23]">
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF5EF] p-1 shadow-md border border-[#E6D6C3] mb-4 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl font-marcellus mb-1">Welcome Back</h2>
              <p className="text-[#D98A5B] text-xs font-bold uppercase tracking-[0.2em]">Har Sheher, Apna Sa.</p>
           </div>
           {/* Abstract patterns */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#B35D38]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#793A1F] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A37B66] group-focus-within:text-[#B35D38] transition-colors">
                  <FaEnvelope size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-[#FAF5EF] border-2 border-[#E6D6C3] group-focus-within:border-[#B35D38] rounded-2xl py-4 pl-12 pr-4 text-[#2C1E18] font-medium transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#793A1F]">Password</label>
                <button 
                  type="button" 
                  onClick={() => navigate('/forgot-password')}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#B35D38] hover:text-[#964B2A] transition"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A37B66] group-focus-within:text-[#B35D38] transition-colors">
                  <FaLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF5EF] border-2 border-[#E6D6C3] group-focus-within:border-[#B35D38] rounded-2xl py-4 pl-12 pr-12 text-[#2C1E18] font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A37B66] hover:text-[#B35D38] transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B35D38] hover:bg-[#964B2A] text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? "Signing in..." : "Login"}
                {!loading && <FaArrowRight size={14} />}
              </button>
              
              <div className="mt-8 text-center">
                <p className="text-sm font-semibold text-[#543C32]">
                  Don't have an account? <Link to="/signup" className="text-[#B35D38] font-bold hover:underline">Sign up now</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
