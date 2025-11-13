import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; // Akan kita gunakan nanti

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Akan kita gunakan nanti
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // toast.error("Fungsi login belum diimplementasikan!"); // Placeholder
    // setLoading(false);
    
    // --- Ini adalah LOGIKA yang akan kita tambahkan nanti (di Langkah 2) ---
    try {
      await login(email, password);
      // toast.success('Login berhasil!');
      // navigate('/'); // Arahkan ke dashboard customer
    } catch (error) {
      toast.error('Login gagal. Periksa email atau password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="anda@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
}