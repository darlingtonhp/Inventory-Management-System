<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quantity' => fake()->numberBetween(1, 50),
            'type' => fake()->randomElement(['purchase', 'sale', 'adjustment']),
            'product_id' => 1,
            'created_at' => time(),
            'updated_at' => time()
        ];
    }
}
