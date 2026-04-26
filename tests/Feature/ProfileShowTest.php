<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated users can view their profile summary page', function () {
    $user = User::factory()->create([
        'name' => 'Kirito',
        'email' => 'kirito@example.com',
        'signature' => '愿你也能找到属于自己的星光。',
        'created_at' => now()->subDays(21),
    ]);
    $category = ResourceCategory::query()->create([
        'name' => '动作',
        'slug' => 'dongzuo',
    ]);
    $tag = Tag::query()->create([
        'name' => '热门',
        'slug' => 'hot',
    ]);
    $submittedResource = Resource::query()->create([
        'title' => '我的投稿',
        'slug' => Str::random(7),
        'user_id' => $user->id,
        'thumbnail_path' => 'https://example.com/submission-cover.jpg',
        'published_at' => now()->subDay(),
    ]);
    $submittedResource->categories()->attach($category);
    $submittedResource->tags()->attach($tag);
    $submittedResource->comments()->create([
        'user_id' => $user->id,
        'body' => '我在自己的投稿下留了一条评论。',
    ]);

    $favoritedResource = Resource::query()->create([
        'title' => '我的收藏',
        'slug' => Str::random(7),
        'user_id' => User::factory()->create()->id,
        'thumbnail_path' => 'https://example.com/favorite-cover.jpg',
        'published_at' => now()->subHours(6),
    ]);
    $favoritedResource->categories()->attach($category);
    $favoritedResource->tags()->attach($tag);
    $user->favoriteResources()->attach($favoritedResource);

    $this->actingAs($user)
        ->get(route('users.show', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $user->id)
            ->where('profileUser.name', 'Kirito')
            ->where('profileUser.signature', '愿你也能找到属于自己的星光。')
            ->where('profile.joinedAt', $user->created_at?->toDateString())
            ->where('profile.level', '用户')
            ->where('isOwnProfile', true)
            ->where('activeTab', 'submissions')
            ->where('availableTabs', ['submissions', 'favorites', 'comments'])
            ->where('stats.0.label', '投稿数量')
            ->where('stats.0.value', 1)
            ->where('stats.1.label', '收藏数量')
            ->where('stats.1.value', 1)
            ->where('stats.2.label', '评论数量')
            ->where('stats.2.value', 1)
            ->where('collections.submissions.0.slug', $submittedResource->slug)
            ->where('collections.submissions.0.title', '我的投稿')
            ->where('collections.submissions.0.categories.0.name', '动作')
            ->where('collections.submissions.0.tags.0', '热门')
            ->missing('collections.favorites'),
        );
});

test('guests can view another users public profile page', function () {
    $profileOwner = User::factory()->create([
        'name' => 'Sinon',
        'email' => 'sinon@example.com',
        'signature' => '把每一次瞄准都变成回答。',
        'created_at' => now()->subDays(7),
    ]);
    $category = ResourceCategory::query()->create([
        'name' => '冒险',
        'slug' => 'adventure',
    ]);
    $tag = Tag::query()->create([
        'name' => '推荐',
        'slug' => 'recommended',
    ]);
    $submittedResource = Resource::query()->create([
        'title' => 'Sinon 的投稿',
        'slug' => Str::random(7),
        'user_id' => $profileOwner->id,
        'thumbnail_path' => 'https://example.com/public-profile-submission.jpg',
        'published_at' => now()->subHours(5),
    ]);
    $submittedResource->categories()->attach($category);
    $submittedResource->tags()->attach($tag);
    $submittedResource->comments()->create([
        'user_id' => $profileOwner->id,
        'body' => '公开页只展示评论数量。',
    ]);

    $favoritedResource = Resource::query()->create([
        'title' => 'Sinon 的收藏',
        'slug' => Str::random(7),
        'user_id' => User::factory()->create()->id,
        'thumbnail_path' => 'https://example.com/public-profile-favorite.jpg',
        'published_at' => now()->subHours(4),
    ]);
    $favoritedResource->categories()->attach($category);
    $favoritedResource->tags()->attach($tag);
    $profileOwner->favoriteResources()->attach($favoritedResource);

    $this->get(route('users.show', $profileOwner))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $profileOwner->id)
            ->where('profileUser.name', 'Sinon')
            ->where('profileUser.signature', '把每一次瞄准都变成回答。')
            ->where('profile.joinedAt', $profileOwner->created_at?->toDateString())
            ->where('isOwnProfile', false)
            ->where('activeTab', 'submissions')
            ->where('availableTabs', ['submissions'])
            ->where('stats.0.value', 1)
            ->where('stats.1.value', 1)
            ->where('stats.2.value', 1)
            ->where('collections.submissions.0.slug', $submittedResource->slug)
            ->where('collections.submissions.0.title', 'Sinon 的投稿')
            ->missing('collections.favorites'),
        );
});

