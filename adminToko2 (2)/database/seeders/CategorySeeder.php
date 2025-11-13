<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([ 
        ['category' => 'Elektronik', 'created_at' => now(), 'updated_at' => now()], 
        ['category' => 'Fashion', 'created_at' => now(), 'updated_at' => now()], 
        ['category' => 'Makanan & Minuman', 'created_at' => now(), 'updated_at' => 
    now()], 
        ['category' => 'Olahraga', 'created_at' => now(), 'updated_at' => now()], 
        ]); 
    }
}
