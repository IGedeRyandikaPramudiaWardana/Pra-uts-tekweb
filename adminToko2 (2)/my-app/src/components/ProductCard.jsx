//import link router dom
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import apiClient from "../utils/apiClient";
import { ProductProvider } from "../utils/ProductContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


export default function ProductCard({ p }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if(!user){
            toast.error('Silahkan login terlebih dahulu untuk menambahkan item ke keranjang', { icon: '🔒' });
            navigate('/login');
            return;
        } else {
            addToCart(p);
            toast.success('Item berhasil ditambahkan ke keranjang');
        }
    };

    return (
        <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg">
            <img src={p.img_url} alt={p.name} className="mb-2 w-50 h-50 object-cover rounded mx-auto" />
            <h2 className="font-semibold text-2xl">{p.name}</h2>
            <p className="text-gray-600 text-xl">Rp{Number(p.price).toLocaleString()}</p>
            <Link
                to={`/product/${p.id}`} 
                // state={p}
                className="text-blue-600 hover:underline mt-2 block text-xl"
            >
                Lihat Detail
            </Link>
            <p className="text-gray-600">stock: {p.stock}</p>
            {/* Tambahkan tombol "Add to Cart" */}
            <div className="flex justify-center mt-2">
            <button className="mt-2 px-4 py-2 text-2xl bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:text-white"
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
            </div>
        </div>
    );
}