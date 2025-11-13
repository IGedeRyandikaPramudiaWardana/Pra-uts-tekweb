// productSearchBar.jsx
import React, { useState } from "react";

/**
 * Komponen pencarian dan filter kategori
 * Memanggil props.onSearch({ keyword, category })
 */
export default function ProductSearchBar({ onSearch, categories = [] }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, category });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mb-4 items-center"
    >
      <input
        type="text"
        placeholder="Cari produk..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border rounded-md p-2 w-full sm:w-1/2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-md p-2 w-full sm:w-1/3"
      >
        <option value="">Semua Kategori</option>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat.category_id} value={cat.category}>
              {cat.category}
            </option>
          ))
        ) : (
          <option disabled>Memuat kategori...</option>
        )}
      </select>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Cari
      </button>
    </form>
  );
}
