<?php

use App\Models\Resource;
use Database\Seeders\ResourceDemoSeeder;

it('seeds ten shionlib inspired placeholder resources with required relations', function () {
    $this->seed(ResourceDemoSeeder::class);

    expect(Resource::query()->count())->toBe(10);

    $resource = Resource::query()
        ->with(['categories', 'tags', 'author'])
        ->where('title', '哀鸿：城破十日记')
        ->first();

    expect($resource)->not->toBeNull();
    expect($resource?->subtitle)->toBe('AVG 文字冒险 | 明末求生与悬疑追索')
        ->and($resource?->thumbnail_path)->toStartWith('https://t.shionlib.com/game/9897/cover/')
        ->and($resource?->content)->toContain('十日倒计时')
        ->and($resource?->author?->name)->toBe('Shionlib 示例导入')
        ->and($resource?->categories->pluck('name')->all())->toBe([
            'Galgame',
            '全年龄',
            'PC游戏',
        ])
        ->and($resource?->tags->pluck('name')->all())->toContain('AVG', '历史', '悬疑');
});