test('guests cannot view private profile tabs', function (string $routeName) {
    $profileOwner = User::factory()->create();

    $this->get(route($routeName, $profileOwner))
        ->assertRedirect(route('login'));
})->with([
    'favorites' => 'users.favorites',
    'comments' => 'users.comments',
]);

test('guests can view another users public profile page without private tabs', function () {
    $user = User::factory()->create();

    $this->get(route('users.show', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $user->id)
            ->where('isOwnProfile', false)
            ->where('activeTab', 'submissions')
            ->where('availableTabs', ['submissions'])
            ->missing('collections.favorites')
        );
});

test('authenticated users can view their favorites tab on the unified profile page', function () {
    $user = User::factory()->create();
    $category = ResourceCategory::query()->create([
        'name' => '恋爱',
        'slug' => 'love',
    ]);
    $tag = Tag::query()->create([
        'name' => '新作',
        'slug' => 'new-release',
    ]);
    $favoritedResource = Resource::query()->create([
        'title' => '我的收藏',
        'slug' => Str::random(7),
        'user_id' => User::factory()->create()->id,
        'thumbnail_path' => 'https://example.com/favorites-cover.jpg',
        'published_at' => now()->subHour(),
    ]);
    $favoritedResource->categories()->attach($category);
    $favoritedResource->tags()->attach($tag);
    $user->favoriteResources()->attach($favoritedResource);

    $this->actingAs($user)
        ->get(route('users.favorites', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $user->id)
            ->where('isOwnProfile', true)
            ->where('activeTab', 'favorites')
            ->where('availableTabs', ['submissions', 'favorites', 'comments'])
            ->where('collections.favorites.0.slug', $favoritedResource->slug)
            ->where('collections.favorites.0.title', '我的收藏')
            ->where('collections.favorites.0.categories.0.name', '恋爱')
            ->where('collections.favorites.0.tags.0', '新作')
            ->missing('collections.submissions'),
        );
});

test('authenticated users can view their comments tab on the unified profile page', function () {
    $user = User::factory()->create();
    $resource = Resource::query()->create([
        'title' => '被评论的资源',
        'slug' => Str::random(7),
        'user_id' => User::factory()->create()->id,
        'thumbnail_path' => 'https://example.com/commented-resource.jpg',
        'published_at' => now()->subHour(),
    ]);
    $comment = $resource->comments()->create([
        'user_id' => $user->id,
        'body' => '这条评论会展示在个人页。',
    ]);

    $this->actingAs($user)
        ->get(route('users.comments', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $user->id)
            ->where('isOwnProfile', true)
            ->where('activeTab', 'comments')
            ->where('availableTabs', ['submissions', 'favorites', 'comments'])
            ->where('stats.2.value', 1)
            ->where('collections.comments.0.id', $comment->id)
            ->where('collections.comments.0.body', '这条评论会展示在个人页。')
            ->where('collections.comments.0.resource.slug', $resource->slug)
            ->where('collections.comments.0.resource.title', '被评论的资源')
            ->missing('collections.submissions')
            ->missing('collections.favorites'),
        );
});

test('authenticated users cannot view another users favorites tab', function () {
    $viewer = User::factory()->create();
    $profileOwner = User::factory()->create();

    $this->actingAs($viewer)
        ->get(route('users.favorites', $profileOwner))
        ->assertRedirect(route('users.show', $profileOwner));
});

test('authenticated users cannot view another users comments tab', function () {
    $viewer = User::factory()->create();
    $profileOwner = User::factory()->create();

    $this->actingAs($viewer)
        ->get(route('users.comments', $profileOwner))
        ->assertRedirect(route('users.show', $profileOwner));
});

test('users visiting their own public profile url are redirected to their private profile page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('profile.show'))
        ->assertRedirect(route('users.show', $user));
});

test('users can view their own unified profile page from the users route', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.show', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profileUser.id', $user->id)
            ->where('activeTab', 'submissions')
            ->where('isOwnProfile', true)
            ->where('availableTabs', ['submissions', 'favorites', 'comments']),
        );
});

test('admin users receive the admin level on the profile summary page', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('users.show', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('isOwnProfile', true)
            ->where('activeTab', 'submissions')
            ->where('availableTabs', ['submissions', 'favorites', 'comments'])
            ->where('profile.level', '管理员')
            ->where('stats.0.label', '投稿数量')
            ->where('stats.1.label', '收藏数量')
            ->where('stats.2.label', '评论数量'),
        );
});
