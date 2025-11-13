// Pagination.jsx
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Buat array halaman agar user bisa klik langsung
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-md ${
          currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
        }`}
      >
        &lt; Prev
      </button>

      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 border rounded-md ${
            num === currentPage ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-md ${
          currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
        }`}
      >
        Next &gt;
      </button>
    </div>
  );
}
