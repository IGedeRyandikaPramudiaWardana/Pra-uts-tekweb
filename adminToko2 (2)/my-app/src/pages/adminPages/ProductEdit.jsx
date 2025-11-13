import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Impor useQuery

export default function ProductEdit() {
    const { id } = useParams();
    const { updateProduct, getProductById, getCategories } = useProducts(); // Ambil getCategories
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "", // Awalnya kosong
        description: "",
        img: null, // Ini HANYA untuk file BARU
    });
    const [errors, setErrors] = useState({});
    
    // State terpisah untuk menyimpan URL gambar LAMA & preview BARU
    const [imagePreview, setImagePreview] = useState(null); 

    // 1. Ambil data kategori untuk dropdown
    const { data: categories = [] } = useQuery({
         queryKey: ["categories"],
         queryFn: getCategories,
    });

    // 2. Ambil data produk saat load
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductById(id);
                setFormData({
                    name: res.name || "",
                    price: res.price || "",
                    stock: res.stock || "",
                    description: res.description || "",
                    category_id: res.category.id || "", // Gunakan ID dari relasi
                    img: null, // Selalu null di awal, hanya untuk file baru
                });
                // Simpan URL gambar LAMA untuk preview
                if (res.img_url) {
                    setImagePreview(res.img_url); 
                }
            } catch (err) {
                toast.error("Gagal memuat data produk.");
            }
        };
        fetchProduct();
    }, [id, getProductById]);

    // 3. Handle perubahan input
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === "img" && files[0]) {
            const newFile = files[0];
            // Gunakan functional update untuk menjamin state sebelumnya
            setFormData(prevState => ({ 
                ...prevState, 
                img: newFile 
            }));
            setImagePreview(URL.createObjectURL(newFile));
        } else {
            // Gunakan functional update untuk menjamin state sebelumnya
            setFormData(prevState => ({ 
                ...prevState, 
                [name]: value 
            }));
        }
    };

    // 4. Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); 

        const data = new FormData();
        
        // 🚀 PERBAIKAN BUG UTAMA:
        // Loop semua data di state dan HANYA tambahkan jika BUKAN null
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) { 
                data.append(key, value);
            }
        });

        // (Kita tambahkan _method: 'PUT' secara manual karena API Anda membutuhkannya)
        // data.append('_method', 'PUT');

        try {
            // Panggil fungsi updateProduct (ini adalah 'async', bukan 'mutate')
            const response = await updateProduct(id, data); 
            if (response.status === 200) {
                toast.success("Produk berhasil diperbarui!");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            if (error.response?.status === 422){
                setErrors(error.response.data.errors);
                toast.error("⚠ Periksa kembali data yang dimasukkan.");
            } else {
                toast.error("❌ Telah terjadi kesalahan, gagal memperbarui produk.");
            }
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Edit Produk
            </h2>

            {/* Input Nama */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Nama Produk</label>
                <input
                    name="name" 
                    placeholder="Nama Produk"
                    onChange={handleChange}
                    value={formData.name}
                    className={`border rounded-md p-2 w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            {/* Input Kategori (Dropdown) */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Kategori</label>
                <select 
                    name="category_id" 
                    onChange={handleChange} 
                    value={formData.category_id}
                    className={`border rounded-md p-2 w-full ${errors.category_id ? "border-red-500" : ""}`}
                >
                    <option value="">--- Pilih Kategori ---</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.category}
                        </option>
                    ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>}
            </div>

            {/* Input Harga */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Harga</label>
                <input 
                    name="price" 
                    type="number"
                    placeholder="Harga Produk"
                    onChange={handleChange}
                    value={formData.price}
                    className={`border rounded-md p-2 w-full ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>}
            </div>

            {/* Input Stok */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Stok</label>
                <input 
                    name="stock" 
                    type="number"
                    placeholder="Stock Produk"
                    onChange={handleChange}
                    value={formData.stock}
                    className={`border rounded-md p-2 w-full ${errors.stock ? "border-red-500" : ""}`}
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock[0]}</p>}
            </div>

            {/* Input Deskripsi */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea 
                    name="description" 
                    placeholder="Deskripsi Produk"
                    onChange={handleChange}
                    value={formData.description}
                    rows="3"
                    className="border border-gray-300 rounded-lg p-2"
                />
            </div>

            {/* Input Gambar */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Ganti Gambar Produk</label>
                <input 
                    name="img"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 ..."
                />
                {errors.img && <p className="text-red-500 text-sm mt-1">{errors.img[0]}</p>}
            </div>  

            {/* Preview Gambar */}
            {imagePreview && (
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Preview Gambar:</label>
                    <img src={imagePreview} alt="Preview" className="mt-2 w-full h-auto object-cover rounded-md" />
                </div>
            )}

            <button 
                type="submit"
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
                Simpan Perubahan
            </button>    
        </form>
    );
}