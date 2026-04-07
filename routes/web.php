<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => to_route('profile.edit'))->name('dashboard');
});

require __DIR__.'/settings.php';
