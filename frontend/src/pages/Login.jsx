import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please provide email and password");
    const res = await login({ email, password });
    if (res.success) navigate('/dashboard');
    else setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Login to Ghumo Jaipur</h2>
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" type="email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input value={password} onChange={(e)=> setPassword(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" type={show? 'text' : 'password'} />
              <button type="button" onClick={()=> setShow(s => !s)} className="absolute right-2 top-2 text-sm">{show? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Remember me</label>
            <button type="button" className="text-sm text-blue-600" onClick={()=> navigate('/forgot-password')}>Forgot?</button>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded">
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-500">Or continue with</div>
          <button type="button" className="w-full border px-3 py-2 rounded">Continue with Google</button>
        </form>
      </div>
    </div>
  );
}
