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
            ->has('resources.data', 2)
            ->where('resources.data.0.slug', $newerResource->slug)
            ->where('resources.data.0.title', $newerResource->title)
            ->where('resources.data.0.categories.0.name', $category->name)
            ->where('resources.data.0.categories.0.color', $category->color->value)
            ->where('resources.data.0.categories.1.name', $secondaryCategory->name)
            ->where('resources.data.0.author', $author->name)
            ->where('resources.data.0.authorAvatar', null)
            ->where('resources.data.0.tags.0', '标签一')
            ->where('resources.data.1.slug', $olderResource->slug)
        );
});

it('filters the resource index page by category query parameter', function () {
    $primaryCategory = ResourceCategory::query()->create([
        'name' => 'PC游戏',
        'slug' => 'pc-games',
        'sort_order' => 1,
    ]);
    $secondaryCategory = ResourceCategory::query()->create([
        'name' => '手机游戏',
        'slug' => 'mobile-games',
        'sort_order' => 2,
    ]);
    $author = User::factory()->create();

    $includedResource = Resource::query()->create([
        'title' => 'PC 专属资源',
        'thumbnail_path' => 'https://example.com/pc.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 12:00:00',
    ])->refresh();
    $excludedResource = Resource::query()->create([
        'title' => '移动端资源',
        'thumbnail_path' => 'https://example.com/mobile.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-10 12:00:00',
    ])->refresh();

    $includedResource->categories()->sync([$primaryCategory->id]);
    $excludedResource->categories()->sync([$secondaryCategory->id]);

    $this->get(route('resources.index', ['category' => $primaryCategory->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/index')
            ->where('filters.category', $primaryCategory->slug)
            ->where('filters.sort', 'latest')
            ->where('filterOptions.categories.0.label', '全部')
            ->where('filterOptions.categories.0.value', '')
            ->where('filterOptions.categories.1.label', $primaryCategory->name)
            ->has('resources.data', 1)
            ->where('resources.data.0.slug', $includedResource->slug)
        );
});

it('sorts the resource index page by query parameter', function () {
    $author = User::factory()->create();

    $olderResource = Resource::query()->create([
        'title' => '较早发布',
        'thumbnail_path' => 'https://example.com/older-sort.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-08 12:00:00',
        'view_count' => 500,
    ])->refresh();
    $newerResource = Resource::query()->create([
        'title' => '较晚发布',
        'thumbnail_path' => 'https://example.com/newer-sort.jpg',
        'user_id' => $author->id,
        'published_at' => '2026-04-09 12:00:00',
        'view_count' => 10,
    ])->refresh();

    $this->get(route('resources.index', ['sort' => 'oldest']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'oldest')
            ->where('resources.data.0.slug', $olderResource->slug)
            ->where('resources.data.1.slug', $newerResource->slug)
        );

    $this->get(route('resources.index', ['sort' => 'views']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'views')
            ->where('resources.data.0.slug', $olderResource->slug)
            ->where('resources.data.1.slug', $newerResource->slug)
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
            ->has('resources.data', 2)
            ->where('resources.data.0.slug', $sharedResource->slug)
            ->where('resources.data.1.slug', $categoryOnlyResource->slug)
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
            ->has('resources.data', 0)
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
            ->where('resource.commentCount', 0)
            ->where('resource.comments', [])
            ->where('section', 'details')
        );

    expect($resource->fresh()->view_count)->toBe(1);
});

it('sanitizes resource detail content before sharing it with the frontend', function () {
    $author = User::query()->create([
        'name' => '安全作者',
        'email' => 'safe-content-author@example.com',
        'password' => 'password',
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '安全详情资源',
        'thumbnail_path' => 'https://example.com/safe-content.jpg',
        'user_id' => $author->id,
        'content' => '<p onclick="alert(1)">安全内容</p><script>alert(1)</script><a href="javascript:alert(1)">危险链接</a>',
    ])->refresh();

    $this->get(route('resources.show', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('resource.content', '<p>安全内容</p><a>危险链接</a>')
        );
});
