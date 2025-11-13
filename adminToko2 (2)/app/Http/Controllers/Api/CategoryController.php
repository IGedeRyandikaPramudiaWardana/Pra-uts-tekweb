<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::all();
        // return response()->json([
        //     'status' => true,
        //     'message'=> 'List Kategori',
        //     'data' => Category::all()
        // ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:150',
        ]);

        $category = Category::create([
            'category'=> $request->category,
        ]);

        return response()->json([
            'status' => true,
            'message'=> 'Kategori berhasil ditambahkan',
            'data' => $category
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'category' => 'required|string|max:150',
        ]);

        $category->update($request->all());

        return response()->json([
            'status' => true,
            'message'=> 'Kategori berhasil diupdate',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'status' => true,
            'message'=> 'Kategori berhasil dihapus',
        ]);
    }
}
