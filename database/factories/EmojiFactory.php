<?php

namespace Database\Factories;

use App\Models\Emoji;
use App\Models\EmojiPack;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Emoji>
 */
class EmojiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'emoji_pack_id' => EmojiPack::factory(),
            'name' => fake()->word(),
            'image_path' => 'emojis/'.fake()->uuid().'.webp',
            'sort_order' => fake()->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
