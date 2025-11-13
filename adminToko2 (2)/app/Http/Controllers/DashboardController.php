<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Product;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
     public function admin() 
    {
        $user = Auth::user();
        $products = Product::all();
        return view('adminLayout.adminPage', compact('user', 'products'));
    }

    public function user() 
    {
        $user = Auth::user();
        return view('frontpages.dashboard', compact('user'));
    }
}
