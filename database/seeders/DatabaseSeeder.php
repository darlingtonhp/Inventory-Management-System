<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\Report;
use App\Models\Transaction;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@user.com',
            'password' => bcrypt('Test123*'),
            'email_verified_at' => time()
        ]);

        Product::factory()
            ->count(30)
            ->create()
            ->each(function ($product) {
                $product->transactions()->saveMany(Transaction::factory()->count(30)->make());
            });

        Order::factory()
            ->count(20)
            ->create();

        Warehouse::factory()
            ->count(5)
            ->create();

        Report::factory()
            ->count(5)
            ->create();
    }
}
