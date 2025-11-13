// confirmDeleteToast.jsx
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

/**
 * Menampilkan notifikasi konfirmasi penghapusan data produk.
 * Mengembalikan promise yang bernilai true jika user menekan "Ya", false jika "Batal".
 */
export default function confirmDeleteToast(message = "Apakah kamu yakin ingin menghapus produk ini?") {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="p-4">
        <p className="font-medium text-gray-800 mb-2">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Ya
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Batal
          </button>
        </div>
      </div>
    ), {
    //   duration: 5000,
      position: "top-center",
    });
  });
}
