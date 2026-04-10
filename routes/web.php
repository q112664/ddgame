<?php

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

Route::get('/', fn () => Inertia::render('home', [
    'canRegister' => Features::enabled(Features::registration()),
    'resources' => Resource::query()
        ->with(['categories', 'author', 'tags'])
        ->latest('published_at')
        ->get()
        ->map($serializeResource)
        ->all(),
]))->name('home');

$renderResource = function (string $slug, string $section = 'details') use ($serializeResource) {
    $resource = Resource::query()
        ->with(['categories', 'author', 'tags'])
        ->where('slug', $slug)
        ->first();

    return Inertia::render('resources/show', [
        'resource' => $resource ? $serializeResource($resource) : null,
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
});

require __DIR__.'/settings.php';
