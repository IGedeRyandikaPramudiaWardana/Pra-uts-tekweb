import React, { use, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";


const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { processCheckout } = useProducts();
  const [ loading, setLoading ] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    payment: "",
  });

  const [success, setSuccess] = useState(false);

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.qty, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Keranjang Anda kosong! Tidak bisa melakukan checkout.");
      return;
    }

    if (!form.name || !form.email || !form.address || !form.phone || !form.payment) {
      alert("Mohon isi semua data dan pilih metode pembayaran!");
      return;
    }

    setLoading(true);
    
    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.qty
      }));

      await processCheckout(orderItems);
      setSuccess(true);
      clearCart();

    } catch (error){
      if (error.response?.status === 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Checkout gagal. Silahkan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
    // ✅ Checkout berhasil
  };
  

  // ✅ Jika keranjang kosong dan belum checkout
  if (cart.length === 0 && !success) {
    return (
      <div className="p-6 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Keranjang Belanja Anda Kosong!
        </h2>
        <p className="mb-4 text-gray-600">
          Sepertinya Anda belum menambahkan apapun ke dalam keranjang.
        </p>
        <Link
          to="/"
          className="px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Ayo Belanja Sekarang!
        </Link>
      </div>
    );
  }

  // ✅ Jika checkout sukses
  if (success) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">✅ Pesanan Berhasil!</h2>
        <p>
          Terima kasih <span className="font-medium">{form.name}</span>, konfirmasi
          pesanan telah dikirim ke email{" "}
          <span className="font-medium">{form.email}</span>.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ✅ Tampilan normal checkout
  return (
    <div className="bg-gray-50 min-h-screen py-8 p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KIRI: Data & Ringkasan */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            🏠 Alamat Pengiriman
          </h2>
          <div className="space-y-3 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="address"
              placeholder="Alamat Lengkap"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Nomor Telepon"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            🛍️ Ringkasan Pesanan
          </h3>
          <div className="divide-y">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.qty} × Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  Rp {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
            <p className="text-right font-bold text-lg pt-3">
              Total: Rp {getTotal().toLocaleString()}
            </p>
          </div>
        </div>

        {/* KANAN: Pembayaran */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            💳 Metode Pembayaran
          </h3>
          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Pilih metode pembayaran</option>
            <option value="BRI">BRI Virtual Account</option>
            <option value="BNI">BNI Virtual Account</option>
            <option value="BCA">BCA Virtual Account</option>
            <option value="COD">COD (Bayar di Tempat)</option>
          </select>

          <div className="border-t pt-3 text-sm text-gray-600">
            <p>Subtotal Produk: Rp {getTotal().toLocaleString()}</p>
            <p>Biaya Pengiriman: Rp 20.000</p>
            <p className="font-bold mt-2 text-gray-900">
              Total Tagihan: Rp {(getTotal() + 20000).toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || loading}
            className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
