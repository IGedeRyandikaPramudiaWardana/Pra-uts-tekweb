<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <-- Penting untuk Transaksi


class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi data keranjang (cart) yang dikirim dari React
        $validated = $request->validate([
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|integer|exists:products,product_id',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cartItems = $validated['cart'];
        $totalAmount = 0;

        try {
            // 2. Mulai Transaksi Database
            // Ini memastikan jika 1 produk gagal (misal: stok habis),
            // semua perubahan lain akan dibatalkan (rollback).
            DB::beginTransaction();

            // 3. Kunci produk & hitung total
            // Kita harus mengunci baris produk untuk mencegah "race condition"
            // (dua orang membeli barang terakhir di waktu yang sama)
            foreach ($cartItems as $item) {
                $product = Product::where('product_id', $item['product_id'])
                                  ->lockForUpdate() // <-- Kunci baris ini
                                  ->first();

                // 4. Cek Stok
                if ($product->stock < $item['quantity']) {
                    // Jika stok tidak cukup, batalkan semua
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Stok untuk produk ' . $product->name . ' tidak mencukupi.'
                    ], 422); // 422 Unprocessable Entity
                }

                $totalAmount += $product->price * $item['quantity'];
            }

            // 5. Buat Order baru
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'pending', // Awalnya pending
            ]);

            // 6. Kurangi Stok dan catat Order Items
            foreach ($cartItems as $item) {
                $product = Product::find($item['product_id']); // Temukan lagi (sudah aman)
                
                // KURANGI STOK
                $product->decrement('stock', $item['quantity']);

                // Catat item yang dibeli
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // Simpan harga saat ini
                ]);
            }

            // 7. Jika semua berhasil, simpan perubahan permanen
            DB::commit();

            return response()->json([
                'message' => 'Checkout berhasil!',
                'order_id' => $order->id
            ], 201); // 201 Created

        } catch (\Exception $e) {
            // 8. Jika terjadi error lain, batalkan semua
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat checkout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}