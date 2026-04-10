<?php

namespace Database\Seeders;

use App\Models\ResourceCategory;
use App\Support\ResourceCategoryColor;
use Illuminate\Database\Seeder;

class ResourceCategoryPresetSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            ['name' => 'Galgame', 'slug' => 'galgame', 'color' => ResourceCategoryColor::Violet, 'sort_order' => 10],
            ['name' => 'RPG', 'slug' => 'rpg', 'color' => ResourceCategoryColor::Emerald, 'sort_order' => 20],
            ['name' => 'SLG', 'slug' => 'slg', 'color' => ResourceCategoryColor::Amber, 'sort_order' => 30],
            ['name' => 'R18', 'slug' => 'r18', 'color' => ResourceCategoryColor::Rose, 'sort_order' => 40],
            ['name' => '全年龄', 'slug' => 'all-ages', 'color' => ResourceCategoryColor::Sky, 'sort_order' => 50],
            ['name' => '汉化版', 'slug' => 'localized-zh', 'color' => ResourceCategoryColor::Violet, 'sort_order' => 60],
            ['name' => '生肉', 'slug' => 'raw', 'color' => ResourceCategoryColor::Slate, 'sort_order' => 70],
            ['name' => '模拟器', 'slug' => 'emulator', 'color' => ResourceCategoryColor::Amber, 'sort_order' => 80],
            ['name' => 'PC游戏', 'slug' => 'pc-game', 'color' => ResourceCategoryColor::Sky, 'sort_order' => 90],
            ['name' => 'Android', 'slug' => 'android', 'color' => ResourceCategoryColor::Emerald, 'sort_order' => 100],
        ])->each(function (array $category): void {
            ResourceCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        });
    }
}
