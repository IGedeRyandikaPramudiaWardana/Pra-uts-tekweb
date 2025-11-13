// my-app/src/pages/frontpages/ProductDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react"; // <-- Tambah useEffect, useMemo
import { useProducts } from "../../utils/ProductContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // <-- Impor Auth
import { useQuery } from "@tanstack/react-query"; // <-- Impor useQuery
import toast from "react-hot-toast";


// Helper untuk format tanggal
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ProductDetail() {
  const { id } = useParams(); // id produk dari URL
  const { user } = useAuth(); // Data user yang sedang login
  const { getProductById, getReviews, upsertReview, deleteReview } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // State untuk form review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // == 1. Fetch Data Produk ==
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id)
  });

  // == 2. Fetch Data Review ==
  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', id], // Key unik: ['reviews', '5']
    queryFn: () => getReviews(id)
  });
  // Data review ada di 'reviewsData.data' karena paginasi
  const reviews = reviewsData?.data || []; 

  // == 3. Cari review milik user ini ==
  const myReview = useMemo(() => {
    if (!user || !reviews) return null;
    return reviews.find(r => r.user_id === user.id);
  }, [user, reviews]);

  // == 4. Isi form jika user sudah pernah review ==
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment || "");
    } else {
      // Jika user hapus review, reset form
      setRating(0);
      setComment("");
    }
  }, [myReview]);


  // == 5. Handle Submit Form ==
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Harap pilih bintang rating.");
      return;
    }
    // Panggil fungsi mutasi dari context
    upsertReview({ productId: id, data: { rating, comment } });
  };

  const handleAddToCart = () => {
    if(!user){
      toast.error('Silahkan login terlebih dahulu untuk menambahkan item ke keranjang', { icon: '🔒' });
      navigate('/login');
      return;
    } else {
      addToCart(product);
      toast.success('Item berhasil ditambahkan ke keranjang');
    }
  };

  // == 6. Handle Hapus Review ==
  const handleDelete = () => {
    if (myReview && window.confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      deleteReview(myReview.id);
    }
  };

  // Tampilan Loading
  if (isLoadingProduct || isLoadingReviews) {
    return <div className="p-6 text-center">Memuat...</div>;
  }
  if (!product) {
    return <div className="p-6 text-center">Produk tidak ditemukan.</div>;
  }



  // Tampilan Halaman
  return (
    <div className="p-6 space-y-6 md:flex gap-6">
      {/* Bagian Kiri: Info Produk & Daftar Review */}
      <section className="flex-1 space-y-6">
        {/* ... (Info Produk Anda, saya salin dari file Anda) ... */}
        <div className="border rounded-lg p-6 shadow-lg bg-white">
          <img src={product.img_url} alt={product.name} className="w-full max-w-sm h-auto object-cover rounded-lg mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-4">Rp{Number(product.price).toLocaleString()}</p>
          <p className="text-gray-500 mb-2">Kategori: {product.category?.name || "N/A"}</p>
          <p className="text-gray-500 mb-4">Stok: {product.stock}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button onClick={handleAddToCart} className="w-full px-4 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Tambah ke Keranjang
          </button>
        </div>

        {/* Daftar Review (UI Baru) */}
        <div>
          <h2 className="text-xl font-semibold mb-3">User Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada review.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    {/* <img src={r.user.photo_url || '/placeholder.jpg'} alt={r.user.name} className="w-10 h-10 rounded-full bg-gray-200" /> */}
                    <div>
                      <strong className="text-gray-800">{r.user.name}</strong>
                      <p className="text-sm text-gray-500">
                        Di-review pada: {formatDate(r.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(r.rating)].map((_, i) => ( <span key={i} className="text-yellow-500">★</span> ))}
                    {[...Array(5 - r.rating)].map((_, i) => ( <span key={i} className="text-gray-300">★</span> ))}
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Bagian Kanan: Form Review (UI Baru) */}
      <section className="border rounded-lg p-6 shadow-lg bg-white md:w-1/3 h-fit">
        <h2 className="text-xl font-semibold">
          {myReview ? "Edit Review Anda" : "Beri Review"}
        </h2>
        
        {/* Tampilkan form hanya jika user login */}
        {!user ? (
          <p className="text-gray-600 mt-4">Anda harus login untuk memberi review.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mb-6 mt-4 space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}
                    className={`text-3xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                  >★</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Review:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded-lg p-2 w-full"
                rows="4"
                placeholder="Tulis pengalaman anda..."
              ></textarea>
            </div>

            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              {myReview ? "Update Review" : "Submit Review"}
            </button>

            {/* Tombol Hapus hanya muncul jika sudah pernah review */}
            {myReview && (
              <button type="button" onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus Review
              </button>
            )}
          </form>
        )}
      </section>
    </div>
  );
}