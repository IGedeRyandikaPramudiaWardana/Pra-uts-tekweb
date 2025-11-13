<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * Bidang yang boleh diisi secara massal.
     */
    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
    ];

    // (Anda bisa tambahkan relasi di sini jika perlu)
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
    //
    // public function items()
    // {
    //     return $this->hasMany(OrderItem::class);
    // }
}