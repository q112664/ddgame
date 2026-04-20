<?php

use App\Http\Controllers\ResourceFavoriteController;
use App\Models\Resource;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/**
 * @return array<string, mixed>
 */
$serializeResource = fn (Resource $resource): array => [
    'slug' => $resource->slug,
    'thumbnail' => $resource->thumbnail_url,
    'title' => $resource->title,
    'subtitle' => $resource->subtitle,
    'categories' => $resource->categories
        ->map(fn ($category): array => [
            'name' => $category->name,
            'color' => $category->color?->value ?? 'sky',
        ])
        ->values()
        ->all(),
    'tags' => $resource->tags->pluck('name')->values()->all(),
    'author' => $resource->author?->name ?? '未知作者',
    'authorAvatar' => $resource->author?->avatar,
    'publishedAt' => $resource->published_at?->toIso8601String(),
];

/**
 * @return array<string, mixed>
 */
$serializeResourceDetails = fn (Resource $resource): array => [
    ...$serializeResource($resource),
    'content' => $resource->content,
    'viewCount' => $resource->view_count,
    'favoriteCount' => $resource->favorited_by_users_count ?? $resource->favoritedByUsers()->count(),
    'favoritedByCurrentUser' => (bool) ($resource->is_favorited_by_current_user ?? false),
];

Route::get('/', fn () => Inertia::render('home', [
    'canRegister' => Features::enabled(Features::registration()),
    'resources' => Resource::query()
        ->with(['categories', 'author', 'tags'])
        ->latest('published_at')
        ->get()
        ->map($serializeResource)
        ->all(),
]))->name('home');

$renderResource = function (string $slug, string $section = 'details') use ($serializeResourceDetails) {
    $resource = Resource::query()
        ->with(['categories', 'author', 'tags'])
        ->withCount('favoritedByUsers')
        ->when(
            request()->user(),
            fn ($query, $user) => $query->withExists([
                'favoritedByUsers as is_favorited_by_current_user' => fn ($favoriteQuery) => $favoriteQuery->whereKey($user->getKey()),
            ]),
            fn ($query) => $query->selectRaw('false as is_favorited_by_current_user'),
        )
        ->where('slug', $slug)
        ->first();

    $resource?->incrementViewCount();

    return Inertia::render('resources/show', [
        'resource' => $resource ? $serializeResourceDetails($resource) : null,
        'slug' => $slug,
        'section' => $section,
    ]);
};

Route::get('/resources/{slug}', fn (string $slug) => $renderResource($slug))
    ->name('resources.show');
Route::get('/resources/{slug}/downloads', fn (string $slug) => $renderResource($slug, 'downloads'))
    ->name('resources.downloads');
Route::get('/resources/{slug}/screenshots', fn (string $slug) => $renderResource($slug, 'screenshots'))
    ->name('resources.screenshots');
Route::get('/resources/{slug}/discussion', fn (string $slug) => $renderResource($slug, 'discussion'))
    ->name('resources.discussion');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => to_route('profile.edit'))->name('dashboard');
    Route::post('/resources/{resource}/favorite', ResourceFavoriteController::class)
        ->name('resources.favorite');
});

require __DIR__.'/settings.php';
