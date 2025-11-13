import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  // 1. Tunggu sampai pengecekan auth selesai
  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan spinner
  }

  // 2. Cek apakah user ada DAN rolenya 'admin'
  if (user && user.role === 'admin') {
    return <Outlet />; // <-- 3. Jika ya, izinkan akses ke halaman (misal: AdminDashboard)
  }

  // 4. Jika tidak, tendang ke halaman login
  return <Navigate to="/login" replace />;
}