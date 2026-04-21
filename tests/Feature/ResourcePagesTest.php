<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use App\Support\ResourceCategoryColor;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the lightweight homepage shell', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('auth.user', null)
            ->where('sidebarOpen', true)
            ->missing('resources')
        );
});

it('renders the resource index page from backend resources in publish order', function () {
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

    $olderResource = Resource::query()->create([
        'title' => '较早资源',
        'thumbnail_path' => 'https://example.com/older-cover.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-08 12:00:00',
    ])->refresh();
    $newerResource = Resource::query()->create([
        'title' => '最新资源',
        'thumbnail_path' => 'https://example.com/newer-cover.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 12:00:00',
    ])->refresh();
    $tagOne = Tag::query()->create(['name' => '标签一', 'slug' => 'tag-one']);
    $tagTwo = Tag::query()->create(['name' => '标签二', 'slug' => 'tag-two']);
    $olderResource->categories()->sync([$category->id]);
    $olderResource->tags()->sync([$tagOne->id]);
    $newerResource->categories()->sync([$category->id, $secondaryCategory->id]);
    $newerResource->tags()->sync([$tagOne->id, $tagTwo->id]);

    $this->get(route('resources.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/index')
            ->where('auth.user', null)
            ->where('sidebarOpen', true)
            ->has('resources', 2)
            ->where('resources.0.slug', $newerResource->slug)
            ->where('resources.0.title', $newerResource->title)
            ->where('resources.0.categories.0.name', $category->name)
            ->where('resources.0.categories.0.color', $category->color->value)
            ->where('resources.0.categories.1.name', $secondaryCategory->name)
            ->where('resources.0.author', $author->name)
            ->where('resources.0.authorAvatar', null)
            ->where('resources.0.tags.0', '标签一')
            ->where('resources.1.slug', $olderResource->slug)
        );
});

it('renders a category page with only resources from that category', function () {
    $primaryCategory = ResourceCategory::query()->create([
        'name' => '本月新作',
        'slug' => 'monthly-new',
        'color' => ResourceCategoryColor::Sky,
        'sort_order' => 1,
    ]);
    $secondaryCategory = ResourceCategory::query()->create([
        'name' => '站长推荐',
        'slug' => 'editor-picks',
        'color' => ResourceCategoryColor::Rose,
        'sort_order' => 2,
    ]);
    $author = User::query()->create([
        'name' => '分类作者',
        'email' => 'category-author@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $categoryOnlyResource = Resource::query()->create([
        'title' => '分类专属资源',
        'thumbnail_path' => 'https://example.com/category-only.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 10:00:00',
    ])->refresh();
    $sharedResource = Resource::query()->create([
        'title' => '共享分类资源',
        'thumbnail_path' => 'https://example.com/shared.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 11:00:00',
    ])->refresh();
    $otherResource = Resource::query()->create([
        'title' => '其它分类资源',
        'thumbnail_path' => 'https://example.com/other.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 12:00:00',
    ])->refresh();

    $categoryOnlyResource->categories()->sync([$primaryCategory->id]);
    $sharedResource->categories()->sync([$primaryCategory->id, $secondaryCategory->id]);
    $otherResource->categories()->sync([$secondaryCategory->id]);

    $this->get(route('categories.show', ['category' => $primaryCategory->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/show')
            ->where('category.name', $primaryCategory->name)
            ->where('category.slug', $primaryCategory->slug)
            ->where('category.color', $primaryCategory->color->value)
            ->where('category.resourceCount', 2)
            ->has('resources', 2)
            ->where('resources.0.slug', $sharedResource->slug)
            ->where('resources.1.slug', $categoryOnlyResource->slug)
        );
});

it('renders an empty category page when the category has no resources', function () {
    $category = ResourceCategory::query()->create([
        'name' => '空分类',
        'slug' => 'empty-category',
        'color' => ResourceCategoryColor::Slate,
        'sort_order' => 1,
    ]);

    $this->get(route('categories.show', ['category' => $category->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/show')
            ->where('category.name', $category->name)
            ->where('category.resourceCount', 0)
            ->has('resources', 0)
        );
});

it('returns a 404 for a missing category slug', function () {
    $this->get(route('categories.show', ['category' => 'missing-category']))
        ->assertNotFound();
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
        'subtitle' => '这是一个更轻量的资源副标题。',
        'thumbnail_path' => 'https://example.com/show.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-08 08:30:00',
        'content' => '<p>这里是后台填写的资源详情。</p>',
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
            ->where('resource.subtitle', '这是一个更轻量的资源副标题。')
            ->where('resource.thumbnail', 'https://example.com/show.jpg')
            ->where('resource.categories.0.name', $category->name)
            ->where('resource.categories.1.name', $secondaryCategory->name)
            ->where('resource.author', $author->name)
            ->where('resource.authorAvatar', null)
            ->where('resource.tags.1', '汉化')
            ->where('resource.content', '<p>这里是后台填写的资源详情。</p>')
            ->where('resource.viewCount', 1)
            ->where('resource.favoriteCount', 0)
            ->where('resource.favoritedByCurrentUser', false)
            ->where('section', 'details')
        );

    expect($resource->fresh()->view_count)->toBe(1);
});
