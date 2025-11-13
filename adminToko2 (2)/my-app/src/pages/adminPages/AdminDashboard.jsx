// AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductSearchBar from "../../components/productSearchBar";
import Pagination from "../../components/Pagination";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { getProducts, deleteProduct, getCategories } = useProducts();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ keyword: "", category: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Load kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    fetchCategories();
  }, [getCategories]);

  // 🔹 Ambil produk
  const fetchProducts = async (filters = {}, page = 1) => {
    setLoading(true);
    try {
      const res = await getProducts(page, filters);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load awal
  useEffect(() => {
    fetchProducts(filters, page);
  }, []);

  // 🔹 Delete produk
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
      fetchProducts(filters, page);
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };

  // 🔹 Handle search/filter
  const handleSearch = async ({ keyword, category }) => {
    const newFilters = { keyword, category };
    setFilters(newFilters);
    setPage(1);
    await fetchProducts(newFilters, 1);
  };

  // 🔹 Handle pagination
  const handlePageChange = async (newPage) => {
    setPage(newPage);
    await fetchProducts(filters, newPage);
  };

  // 🔹 Render UI
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Manajemen Produk</h1>

      <div className="mb-4">
        <Link to="/admin/add-product" className="text-blue-600 hover:underline">
          Tambah Produk
        </Link>
      </div>

      <ProductSearchBar onSearch={handleSearch} categories={categories} />

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th>Image</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products.map((p, index) => (
                <tr key={p.id}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    <img src={p.img_url} alt={p.name} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="p-2 border">
                    {p.name} <br />
                    <small className="text-gray-500">#{p.category?.category}</small>
                  </td>
                  <td className="p-2 border">Rp. {p.price}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border space-x-2">
                    <Link to={`/admin/edit-product/${p.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="cursor-pointer text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {meta && (
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
