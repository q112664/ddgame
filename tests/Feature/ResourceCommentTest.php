<?php

use App\Models\Comment;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createCommentableResource(): Resource
{
    $category = ResourceCategory::query()->create([
        'name' => '评论测试分类',
        'slug' => 'comment-test-category',
        'sort_order' => 1,
    ]);
    $author = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $resource = Resource::query()->create([
        'title' => '可评论资源',
        'thumbnail_path' => 'https://example.com/commentable-cover.jpg',
        'user_id' => $author->id,
        'published_at' => now(),
    ])->refresh();

    $resource->categories()->sync([$category->id]);

    return $resource;
}

it('shares floor replies without nesting replies recursively on the resource discussion page', function () {
    $resource = createCommentableResource();
    $commenter = User::factory()->create(['name' => '评论用户']);
    $replier = User::factory()->create(['name' => '回复用户']);
    $nestedReplier = User::factory()->create(['name' => '楼中楼用户']);

    $comment = $resource->comments()->create([
        'user_id' => $commenter->id,
        'body' => '这是第一条真实评论。',
        'created_at' => now()->subMinutes(5),
        'updated_at' => now()->subMinutes(5),
    ]);
    $reply = $resource->comments()->create([
        'user_id' => $replier->id,
        'parent_id' => $comment->id,
        'root_id' => $comment->id,
        'body' => '这是第一条真实回复。',
        'created_at' => now()->subMinutes(3),
        'updated_at' => now()->subMinutes(3),
    ]);
    $nestedReply = $resource->comments()->create([
        'user_id' => $nestedReplier->id,
        'parent_id' => $reply->id,
        'root_id' => $comment->id,
        'body' => '这是回复楼中楼后的平铺回复。',
        'created_at' => now()->subMinute(),
        'updated_at' => now()->subMinute(),
    ]);
    $comment->likedByUsers()->attach($replier);

    $this->get(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/show')
            ->where('section', 'discussion')
            ->where('resource.commentCount', 3)
            ->has('resource.comments', 1)
            ->where('resource.comments.0.id', $comment->id)
            ->where('resource.comments.0.body', '这是第一条真实评论。')
            ->where('resource.comments.0.author.name', '评论用户')
            ->where('resource.comments.0.likeCount', 1)
            ->where('resource.comments.0.likedByCurrentUser', false)
            ->where('resource.comments.0.replyCount', 2)
            ->has('resource.comments.0.replies', 2)
            ->where('resource.comments.0.replies.0.id', $reply->id)
            ->where('resource.comments.0.replies.0.body', '这是第一条真实回复。')
            ->where('resource.comments.0.replies.0.replyTo', '评论用户')
            ->where('resource.comments.0.replies.0.replyCount', 0)
            ->where('resource.comments.0.replies.0.replies', [])
            ->where('resource.comments.0.replies.1.id', $nestedReply->id)
            ->where('resource.comments.0.replies.1.body', '这是回复楼中楼后的平铺回复。')
            ->where('resource.comments.0.replies.1.replyTo', '回复用户')
            ->where('resource.comments.0.replies.1.replyCount', 0)
            ->where('resource.comments.0.replies.1.replies', [])
        );
});

it('creates a top level resource comment for authenticated users', function () {
    $resource = createCommentableResource();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('resources.discussion', ['slug' => $resource->slug]))
        ->post(route('resources.comments.store', $resource), [
            'body' => '  这是一条新评论。  ',
        ])
        ->assertRedirect(route('resources.discussion', ['slug' => $resource->slug]));

    $comment = Comment::query()->firstOrFail();

    expect($comment->body)
        ->toBe('这是一条新评论。')
        ->and($comment->user_id)
        ->toBe($user->id)
        ->and($comment->commentable_type)
        ->toBe($resource->getMorphClass())
        ->and($comment->commentable_id)
        ->toBe($resource->id)
        ->and($comment->parent_id)
        ->toBeNull()
        ->and($comment->root_id)
        ->toBeNull();
});

