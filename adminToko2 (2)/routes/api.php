<?php

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\ProductReviewController;
use App\Models\Category;
use App\Models\ProductReview;
use App\Http\Controllers\Api\OrderController;
use App\Http\Kernel;

// 🔓 PUBLIC ROUTES (tidak butuh token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::get('/products/{product}/reviews', [ProductReviewController::class,'index']);


// 🔒 PROTECTED ROUTES (butuh token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/products/{product}/reviews', [ProductReviewController::class,'store']);
    Route::delete('/reviews/{review}', [ProductReviewController::class,'destroy']);

    Route::post('/orders', [OrderController::class,'store']);
});

// 🔒 ADMIN PROTECTED ROUTES (Hanya Admin)
Route::middleware('auth:sanctum', \App\Http\Middleware\AdminMiddleware::class)->group(function () {
    
    // === CATEGORIES ===
    // (create)
    Route::post('/categories', [CategoryController::class, 'store']);
    // (update) - PUT/PATCH tidak masalah karena tidak ada file upload
    Route::put('/categories/{category}', [CategoryController::class, 'update']); 
    // (delete)
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // === PRODUCTS ===
    // (create)
    Route::post('/products', [ProductController::class, 'store']);
    // (delete)
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    
    // ** PERBAIKAN: Gunakan POST untuk update agar file upload (FormData) berfungsi **
    // (update)
    Route::post('/products/{product}', [ProductController::class, 'update']);

    // Baris 'apiResource' yang lama kita hapus karena sudah diganti manual di atas
    // Route::apiResource('products', ProductController::class)->except('index', 'show');
    // Route::apiResource('categories', CategoryController::class)->except('index','show');
});