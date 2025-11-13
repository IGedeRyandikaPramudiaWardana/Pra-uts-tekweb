// my-app/src/components/Navbar.jsx

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // 1. Impor hook useAuth

export default function Navbar() {
  const { totalQty } = useCart();
  const { user, logout } = useAuth(); // 2. Ambil status user dan fungsi logout

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      {/* Menu Navigasi Tengah */}
      <div className="flex gap-6 items-center">
        {/*
          Kita ganti link /Dashboard (yang tidak ada) menjadi / (Home)
        */}
        <Link to="/" className="hover:text-gray-200">
          Home
        </Link>
        <Link to="/cart" className="relative hover:text-gray-200">
          Keranjang
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </Link>
        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>

        {/* 3. Tampilkan link Admin HANYA JIKA user adalah admin */}
        {user && user.role === 'admin' && (
          <Link 
            to="/admin/dashboard" 
            className="hover:text-yellow-300 bg-yellow-500 px-2 py-1 rounded-md text-sm font-medium"
          >
            Admin Panel
          </Link>
        )}
      </div>

      {/* 4. Menu Kanan: Info Login/Logout (Dinamis) */}
      <div className="flex gap-4 items-center">
        {user ? (
          // Jika SUDAH login
          <>
            <span className="text-gray-200">Halo, {user.name}</span>
            <button
              onClick={logout} // Panggil fungsi logout dari context
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          // Jika BELUM login
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}