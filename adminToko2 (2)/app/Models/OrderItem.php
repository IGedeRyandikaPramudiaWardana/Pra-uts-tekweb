<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    /**
     * Bidang yang boleh diisi secara massal.
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
    ];

    // (Anda bisa tambahkan relasi di sini jika perlu)
    // public function product()
    // {
    //     return $this->belongsTo(Product::class, 'product_id', 'product_id');
    // }
}