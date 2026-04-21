<?php

use App\Http\Controllers\ResourceCategoryPageController;
use App\Http\Controllers\ResourceFavoriteController;
use App\Http\Controllers\ResourcePageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');

Route::get('/resources', [ResourcePageController::class, 'index'])
    ->name('resources.index');

Route::controller(ResourcePageController::class)->group(function () {
    Route::get('/resources/{slug}', 'show')->name('resources.show');
    Route::get('/resources/{slug}/downloads', 'downloads')->name('resources.downloads');
    Route::get('/resources/{slug}/screenshots', 'screenshots')->name('resources.screenshots');
    Route::get('/resources/{slug}/discussion', 'discussion')->name('resources.discussion');
});

Route::get('/categories/{category:slug}', [ResourceCategoryPageController::class, 'show'])
    ->name('categories.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => to_route('profile.edit'))->name('dashboard');
    Route::post('/resources/{resource}/favorite', ResourceFavoriteController::class)
        ->name('resources.favorite');
});

require __DIR__.'/settings.php';
