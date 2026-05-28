import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword, validateName, validateMobile } from "../utils/validators";
import OTPInput from "../components/OTPInput";
import { FaUser, FaTaxi, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaIdCard, FaCar } from "react-icons/fa";

export default function Signup() {
  const { signup, sendOTP, verifyOTP } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [vehicle, setVehicle] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("cab");
  const [stage, setStage] = useState("form"); // form | otp
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const runValidation = () => {
    const e = {};
    if (!validateName(fullName)) e.fullName = "Enter a valid name (letters and spaces)";
    if (!validateEmail(email)) e.email = "Enter a valid email";
    if (!validateMobile(mobile)) e.mobile = "Enter a valid mobile number";
    if (!validatePassword(password)) e.password = "Min 8 chars, 1 Upper, 1 Lower, 1 Digit, 1 Special";
    if (password !== confirm) e.confirm = "Passwords do not match";
    
    if (role === "driver") {
      if (!vehicle.trim()) e.vehicle = "Vehicle name is required";
      if (!vehicleNumber.trim()) e.vehicleNumber = "Vehicle number is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOTP = async () => {
    setServerError(null);
    if (!runValidation()) return;
    setSending(true);
    try {
      const res = await sendOTP(email, "signup");
      setSending(false);
      if (res.success) {
        setErrors({});
        setStage("otp");
        setCooldown(30);
      } else {
        setServerError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setSending(false);
      setServerError("An error occurred. Please try again.");
    }
  };

  const handleVerifyAndSignup = async () => {
    setServerError(null);
    if (otp.length < 6) return setServerError("Enter the 6-digit OTP");
    setSending(true);
    try {
      const v = await verifyOTP(email, otp);
      if (!v.success) {
        setSending(false);
        return setServerError("Invalid OTP");
      }
      const payload = { fullName, email, mobile, password, otp, role, vehicle, vehicleNumber, type: vehicleType };
      const res = await signup(payload);
      setSending(false);
      if (res.success) {
        if (res.user.role === 'driver') navigate('/driver/dashboard');
        else navigate('/');
      } else {
        setServerError(res.message || 'Signup failed.');
      }
    } catch (err) {
      setSending(false);
      setServerError("An error occurred during signup.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendOTP();
  };

  const InputField = ({ label, icon: Icon, value, onChange, type = "text", error, placeholder }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-gray-50 border-2 ${error ? 'border-red-500' : 'border-gray-100 group-focus-within:border-indigo-600'} rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium transition-all outline-none`}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-2 animate-pulse">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/70 rounded-[3rem] shadow-2xl shadow-indigo-100/50 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Info */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-black leading-tight mb-4">Start your journey today.</h3>
            <p className="text-indigo-100 font-medium">Join thousands of travelers exploring the Pink City.</p>
          </div>
          
          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-xl">🚕</div>
              <p className="text-xs font-bold leading-relaxed">Book verified cabs and autos instantly.</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-xl">🗺️</div>
              <p className="text-xs font-bold leading-relaxed">Save your favorite spots for later.</p>
            </div>
          </div>

          {/* Decor */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 font-medium mt-1">Fill in your details to get started.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3">
              <span className="text-lg">⚠️</span> {serverError}
            </div>
          )}

          {stage === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === 'user' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-500 grayscale'}`}
                  >
                    <FaUser size={16} />
                    <span className="font-bold">Passenger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === 'driver' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-500 grayscale'}`}
                  >
                    <FaTaxi size={16} />
                    <span className="font-bold">Driver</span>
                  </button>
                </div>
              </div>

              {role === 'driver' && (
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 space-y-4 animate-in slide-in-from-top-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">
                    <FaCar /> Vehicle Information
                  </p>
                  <div className="space-y-4">
                    <InputField label="Vehicle Name" icon={FaCar} value={vehicle} onChange={(e) => setVehicle(e.target.value)} error={errors.vehicle} placeholder="e.g. Swift Dzire" />
                    <InputField label="Vehicle Number" icon={FaIdCard} value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} error={errors.vehicleNumber} placeholder="RJ-14-XX-XXXX" />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                      <select 
                        value={vehicleType} 
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-4 text-gray-900 font-bold outline-none appearance-none cursor-pointer"
                      >
                        <option value="cab">🚕 Cab / Taxi</option>
                        <option value="auto">🛺 Auto Rickshaw</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <InputField label="Full Name" icon={FaUser} value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} placeholder="John Doe" />
                <InputField label="Email Address" icon={FaEnvelope} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} type="email" placeholder="john@example.com" />
                <InputField label="Mobile Number" icon={FaPhone} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} error={errors.mobile} placeholder="9876543210" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Password" icon={FaLock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} type="password" placeholder="••••••••" />
                  <InputField label="Confirm" icon={FaLock} value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3"
                >
                  {sending ? "Processing..." : "Continue to Verification"}
                  {!sending && <FaArrowRight size={14} />}
                </button>
                <p className="text-center mt-6 text-sm font-bold text-gray-400">
                  Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6">📩</div>
                <h3 className="text-2xl font-black text-gray-900">Verify Email</h3>
                <p className="text-gray-500 font-medium mt-2">
                  Enter the 6-digit code sent to <br />
                  <span className="text-gray-900 font-bold">{email}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <OTPInput length={6} onChange={setOtp} />
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleVerifyAndSignup}
                  disabled={sending || otp.length < 6}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {sending ? "Verifying..." : "Verify & Create Account"}
                </button>
                
                <button
                  onClick={handleSendOTP}
                  disabled={sending || cooldown > 0}
                  className="w-full bg-gray-50 text-gray-500 py-5 rounded-2xl font-bold transition hover:bg-gray-100 disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive code? Resend"}
                </button>

                <button
                  onClick={() => setStage('form')}
                  className="w-full text-center text-sm font-bold text-indigo-600 hover:underline"
                >
                  Go back and edit details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
