<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use App\Support\ResourceCategoryColor;
use Inertia\Testing\AssertableInertia as Assert;

function createFavoritableResource(): Resource
{
    $category = ResourceCategory::query()->create([
        'name' => '收藏测试分类',
        'slug' => 'favorite-test-category',
        'color' => ResourceCategoryColor::Sky,
        'sort_order' => 1,
    ]);
    $author = User::factory()->create([
        'email' => 'favorite-resource-author@example.com',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '可收藏资源',
        'thumbnail_path' => 'https://example.com/favorite-cover.jpg',
        'user_id' => $author->id,
        'published_at' => now(),
    ])->refresh();

    $resource->categories()->sync([$category->id]);

    return $resource;
}

it('creates a favorite when an authenticated user favorites a resource', function () {
    $resource = createFavoritableResource();
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('resources.favorite', $resource))
        ->assertRedirect();

    expect($resource->fresh()->favoritedByUsers()->whereKey($user->getKey())->exists())
        ->toBeTrue()
        ->and($resource->fresh()->favoritedByUsers()->count())
        ->toBe(1);
});

it('removes a favorite when an authenticated user toggles it again', function () {
    $resource = createFavoritableResource();
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $resource->favoritedByUsers()->attach($user->getKey());

    $this->actingAs($user)
        ->post(route('resources.favorite', $resource))
        ->assertRedirect();

    expect($resource->fresh()->favoritedByUsers()->whereKey($user->getKey())->exists())
        ->toBeFalse()
        ->and($resource->fresh()->favoritedByUsers()->count())
        ->toBe(0);
});

it('keeps one favorite record per user and resource', function () {
    $resource = createFavoritableResource();
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)->post(route('resources.favorite', $resource));
    $this->actingAs($user)->post(route('resources.favorite', $resource));
    $this->actingAs($user)->post(route('resources.favorite', $resource));

    expect($resource->fresh()->favoritedByUsers()->whereKey($user->getKey())->count())
        ->toBe(1)
        ->and($resource->fresh()->favoritedByUsers()->count())
        ->toBe(1);
});

it('counts favorites from different users correctly', function () {
    $resource = createFavoritableResource();
    $firstUser = User::factory()->create(['email_verified_at' => now()]);
    $secondUser = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($firstUser)->post(route('resources.favorite', $resource));
    $this->actingAs($secondUser)->post(route('resources.favorite', $resource));

    expect($resource->fresh()->favoritedByUsers()->count())->toBe(2);
});

it('rejects unauthenticated favorite requests', function () {
    $resource = createFavoritableResource();

    $this->post(route('resources.favorite', $resource))
        ->assertRedirect(route('login'));
});

it('shares favorite props for the authenticated resource viewer', function () {
    $resource = createFavoritableResource();
    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $otherUser = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $resource->favoritedByUsers()->attach([$viewer->getKey(), $otherUser->getKey()]);

    $this->actingAs($viewer)
        ->get(route('resources.show', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('resource.favoriteCount', 2)
            ->where('resource.favoritedByCurrentUser', true)
        );
});
