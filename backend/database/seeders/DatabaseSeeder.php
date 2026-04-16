<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@pinnacle.com',
            'password' => bcrypt('admin1234'),
            'is_admin' => true,
        ]);

        Product::insert([
            ['name' => 'F-Type Carbon Ceramic Brake Kit', 'brand' => 'Jaguar', 'price' => 3500.00, 'description' => 'High-performance braking system for tracking and street use.', 'stock' => 5, 'year' => '2023', 'model' => 'F-Type'],
            ['name' => 'M Performance Exhaust System', 'brand' => 'BMW', 'price' => 2800.00, 'description' => 'Lightweight titanium exhaust with valve control.', 'stock' => 12, 'year' => '2024', 'model' => 'M4'],
            ['name' => 'Air Suspension Compressor', 'brand' => 'Range Rover', 'price' => 850.00, 'description' => 'OEM replacement compressor for adaptive air ride system.', 'stock' => 8, 'year' => '2022', 'model' => 'Sport'],
            ['name' => 'SVR Carbon Hood', 'brand' => 'Range Rover', 'price' => 4200.00, 'description' => 'Full carbon fiber hood with integrated cooling vents.', 'stock' => 2, 'year' => '2023', 'model' => 'SVR'],
            ['name' => 'Supercharger Pulley Upgrade', 'brand' => 'Jaguar', 'price' => 450.00, 'description' => 'Increases boost pressure by 1.5 psi.', 'stock' => 15, 'year' => '2021', 'model' => 'XJR']
        ]);
    }
}
