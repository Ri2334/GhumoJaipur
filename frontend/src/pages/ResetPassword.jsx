import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { validatePassword } from '../utils/validators'
import { FaLock, FaKey, FaArrowRight } from 'react-icons/fa'
import OTPInput from "../components/OTPInput";

const InputField = ({ label, icon: Icon, value, onChange, type = "text", error, placeholder, disabled = false }) => (
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
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-gray-50 border-gray-100'} border-2 group-focus-within:border-indigo-600 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium transition-all outline-none`}
      />
    </div>
    {error && <p className="text-[10px] font-bold text-red-500 ml-2 animate-pulse">{error}</p>}
  </div>
);

export default function ResetPassword(){
  const location = useLocation()
  const navigate = useNavigate()
  const { resetPassword } = useContext(AuthContext)
  const email = location.state?.email || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleReset = async () =>{
    setError(null)
    if(otp.length < 6) return setError('Please enter the 6-digit OTP')
    if(!validatePassword(password)) return setError('Min 8 chars, 1 Upper, 1 Lower, 1 Digit, 1 Special')
    if(password !== confirm) return setError('Passwords do not match')
    if(!email) return setError('Missing email context')
    setLoading(true)
    try {
      const res = await resetPassword({ email, otp, newPassword: password })
      setLoading(false)
      if (res.success) navigate('/login')
      else setError(res.message || 'Unable to reset password')
    } catch (err) {
      setLoading(false)
      setError("An unexpected error occurred.")
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#E6D6C3] rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
        
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-[#FAF1EC] border border-[#E6D6C3] rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6">🔑</div>
          <h2 className="text-3xl font-marcellus text-[#2C1E18]">New Password</h2>
          <p className="text-[#543C32] text-xs font-medium mt-2">Check your email for the OTP and set your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-4">
             <div className="text-center space-y-2">
                <p className="text-[10px] font-bold uppercase text-[#A37B66] tracking-widest">Enter OTP sent to {email}</p>
                <div className="flex justify-center">
                   <OTPInput length={6} onChange={setOtp} />
                </div>
             </div>

            <InputField label="New Password" icon={FaKey} value={password} onChange={e=> setPassword(e.target.value)} type='password' placeholder="••••••••" />
            <InputField label="Confirm Password" icon={FaLock} value={confirm} onChange={e=> setConfirm(e.target.value)} type='password' placeholder="••••••••" />
          </div>

          <button 
            disabled={loading} 
            onClick={handleReset} 
            className="w-full bg-[#B35D38] hover:bg-[#964B2A] text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? 'Updating...' : 'Update Password'}
            {!loading && <FaArrowRight size={14} />}
          </button>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-[#B35D38]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  )
}
