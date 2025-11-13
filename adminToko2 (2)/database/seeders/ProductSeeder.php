<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('products')->insert([ 
            [ 
                'name' => 'Laptop Gaming ROG', 
                'slug' => Str::slug('Laptop Gaming ROG'), 
                'description' => 'Laptop gaming high performance dengan RTX 4060', 
                'category_id' => 1, // Elektronik 
                'price' => 25000000, 
                'img' => 'D:\Teknologi Web\laravel12\test laravel\adminToko2\storage\app\public\products\laptop rog.jpg', 
                'stock' => 10, 
                'created_at' => now(), 
                'updated_at' => now(), 
            ], 
        ]);
    }
}
