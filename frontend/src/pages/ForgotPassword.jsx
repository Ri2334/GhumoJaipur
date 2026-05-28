import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { validateEmail } from '../utils/validators'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaArrowRight, FaChevronLeft } from 'react-icons/fa'

export default function ForgotPassword(){
  const { forgotPassword } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSend = async () =>{
    setError(null)
    if(!validateEmail(email)) return setError('Please enter a valid email address')
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      setLoading(false)
      if(res.success){
        setCooldown(30)
        navigate('/reset-password', { state: { email } })
      } else {
        setError(res.message || 'Could not find an account with that email.')
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/70 rounded-[3rem] shadow-2xl shadow-indigo-100/50 p-8 md:p-12 relative overflow-hidden">
        
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6">🔒</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
          <p className="text-gray-500 font-medium mt-2">Enter your email and we'll send you an OTP to reset your password.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-6">
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

          <button 
            disabled={loading || cooldown > 0} 
            onClick={handleSend} 
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Reset OTP'}
            {!loading && <FaArrowRight size={14} />}
          </button>
          
          <div className="text-center pt-4">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition">
              <FaChevronLeft size={10} /> Back to Login
            </Link>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  )
}
