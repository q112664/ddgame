<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use App\Support\ResourceCategoryColor;
use Inertia\Testing\AssertableInertia as Assert;

function createViewableResource(): Resource
{
    $category = ResourceCategory::query()->create([
        'name' => '浏览测试分类',
        'slug' => 'view-test-category',
        'color' => ResourceCategoryColor::Sky,
        'sort_order' => 1,
    ]);
    $author = User::factory()->create([
        'email' => 'view-resource-author@example.com',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '可浏览资源',
        'thumbnail_path' => 'https://example.com/view-cover.jpg',
        'user_id' => $author->id,
        'published_at' => now(),
    ])->refresh();

    $resource->categories()->sync([$category->id]);

    return $resource;
}

it('increments the view count when opening the resource details page', function () {
    $resource = createViewableResource();

    $this->get(route('resources.show', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('resource.viewCount', 1)
            ->where('section', 'details')
        );

    expect($resource->fresh()->view_count)->toBe(1);
});

it('increments the view count on non-details resource sections too', function () {
    $resource = createViewableResource();

    $this->get(route('resources.downloads', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('resource.viewCount', 1)
            ->where('section', 'downloads')
        );

    $this->get(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('resource.viewCount', 2)
            ->where('section', 'discussion')
        );

    expect($resource->fresh()->view_count)->toBe(2);
});
