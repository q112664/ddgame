<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Support\ResourceCategoryColor;
use Inertia\Testing\AssertableInertia as Assert;

it('renders homepage cards from backend resources', function () {
    $category = ResourceCategory::query()->create([
        'name' => '测试分类',
        'slug' => 'test-category',
        'color' => ResourceCategoryColor::Rose,
        'sort_order' => 1,
    ]);

    $resource = Resource::query()->create([
        'title' => '测试资源',
        'slug' => 'test-resource',
        'thumbnail_path' => 'https://example.com/cover.jpg',
        'resource_category_id' => $category->id,
        'tags' => ['标签一', '标签二'],
        'author_name' => '测试作者',
        'published_at' => '2026-04-08 12:00:00',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('resources', 1)
            ->where('resources.0.slug', $resource->slug)
            ->where('resources.0.title', $resource->title)
            ->where('resources.0.category', $category->name)
            ->where('resources.0.categoryColor', $category->color->value)
            ->where('resources.0.author', $resource->author_name)
            ->where('resources.0.tags.0', '标签一')
        );
});

it('renders the resource page header from backend resources', function () {
    $category = ResourceCategory::query()->create([
        'name' => '最近更新',
        'slug' => 'recent-updates',
        'color' => ResourceCategoryColor::Emerald,
        'sort_order' => 1,
    ]);

    $resource = Resource::query()->create([
        'title' => '后台资源详情',
        'slug' => 'backend-resource-show',
        'thumbnail_path' => 'https://example.com/show.jpg',
        'resource_category_id' => $category->id,
        'tags' => ['Galgame', '汉化'],
        'author_name' => '后台作者',
        'published_at' => '2026-04-08 08:30:00',
    ]);

    $this->get(route('resources.show', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('slug', $resource->slug)
            ->where('resource.slug', $resource->slug)
            ->where('resource.title', $resource->title)
            ->where('resource.category', $category->name)
            ->where('resource.categoryColor', $category->color->value)
            ->where('resource.author', $resource->author_name)
            ->where('resource.tags.1', '汉化')
            ->where('section', 'details')
        );
});
