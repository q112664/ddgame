<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use App\Support\ResourceCategoryColor;
use Inertia\Testing\AssertableInertia as Assert;

it('renders homepage cards from backend resources', function () {
    $category = ResourceCategory::query()->create([
        'name' => '测试分类',
        'slug' => 'test-category',
        'color' => ResourceCategoryColor::Rose,
        'sort_order' => 1,
    ]);
    $secondaryCategory = ResourceCategory::query()->create([
        'name' => '专题推荐',
        'slug' => 'featured-topics',
        'color' => ResourceCategoryColor::Sky,
        'sort_order' => 2,
    ]);
    $author = User::query()->create([
        'name' => '测试作者',
        'email' => 'author@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '测试资源',
        'thumbnail_path' => 'https://example.com/cover.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-08 12:00:00',
    ])->refresh();
    $tagOne = Tag::query()->create(['name' => '标签一', 'slug' => 'tag-one']);
    $tagTwo = Tag::query()->create(['name' => '标签二', 'slug' => 'tag-two']);
    $resource->categories()->sync([$category->id, $secondaryCategory->id]);
    $resource->tags()->sync([$tagOne->id, $tagTwo->id]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('resources', 1)
            ->where('resources.0.slug', $resource->slug)
            ->where('resources.0.title', $resource->title)
            ->where('resources.0.categories.0.name', $category->name)
            ->where('resources.0.categories.0.color', $category->color->value)
            ->where('resources.0.categories.1.name', $secondaryCategory->name)
            ->where('resources.0.author', $author->name)
            ->where('resources.0.authorAvatar', null)
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
    $secondaryCategory = ResourceCategory::query()->create([
        'name' => '站长推荐',
        'slug' => 'editor-picks',
        'color' => ResourceCategoryColor::Rose,
        'sort_order' => 2,
    ]);
    $author = User::query()->create([
        'name' => '后台作者',
        'email' => 'show-author@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '后台资源详情',
        'thumbnail_path' => 'https://example.com/show.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-08 08:30:00',
    ])->refresh();
    $tagOne = Tag::query()->create(['name' => 'Galgame', 'slug' => 'galgame']);
    $tagTwo = Tag::query()->create(['name' => '汉化', 'slug' => 'hanhua']);
    $resource->categories()->sync([$category->id, $secondaryCategory->id]);
    $resource->tags()->sync([$tagOne->id, $tagTwo->id]);

    $this->get(route('resources.show', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('slug', $resource->slug)
            ->where('resource.slug', $resource->slug)
            ->where('resource.title', $resource->title)
            ->where('resource.categories.0.name', $category->name)
            ->where('resource.categories.1.name', $secondaryCategory->name)
            ->where('resource.author', $author->name)
            ->where('resource.authorAvatar', null)
            ->where('resource.tags.1', '汉化')
            ->where('section', 'details')
        );
});
