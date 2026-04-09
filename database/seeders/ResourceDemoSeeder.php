<?php

namespace Database\Seeders;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use App\Support\ResourceCategoryColor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ResourceDemoSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            [
                'name' => '本月新作',
                'slug' => 'monthly-new',
                'color' => ResourceCategoryColor::Sky,
                'sort_order' => 10,
            ],
            [
                'name' => '最近更新',
                'slug' => 'recent-updates',
                'color' => ResourceCategoryColor::Emerald,
                'sort_order' => 20,
            ],
        ])->mapWithKeys(function (array $category): array {
            $record = ResourceCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );

            return [$record->name => $record];
        });

        foreach ($this->resources() as $resource) {
            $author = User::query()->firstOrCreate(
                ['email' => $this->authorEmail($resource['author_name'])],
                [
                    'name' => $resource['author_name'],
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );

            Resource::query()->updateOrCreate(
                ['slug' => $resource['slug']],
                [
                    'title' => $resource['title'],
                    'thumbnail_path' => $resource['thumbnail_path'],
                    'user_id' => $author->id,
                    'published_at' => $resource['published_at'],
                ],
            );

            $resourceRecord = Resource::query()
                ->where('slug', $resource['slug'])
                ->firstOrFail();

            $resourceRecord->categories()->sync(
                collect($resource['categories'])
                    ->filter(fn (mixed $categoryName): bool => is_string($categoryName) && filled($categoryName))
                    ->map(fn (string $categoryName): int => $categories[$categoryName]->id)
                    ->all(),
            );

            $resourceRecord->tags()->sync(
                collect($resource['tags'])
                    ->filter(fn (mixed $tagName): bool => is_string($tagName) && filled($tagName))
                    ->map(fn (string $tagName): int => $this->resolveTag($tagName)->id)
                    ->all(),
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function resources(): array
    {
        return [
            [
                'title' => '告别回忆 双想 Break out of my shell',
                'slug' => 'break-out-of-my-shell',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F10662%2Fcover%2F76ab00d4-c987-4cdf-90a6-041e14f7a1b4.webp&w=3840&q=75',
                'categories' => ['本月新作'],
                'tags' => ['Galgame', '全年龄', 'NTR', 'FD', '校园'],
                'author_name' => 'MAGES.',
                'published_at' => '2026-04-01 09:00:00',
            ],
            [
                'title' => '哀鸿：城破十日记',
                'slug' => 'ten-days-of-the-city-fall',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F9897%2Fcover%2F0573d2f9-334f-4f2a-b2ab-6fdbd3fcca10.webp&w=3840&q=75',
                'categories' => ['本月新作'],
                'tags' => ['Galgame', '游戏', 'AVG', '全年龄'],
                'author_name' => '零创游戏',
                'published_at' => '2026-04-02 09:00:00',
            ],
            [
                'title' => '光翼戦姫エクスティア Marina ～Bright Feather～',
                'slug' => 'bright-feather',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F11103%2Fcover%2Fccadf9f4-906e-4de8-a24b-5794fc58a789.webp&w=3840&q=75',
                'categories' => ['本月新作'],
                'tags' => ['Galgame', '游戏', '拔作', 'AVG'],
                'author_name' => 'Lusterise',
                'published_at' => '2026-04-03 09:00:00',
            ],
            [
                'title' => 'リルカは幾重に夜を彩る',
                'slug' => 'riruka-colors-the-night',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F10817%2Fcover%2Fa7ec62ef-3941-4414-81b9-bddb2c79f547.webp&w=3840&q=75',
                'categories' => ['本月新作'],
                'tags' => ['Galgame', '游戏', 'GAL', '2026'],
                'author_name' => 'シルキーズプラス',
                'published_at' => '2026-04-04 09:00:00',
            ],
            [
                'title' => '誰ソ彼のシェイプシフター',
                'slug' => 'shape-shifter',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F1967%2Fcover%2Fe5d3b430-5dac-432c-a1c0-871fee13d0c0.webp&w=3840&q=75',
                'categories' => ['本月新作'],
                'tags' => ['galgame', '游戏', 'adv', '悬疑'],
                'author_name' => 'Liar-soft',
                'published_at' => '2026-04-05 09:00:00',
            ],
            [
                'title' => '欧尼酱 ConTiNuE！我与结梨的恋爱小秘密',
                'slug' => 'continue-love-secret',
                'thumbnail_path' => 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F1096%2Fcover%2F51f3f4e4-4bb0-4a54-b88b-eb0291215c85.webp&w=3840&q=75',
                'categories' => ['最近更新'],
                'tags' => ['Galgame', 'ADV', '拔作'],
                'author_name' => 'ぱんみみそふと',
                'published_at' => '2026-04-07 09:00:00',
            ],
        ];
    }

    protected function authorEmail(string $authorName): string
    {
        $slug = Str::slug($authorName, '.');

        if (blank($slug)) {
            $slug = 'user.'.substr(md5($authorName), 0, 10);
        }

        return $slug.'@resource.local';
    }

    protected function resolveTag(string $tagName): Tag
    {
        $slug = Str::slug($tagName);

        if (blank($slug)) {
            $slug = 'tag-'.substr(md5($tagName), 0, 10);
        }

        return Tag::query()->firstOrCreate(
            ['slug' => $slug],
            ['name' => $tagName],
        );
    }
}
