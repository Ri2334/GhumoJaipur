import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { validateEmail } from '../utils/validators'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){
  const { forgotPassword } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSend = async () =>{
    setError(null)
    if(!validateEmail(email)) return setError('Enter a valid email')
    setLoading(true)
    const res = await forgotPassword(email)
    setLoading(false)
    if(res.success){
      setCooldown(30)
      navigate('/reset-password', { state: { email } })
    } else setError(res.message || 'Failed to send OTP')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="space-y-3">
          <label className="text-sm">Enter your account email</label>
          <input value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" type='email' />
          <button disabled={loading || cooldown > 0} onClick={handleSend} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}</button>
          <p className="text-xs text-gray-500">After sending the OTP, you will be taken to the reset screen.</p>
        </div>
      </div>
    </div>
  )
}
