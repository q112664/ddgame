<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('shared inertia props expose a minimal authenticated user payload', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withCookie('sidebar_state', 'false')
        ->get(route('profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/profile')
            ->where('sidebarOpen', false)
            ->where('auth.user', fn ($sharedUser): bool => array_keys($sharedUser->all()) === [
                'id',
                'name',
                'email',
                'avatar',
                'email_verified_at',
            ])
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', $user->name)
            ->where('auth.user.email', $user->email)
            ->where('auth.user.avatar', null)
            ->where('auth.user.email_verified_at', $user->email_verified_at?->toIso8601String()),
        );
});
