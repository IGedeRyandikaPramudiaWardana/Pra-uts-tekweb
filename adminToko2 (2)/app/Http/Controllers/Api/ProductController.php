<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ... (Tidak ada perubahan)
        $query = Product::with('category');

        if (request()->has('keyword') && !empty($request->keyword)) {
            $query->where('name','like','%'. $request->keyword . '%');
        }

        if ($request->has('category') && !empty($request->category)) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('category','like','%' . $request->category .'%');
            });
        }

        $products = $query->paginate(6);

        $products->appends($request->only(['keyword', 'category']));

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // ... (Tidak ada perubahan, ini sudah benar)
        $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        
        $path = null; 
        
        if ($request->hasFile('img')) { 
            $path = $request->file('img')->store('products', 'public'); 
        } 
        
        $product = Product::create([
            'name'=> $request->name,
            'description'=> $request->description,
            'category_id'=> $request->category_id,
            'price'=> $request->price,
            'stock'=> $request->stock,
            'img'=> $path,
            'slug'=> Str::slug($request->name),
        ]);
        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // ... (Tidak ada perubahan)
        $product = Product::with('category')->findOrFail($id);
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     * * **PERBAIKAN:** Menggunakan Route Model Binding (Product $product)
     * Ini berfungsi karena route kita sekarang /products/{product}
     */
    // public function update(Request $request, string $id) // <-- Versi lama
    public function update(Request $request, Product $product) // <-- Versi baru
    {
        // Validasi input
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,category_id',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // $product = Product::findOrFail($id); // <-- HAPUS: Tidak perlu lagi, $product sudah otomatis di-inject

        if($request->hasFile('img')){
            // Hapus gambar lama jika ada
            if($product->img){
                Storage::disk('public')->delete($product->img);
            }
            // Simpan gambar baru
            $validatedData['img'] = $request->file('img')->store('products', 'public');
            
        } else {
            // Jika tidak ada file baru, jangan sertakan 'img' dalam data update
            // (Note: $validatedData['img'] mungkin 'null' jika 'img' tidak ada di request)
            // Untuk keamanan, kita hapus kuncinya jika tidak ada file
             unset($validatedData['img']);
        }

        // Update slug jika nama berubah
        if (isset($validatedData['name'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }

        // Update produk dengan data yang sudah divalidasi
        $product->update($validatedData);
        
        // Kembalikan response JSON
        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // ... (Tidak ada perubahan)
        $product = Product::find($id);
        if($product != null){
            $product->delete();
            // Hapus gambar dari storage saat produk dihapus
            if($product->img){
                 Storage::disk('public')->delete($product->img);
            }
            return response()->json(['message' => 'Product is deleted successfully']);
        }
        
        return response()->json(['message'=> 'Product not found'], 404);
    }


    // ... (Fungsi adminPage tidak berubah)
    public function adminPage()
    {
        $products = Product::with('category')->get();
        return view('adminLayout.adminPage', compact('products'));
    }

}