<?php

use App\Filament\Resources\Resources\Pages\CreateResource;
use App\Models\Resource;
use App\Models\User;
use Carbon\CarbonInterface;
use Livewire\Livewire;

it('auto sets published_at when a resource is first created', function () {
    $frozenTime = $this->freezeTime();
    $author = User::query()->create([
        'name' => '资源作者',
        'email' => 'resource-author@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '自动发布时间资源',
        'thumbnail_path' => 'https://example.com/cover.jpg',
        'user_id' => $author->id,
    ])->refresh();

    expect($resource->published_at)
        ->toBeInstanceOf(CarbonInterface::class)
        ->and($resource->published_at?->toDateTimeString())
        ->toBe($frozenTime->toDateTimeString());
});

it('preserves the original published_at when an existing resource is edited without changing it', function () {
    $author = User::query()->create([
        'name' => '资源编辑作者',
        'email' => 'resource-editor@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $createdAt = $this->freezeTime();

    $resource = Resource::query()->create([
        'title' => '首次发布时间资源',
        'thumbnail_path' => 'https://example.com/edit.jpg',
        'user_id' => $author->id,
    ])->refresh();

    $this->travel(2)->hours();

    $resource->update([
        'title' => '更新后的资源标题',
        'content' => '<p>更新后的资源详情。</p>',
    ]);

    expect($resource->fresh()->published_at?->toDateTimeString())
        ->toBe($createdAt->toDateTimeString());
});

it('allows published_at to be updated manually after the resource is created', function () {
    $author = User::query()->create([
        'name' => '资源发布时间作者',
        'email' => 'resource-published-at@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '可修改发布时间资源',
        'thumbnail_path' => 'https://example.com/published-at.jpg',
        'user_id' => $author->id,
    ])->refresh();

    $manualPublishedAt = now()->subDays(3)->startOfHour();

    $resource->update([
        'published_at' => $manualPublishedAt,
    ]);

    expect($resource->fresh()->published_at?->toDateTimeString())
        ->toBe($manualPublishedAt->toDateTimeString());
});

it('defaults the resource author to the currently logged-in admin', function () {
    $admin = User::factory()->create([
        'email' => 'admin@admin.com',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($admin);

    Livewire::test(CreateResource::class)
        ->assertSet('data.user_id', $admin->getKey());
});
