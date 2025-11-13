// my-app/src/pages/frontpages/Dashboard.jsx

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import ProductSearchBar from "../../components/productSearchBar"; // <-- Pakai lagi
import Pagination from "../../components/Pagination"; // <-- Pakai lagi
import { useProducts } from "../../utils/ProductContext"; // <-- Ambil data dari API

export default function Dashboard() {
  const { getProducts, getCategories } = useProducts();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ keyword: "", category: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil kategori untuk dropdown filter
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

  // 🔹 Ambil produk dari API
  const fetchProducts = async (currentPage, currentFilters) => {
    setLoading(true);
    try {
      // getProducts(page, filters)
      const res = await getProducts(currentPage, currentFilters);
      setProducts(res.data); // Data produk
      setMeta(res.meta); // Info pagination
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Panggil API saat pertama kali load, atau saat filter/page berubah
  useEffect(() => {
    fetchProducts(page, filters);
  }, [page, filters]); // <-- Re-fetch jika page atau filter berubah

  // 🔹 Handle search/filter
  const handleSearch = ({ keyword, category }) => {
    setFilters({ keyword, category });
    setPage(1); // Reset ke halaman 1 setiap kali ada search baru
  };

  // 🔹 Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {/* 1. SEARCH BAR & FILTER */}
      <ProductSearchBar onSearch={handleSearch} categories={categories} />

      {/* 2. DAFTAR PRODUK */}
      {loading ? (
        <p className="text-center py-10">Memuat produk...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Tidak ada produk yang cocok.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <ProductCard key={item.id} p={item} />
          ))}
        </div>
      )}

      {/* 3. PAGINATION */}
      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}