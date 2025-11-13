import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; // Akan kita gunakan nanti

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth(); // Akan kita gunakan nanti
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password harus memiliki minimal 6 karakter.');
      return;
    }

    setLoading(true);
    // toast.error("Fungsi register belum diimplementasikan!"); // Placeholder
    // setLoading(false);

    // --- Ini adalah LOGIKA yang akan kita tambahkan nanti (di Langkah 2) ---
    try {
      await register({ name, email, password });
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login'); // Arahkan ke halaman login
    } catch (error) {
        if(error.response?.status === 422){
    //   toast.error(error.message || 'Registrasi gagal.');
        const errors = error.response.data.errors;

        if(errors.email){
            toast.error(errors.email[0]);
        } else {
            toast.error('Registrasi gagal, silahkan periksa kembali data anda.');
        }
        
    } else { 
        toast.error('Registrasi Gagal.');
        
    }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="Nama Lengkap Anda"
            />
          </div>
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
              minLength={6}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}