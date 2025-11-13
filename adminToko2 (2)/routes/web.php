<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function (){
    return view('auth.login');
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'login' => 'required|string',
        'password' => 'required|string',
    ]);

    $loginType = filter_var(request('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'name';
    
    $credentials = [
        $loginType => request('login'),
        'password' => request('password'),
    ];

    if (Auth::attempt($credentials)){
        $user = Auth::user();

        if ($user->role === 'admin'){
            return redirect('/adminPage');
        } else {
            return redirect('/dashboard');
        }
    }

    return back()->withErrors([
        'login' => 'Username/Email atau password salah.',
    ]);

})->name('login.submit');

Route::get('/adminPage', [DashboardController::class, 'admin'])
    ->middleware('auth')
    ->name('admin.dashboard');

Route::get('/dashboard', [DashboardController::class, 'user'])
    ->middleware('auth')
    ->name('user.dashboard');

Route::get('/logout', function () {
    Auth::logout(); // hapus session
    return redirect('/login'); // kembali ke halaman login
})->name('logout');


// Halaman Admin Produk (menampilkan semua produk)
// Route::get('/adminPage', [ProductController::class, 'adminPage'])
// ->name('admin.page');


