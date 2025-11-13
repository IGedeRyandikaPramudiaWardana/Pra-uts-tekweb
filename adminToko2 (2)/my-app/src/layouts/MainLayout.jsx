// my-app/src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <Navbar />

      {/* Main Section - Outlet akan merender Dashboard, Cart, dll. */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>2025 E-Commerce Simple App | Version 1.0</p>
      </footer>
    </div>
  );
}