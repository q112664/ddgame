<?php

use App\Models\Resource;
use App\Models\User;

it('auto generates a slug from the resource title', function () {
    $author = User::query()->create([
        'name' => '测试作者',
        'email' => 'resource-slug@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '告别回忆 双想 Break out of my shell',
        'thumbnail_path' => 'https://example.com/cover.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 10:00:00',
    ])->refresh();

    expect($resource->slug)->toMatch('/^[A-Za-z0-9]{7}$/');
});

it('generates a unique short hash slug for each resource', function () {
    $author = User::query()->create([
        'name' => '重复作者',
        'email' => 'resource-slug-duplicate@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $firstResource = Resource::query()->create([
        'title' => 'Test Resource',
        'thumbnail_path' => 'https://example.com/cover-1.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 10:00:00',
    ])->refresh();

    $resource = Resource::query()->create([
        'title' => 'Test Resource',
        'thumbnail_path' => 'https://example.com/cover-2.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 11:00:00',
    ])->refresh();

    expect($firstResource->slug)->toMatch('/^[A-Za-z0-9]{7}$/')
        ->and($resource->slug)->toMatch('/^[A-Za-z0-9]{7}$/')
        ->and($resource->slug)->not->toBe($firstResource->slug);
});
