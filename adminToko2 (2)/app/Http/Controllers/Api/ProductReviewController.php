<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller {

    // 1. Ambil semua review untuk produk_id tertentu
    public function index(Product $product) {
        // Ambil review, dan sertakan data 'user' (hanya id dan nama)
        $reviews = ProductReview::with('user:id,name') // Ambil relasi user
            ->where('product_id', $product->product_id)
            ->latest('updated_at') // Tampilkan yang terbaru/baru diedit
            ->paginate(10); 

        return response()->json($reviews);
    }

    // 2. Simpan (atau Update) review
    public function store(Request $request, Product $product) {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Ini adalah magic-nya (memenuhi Req "1 review per user" & "bisa diedit")
        $review = ProductReview::updateOrCreate(
            [
                'user_id' => $user->id,                // Kunci pencarian 1
                'product_id' => $product->product_id, // Kunci pencarian 2
            ],
            [
                'rating' => $request->rating,         // Data yang di-update/insert
                'comment' => $request->comment,       // Data yang di-update/insert
            ]
        );

        // Muat data user untuk dikirim kembali ke frontend
        $review->load('user:id,name');

        return response()->json($review, 201); // 201 = Created (atau updated)
    }

    // 3. Hapus review
    public function destroy(Request $request, ProductReview $review) {
        // Pastikan user yang menghapus adalah pemilik review
        if ($request->user()->id !== $review->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();
        return response()->json(null, 204); // 204 = No Content (Sukses)
    }
}