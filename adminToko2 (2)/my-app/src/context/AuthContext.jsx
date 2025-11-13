// my-app/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading untuk cek sesi awal
  const navigate = useNavigate();

  // Cek sesi (token) saat aplikasi pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // Tidak ada token, selesai loading
      return;
    }

    // Ada token, coba fetch profile
    apiClient.get('/profile')
      .then(res => {
        setUser(res.data); // Sukses, set user
      })
      .catch(err => {
        // Token tidak valid/expired
        console.error("Token tidak valid, menghapus token:", err);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Hanya jalan sekali

  // --- FUNGSI BARU ---

  // Fungsi LOGIN
  const login = async (email, password) => {
    // 1. Panggil API login Laravel
    const response = await apiClient.post('/login', { email, password });
    const {token} = response.data;

    // 2. Simpan token ke localStorage
    localStorage.setItem("token", token);

    // 3. Ambil data profile
    const profileResponse = await apiClient.get('/profile');
    
    // 4. Set user state
    setUser(profileResponse.data);

    // 5. Arahkan ke halaman utama (opsional, bisa dihandle halaman login)
    const userRole = profileResponse.data.role;
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  // Fungsi REGISTER
  const register = async (data) => {
    // data = { name, email, password }
    // API register Anda (AuthController.php) mengembalikan 'user'
    const response = await apiClient.post('/register', data);
    return response.data; // Kirim kembali data user baru
  };

  // Fungsi LOGOUT
  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Gagal logout di server:", error);
    } finally {
      // 1. Hapus token dari localStorage
      localStorage.removeItem("token");
      // 2. Set user state ke null
      setUser(null);
      // 3. Arahkan ke halaman login
      navigate('/login');
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);