it('creates floor replies and keeps the root comment stable when replying to a reply', function () {
    $resource = createCommentableResource();
    $user = User::factory()->create();
    $root = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '根评论',
    ]);
    $firstReply = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'parent_id' => $root->id,
        'root_id' => $root->id,
        'body' => '第一层回复',
    ]);

    $this->actingAs($user)
        ->from(route('resources.discussion', ['slug' => $resource->slug]))
        ->post(route('comments.replies.store', $firstReply), [
            'body' => '第二层回复',
        ])
        ->assertRedirect(route('resources.discussion', ['slug' => $resource->slug]));

    $nestedReply = Comment::query()
        ->where('body', '第二层回复')
        ->firstOrFail();

    expect($nestedReply->parent_id)
        ->toBe($firstReply->id)
        ->and($nestedReply->root_id)
        ->toBe($root->id)
        ->and($nestedReply->commentable_type)
        ->toBe($resource->getMorphClass())
        ->and($nestedReply->commentable_id)
        ->toBe($resource->id);
});

it('requires authentication before creating comments replies or likes', function (string $routeName) {
    $resource = createCommentableResource();
    $comment = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '需要登录互动',
    ]);

    $targetRoute = match ($routeName) {
        'resources.comments.store' => route($routeName, $resource),
        'comments.replies.store', 'comments.like' => route($routeName, $comment),
    };

    $payload = $routeName === 'comments.like'
        ? ['liked' => true]
        : ['body' => '游客提交内容'];

    $this->post($targetRoute, $payload)
        ->assertRedirect(route('login'));
})->with([
    'comment' => 'resources.comments.store',
    'reply' => 'comments.replies.store',
    'like' => 'comments.like',
]);

it('validates comment and reply bodies', function (string $routeName) {
    $resource = createCommentableResource();
    $user = User::factory()->create();
    $comment = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '父级评论',
    ]);

    $targetRoute = $routeName === 'resources.comments.store'
        ? route($routeName, $resource)
        : route($routeName, $comment);

    $this->actingAs($user)
        ->from(route('resources.discussion', ['slug' => $resource->slug]))
        ->post($targetRoute, ['body' => '   '])
        ->assertRedirect(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertSessionHasErrors('body');

    $this->actingAs($user)
        ->from(route('resources.discussion', ['slug' => $resource->slug]))
        ->post($targetRoute, ['body' => str_repeat('啊', 501)])
        ->assertRedirect(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertSessionHasErrors('body');
})->with([
    'comment' => 'resources.comments.store',
    'reply' => 'comments.replies.store',
]);

it('sets comment likes idempotently from the requested target state', function () {
    $resource = createCommentableResource();
    $user = User::factory()->create();
    $comment = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '可以点赞的评论',
    ]);

    $this->actingAs($user)->post(route('comments.like', $comment), ['liked' => true]);
    $this->actingAs($user)->post(route('comments.like', $comment), ['liked' => true]);

    expect($comment->fresh()->likedByUsers()->whereKey($user->getKey())->count())
        ->toBe(1)
        ->and($comment->fresh()->likedByUsers()->count())
        ->toBe(1);

    $this->actingAs($user)->post(route('comments.like', $comment), ['liked' => false]);
    $this->actingAs($user)->post(route('comments.like', $comment), ['liked' => false]);

    expect($comment->fresh()->likedByUsers()->whereKey($user->getKey())->exists())
        ->toBeFalse()
        ->and($comment->fresh()->likedByUsers()->count())
        ->toBe(0);
});

it('validates the liked field for comment likes', function () {
    $resource = createCommentableResource();
    $user = User::factory()->create();
    $comment = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '校验点赞字段',
    ]);

    $this->actingAs($user)
        ->from(route('resources.discussion', ['slug' => $resource->slug]))
        ->post(route('comments.like', $comment))
        ->assertRedirect(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertSessionHasErrors('liked');
});

it('shares whether the authenticated viewer liked a comment', function () {
    $resource = createCommentableResource();
    $viewer = User::factory()->create();
    $comment = $resource->comments()->create([
        'user_id' => User::factory()->create()->id,
        'body' => '被当前用户点赞',
    ]);
    $comment->likedByUsers()->attach($viewer);

    $this->actingAs($viewer)
        ->get(route('resources.discussion', ['slug' => $resource->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('resource.comments.0.likedByCurrentUser', true)
            ->where('resource.comments.0.likeCount', 1)
        );
});
