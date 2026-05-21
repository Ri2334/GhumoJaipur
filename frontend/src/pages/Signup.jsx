import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateName, validateMobile } from "../utils/validators";
import OTPInput from "../components/OTPInput";

export default function Signup() {
  const { signup, sendOTP, verifyOTP } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [stage, setStage] = useState("form"); // form | otp
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
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
    if (!validatePassword(password)) e.password = "Password must be 8+ chars, include uppercase, lowercase, digit and special";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOTP = async () => {
    setServerError(null);
    if (!runValidation()) return;
    setSending(true);
    const res = await sendOTP(email, "signup");
    setSending(false);
    if (res.success) {
      setErrors({});
      setServerError(null);
      setStage("otp");
      setCooldown(30);
    }
    else setServerError(res.message || "Failed to send OTP");
  };

  const handleVerifyAndSignup = async () => {
    setServerError(null);
    if (otp.length < 6) return setServerError("Enter the 6-digit OTP");
    setSending(true);
    const v = await verifyOTP(email, otp);
    if (!v.success) {
      setSending(false);
      return setServerError("Invalid OTP");
    }
    // verified -> create account
    const payload = { fullName, email, mobile, password, otp };
    const res = await signup(payload);
    setSending(false);
    if (res.success) navigate('/');
    else setServerError(res.message || 'Signup failed. Please go back and check the form fields.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!runValidation()) return;
    // if validation passes, send OTP and move to otp stage
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Create your account</h2>
        {serverError && <div className="text-red-500 mb-3">{serverError}</div>}

        {stage === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input value={fullName} onChange={(e)=> setFullName(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
              {errors.fullName && <div className="text-sm text-red-500">{errors.fullName}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="flex gap-2 items-center">
                <input value={email} onChange={(e)=> setEmail(e.target.value)} className="mt-1 flex-1 border px-3 py-2 rounded" type="email" />
                  <button type="button" onClick={handleSendOTP} disabled={sending || cooldown > 0} className="bg-blue-600 text-white px-3 py-2 rounded">{sending? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}</button>
              </div>
              {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile number</label>
              <input value={mobile} onChange={(e)=> setMobile(e.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full border px-3 py-2 rounded" />
              {errors.mobile && <div className="text-sm text-red-500">{errors.mobile}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input value={password} onChange={(e)=> setPassword(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" type="password" />
              {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input value={confirm} onChange={(e)=> setConfirm(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" type="password" />
              {errors.confirm && <div className="text-sm text-red-500">{errors.confirm}</div>}
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded">Sign up</button>
          </form>
        )}

        {stage === 'otp' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">We've sent a 6-digit code to <strong>{email}</strong>. Enter it below to complete signup.</p>
            <p className="text-xs text-amber-600">If you see an error now, it usually means the form fields above were not completed or validated before requesting OTP.</p>
            <OTPInput length={6} onChange={setOtp} />
            <div className="flex gap-2">
              <button onClick={handleVerifyAndSignup} disabled={sending || otp.length < 6} className="flex-1 bg-green-600 text-white py-2 rounded">{sending? 'Verifying...' : 'Verify & Create'}</button>
              <button onClick={handleSendOTP} disabled={sending || cooldown > 0} className="flex-1 bg-gray-200 py-2 rounded">{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
