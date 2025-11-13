import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cart, updateQty, removeFromCart } = useCart();

  const getTotal = () =>
    cart.reduce((total, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.qty) || 1;
      return total + price * qty;
    }, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Keranjang Belanja Anda Kosong!</h2>
        <p className="mb-4 text-gray-600">
          Sepertinya Anda belum menambahkan apapun ke dalam keranjang belanja Anda.
        </p>
        <Link to="/" className="px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Ayo Belanja Sekarang!
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Keranjang</h2>

      {/* Kontainer utama: 2 kolom */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Bagian kiri: daftar produk */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="font-semibold text-lg">Daftar Produk ({cart.length})</h3>
            <button className="text-sm text-red-500 hover:underline" onClick={() => cart.forEach(i => removeFromCart(i.id))}>
              Hapus Semua
            </button>
          </div>

          <ul className="space-y-4">
            {cart.map((item, idx) => {
              const id = item?.id ?? idx;
              const name = item?.name ?? "Nama Produk";
              const price = Number(item?.price) || 0;
              const qty = Math.max(Number(item?.qty) || 1, 1);

              return (
                <li
                  key={id}
                  className="flex items-center justify-between border-b pb-4 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    {item?.img && (
                      <img
                        src={item.img}
                        alt={name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{name}</p>
                      <p className="text-sm text-gray-500">Rp {price.toLocaleString()}</p>

                      {/* Kontrol quantity */}
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => updateQty(item.id, qty - 1)}
                          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                          disabled={qty <= 1}
                        >
                          −
                        </button>

                        <div className="px-3 text-gray-800 font-medium">{qty}</div>

                        <button
                          onClick={() => updateQty(item.id, qty + 1)}
                          className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      Rp {(price * qty).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-red-500 text-sm mt-1 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bagian kanan: ringkasan belanja */}
        <div className="w-full md:w-80 bg-white p-5 rounded-xl shadow-sm border border-gray-200 self-start">
          <h3 className="text-lg font-semibold mb-20">Ringkasan Belanja</h3>

          <div className="flex justify-between mb-2 text-gray-700">
            <span>Total Harga:</span>
            <span className="font-semibold">Rp {getTotal().toLocaleString()}</span>
          </div>

          

          <Link
            to="/checkout"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            Checkout ({cart.length})
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
