import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) { 
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil!");
  };

  return ( 
    <div 
      className={`${ 
        sidebarOpen ? "block" : "hidden" 
      } md:block w-64 bg-blue-400 shadow-md flex flex-col`} // Pastikan 'flex-col' ada
    > 
      {/* Wrapper untuk item menu (agar bisa didorong ke bawah) */}
      <div className="flex-1">
          <div className="p-4 font-bold text-xl text-center">My Admin</div> 
          <nav className="flex flex-col p-4 space-y-2"> 
            <Link 
                to="/admin/dashboard" 
                className="hover:bg-blue-800 hover:text-white p-2 rounded"
            > 
              📊 Dashboard 
            </Link> 
            <Link 
                to="/admin/about" 
                className="hover:bg-blue-800 hover:text-white p-2 rounded"
            > 
              ℹ️ About 
            </Link> 

            {/* 🚀 PERBAIKAN: Ganti <link> menjadi <Link> dan perbaiki className */}
            <Link 
                to="/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:bg-blue-800 hover:text-white p-2 rounded mt-4 border-t border-blue-500"
            >
              🏠 Lihat Toko
            </Link>  
          </nav>
      </div> 
      
      {/* 🚀 PERBAIKAN: Pindahkan tombol logout ke luar <nav> agar di bawah */}
      <div className="p-4">
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded"
        >
          Logout
        </button>
     </div>
    </div> 
  ); 
}