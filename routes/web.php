<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

$renderResource = fn (string $id, string $section = 'details') => Inertia::render('resources/show', [
    'id' => $id,
    'section' => $section,
]);

Route::get('/resources/{id}', fn (string $id) => $renderResource($id))
    ->name('resources.show');
Route::get('/resources/{id}/downloads', fn (string $id) => $renderResource($id, 'downloads'))
    ->name('resources.downloads');
Route::get('/resources/{id}/screenshots', fn (string $id) => $renderResource($id, 'screenshots'))
    ->name('resources.screenshots');
Route::get('/resources/{id}/discussion', fn (string $id) => $renderResource($id, 'discussion'))
    ->name('resources.discussion');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => to_route('profile.edit'))->name('dashboard');
});

require __DIR__.'/settings.php';
