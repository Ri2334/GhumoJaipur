import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { validatePassword } from '../utils/validators'

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
    if(!validatePassword(password)) return setError('Password does not meet requirements')
    if(password !== confirm) return setError('Passwords do not match')
    if(!email) return setError('Missing email context')
    setLoading(true)
    const res = await resetPassword({ email, otp, newPassword: password })
    setLoading(false)
    if (res.success) navigate('/login')
    else setError(res.message || 'Unable to reset password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input value={email} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />
          </div>

          <div>
            <label className="text-sm">OTP (from email)</label>
            <input value={otp} onChange={e=> setOtp(e.target.value.replace(/[^0-9]/g,''))} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="text-sm">New password</label>
            <input value={password} onChange={e=> setPassword(e.target.value)} type='password' className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="text-sm">Confirm password</label>
            <input value={confirm} onChange={e=> setConfirm(e.target.value)} type='password' className="w-full border px-3 py-2 rounded" />
          </div>

          <button disabled={loading} onClick={handleReset} className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded">{loading? 'Resetting...' : 'Reset Password'}</button>
        </div>
      </div>
    </div>
  )
}
