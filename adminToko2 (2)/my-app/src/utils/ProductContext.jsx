// my-app/src/utils/ProductContext.jsx
import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import toast from "react-hot-toast"; // Pastikan toast di-import

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // GET produk by ID
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  };

  // -----------------------------------------------------------------
  // 🚀 PERBAIKAN 1: Mengubah addProduct menjadi useMutation
  // -----------------------------------------------------------------
  const addProduct = useMutation({
    mutationFn: async (formData) => {
      const res = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    },
    onSuccess: () => {
      // Jika sukses, segarkan data produk
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    // onError (penanganan error) akan dilakukan di dalam komponen form
  });

   // -----------------------------------------------------------------
  // 🚀 PERBAIKAN 2: Hapus "?_method=PUT" dari URL updateProduct
  // -----------------------------------------------------------------
const updateProduct = async (id, formData) => {
    // Hapus object headers. Biarkan axios menanganinya.
    const res = await apiClient.post(`/products/${id}`, formData);
    
    queryClient.invalidateQueries(["products"]);
    return res;
  };

  // DELETE produk
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // GET kategori
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  };

  // GET produk dengan pagination dan filter
  const getProducts = async (page = 1, filters = {}) => {
    const res = await apiClient.get("/products", { params: { page, ...filters } });
    return res.data; 
  };

  // --- Fungsi Review (Sudah Benar) ---
  const getReviews = async (productId) => {
    const res = await apiClient.get(`/products/${productId}/reviews`);
    return res.data;
  };

  const upsertReview = useMutation({
    mutationFn: ({ productId, data }) =>
      apiClient.post(`/products/${productId}/reviews`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success("Review berhasil ditambahkan!");
    },
    onError: (err) => {
      toast.error("Terjadi kesalahan saat menambahkan review.");
    }
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId) => apiClient.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Review berhasil dihapus!");
    },
    onError: (err) => {
      toast.error("Terjadi kesalahan saat menghapus review.");
    }
  });

  // --- Fungsi Checkout (Sudah Benar) ---
  const processCheckout = async (cartItems) => {
    try {
      const response = await apiClient.post("/orders", { cart: cartItems });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        getProductById,
        addProduct: addProduct, // 3. Kirim objek mutasi
        updateProduct,
        deleteProduct,
        getCategories,
        getProducts,
        getReviews,
        upsertReview: upsertReview.mutate,
        deleteReview: deleteReview.mutate,
        processCheckout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);