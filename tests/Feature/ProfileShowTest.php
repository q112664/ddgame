<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated users can view their profile summary page', function () {
    $user = User::factory()->create([
        'name' => 'Kirito',
        'email' => 'kirito@example.com',
        'created_at' => now()->subDays(21),
    ]);

    $this->actingAs($user)
        ->get(route('profile.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('auth.user.name', 'Kirito')
            ->where('auth.user.email', 'kirito@example.com')
            ->where('profile.joinedAt', $user->created_at?->toDateString())
            ->where('profile.level', '用户')
            ->where('stats.0.label', '投稿数量')
            ->where('stats.0.value', 0)
            ->where('stats.1.label', '收藏数量')
            ->where('stats.1.value', 0),
        );
});

test('admin users receive the admin level on the profile summary page', function () {
    $user = User::factory()->create([
        'email' => 'admin@admin.com',
    ]);

    $this->actingAs($user)
        ->get(route('profile.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/show')
            ->where('profile.level', '管理员')
            ->where('stats.0.label', '投稿数量')
            ->where('stats.1.label', '收藏数量'),
        );
});
