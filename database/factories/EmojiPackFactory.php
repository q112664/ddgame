<?php

namespace Database\Factories;

use App\Models\EmojiPack;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmojiPack>
 */
class EmojiPackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'sort_order' => fake()->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
