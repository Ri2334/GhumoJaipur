import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword, validateName, validateMobile } from "../utils/validators";
import OTPInput from "../components/OTPInput";
import { FaUser, FaTaxi, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaIdCard, FaCar } from "react-icons/fa";

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

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-[#E6D6C3] rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Compact Header Branding */}
        <div className="bg-[#2C1E18] p-8 text-center text-[#FAF5EF] relative overflow-hidden border-b border-[#3D2B23]">
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF5EF] p-1 shadow-md border border-[#E6D6C3] mb-4 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Sheher Saathi Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl font-marcellus mb-1">Create Account</h2>
              <p className="text-[#D98A5B] text-xs font-bold uppercase tracking-[0.2em]">Har Sheher, Apna Sa.</p>
           </div>
           {/* Abstract patterns */}
           <div className="absolute top-0 right-0 w-48 h-48 bg-[#B35D38]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>

        <div className="p-8 md:p-10">
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
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === 'user' ? 'border-[#B35D38] bg-[#FAF1EC] text-[#B35D38] shadow-md font-bold' : 'border-[#E6D6C3] bg-[#FAF5EF] text-[#793A1F]'}`}
                  >
                    <FaUser size={16} />
                    <span className="font-bold">Passenger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === 'driver' ? 'border-[#B35D38] bg-[#FAF1EC] text-[#B35D38] shadow-md font-bold' : 'border-[#E6D6C3] bg-[#FAF5EF] text-[#793A1F]'}`}
                  >
                    <FaTaxi size={16} />
                    <span className="font-bold">Driver</span>
                  </button>
                </div>
              </div>

              {role === 'driver' && (
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">
                    <FaCar /> Vehicle Information
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Name" icon={FaCar} value={vehicle} onChange={(e) => setVehicle(e.target.value)} error={errors.vehicle} placeholder="Swift Dzire" />
                    <InputField label="Number" icon={FaIdCard} value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} error={errors.vehicleNumber} placeholder="RJ-14-XX-0000" />
                  </div>
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
              )}

              <div className="space-y-5">
                <InputField label="Full Name" icon={FaUser} value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} placeholder="John Doe" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Email" icon={FaEnvelope} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} type="email" placeholder="john@example.com" />
                  <InputField label="Mobile" icon={FaPhone} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} error={errors.mobile} placeholder="9876543210" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Password" icon={FaLock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} type="password" placeholder="••••••••" />
                  <InputField label="Confirm" icon={FaLock} value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#B35D38] hover:bg-[#964B2A] text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {sending ? "Processing..." : "Continue to Verification"}
                  {!sending && <FaArrowRight size={14} />}
                </button>
                <p className="text-center mt-6 text-sm font-semibold text-[#543C32]">
                  Already have an account? <Link to="/login" className="text-[#B35D38] font-bold hover:underline">Login</Link>
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
                  className="w-full bg-[#B35D38] text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#964B2A] transition-all disabled:opacity-50"
                >
                  {sending ? "Verifying..." : "Verify & Create Account"}
                </button>
                
                <button
                  onClick={handleSendOTP}
                  disabled={sending || cooldown > 0}
                  className="w-full bg-[#FAF5EF] text-[#793A1F] py-4 rounded-2xl font-bold transition hover:bg-[#F3E8DB] disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive code? Resend"}
                </button>

                <button
                  onClick={() => setStage('form')}
                  className="w-full text-center text-sm font-bold text-[#B35D38] hover:underline"
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
