import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. Tunggu sampai pengecekan auth selesai
  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan spinner
  }

  // 2. Cek apakah user ada (role apapun, 'user' atau 'admin')
  if (user) {
    return <Outlet />; // <-- 3. Jika ya, izinkan akses ke halaman (misal: Cart, Checkout)
  }

  // 4. Jika tidak, tendang ke halaman login
  return <Navigate to="/login" replace />;
}