<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's public profile summary page.
     */
    public function show(Request $request): RedirectResponse
    {
        return to_route('users.show', $request->user());
    }

    /**
     * Show a user's profile page.
     */
    public function showPublic(Request $request, User $user): Response
    {
        $isOwnProfile = $request->user()->is($user);
        $profileUser = $this->loadProfileUser($user, $isOwnProfile);

        return Inertia::render('profile/show', $this->buildProfilePayload($profileUser, $isOwnProfile));
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->safe()->except('avatar'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar')) {
            $this->replaceAvatar($user, $request);
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $this->deleteAvatar($user);
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Replace the stored avatar for the given user.
     */
    private function replaceAvatar(User $user, ProfileUpdateRequest $request): void
    {
        $this->deleteAvatar($user);

        $user->avatar_path = $request->file('avatar')?->store('avatars', 'public');
    }

    /**
     * Delete the stored avatar file when present.
     */
    private function deleteAvatar(User $user): void
    {
        $avatarPath = $user->getRawOriginal('avatar_path');

        if (! is_string($avatarPath) || $avatarPath === '') {
            return;
        }

        Storage::disk('public')->delete($avatarPath);
    }

    private function loadProfileUser(User $user, bool $loadFavoriteResources): User
    {
        $user->loadCount([
            'submittedResources',
            'favoriteResources',
        ])->load([
            'submittedResources' => fn ($query) => $query
                ->with(['categories', 'author', 'tags'])
                ->latest('published_at'),
        ]);

        if ($loadFavoriteResources) {
            $user->load([
                'favoriteResources' => fn ($query) => $query
                    ->with(['categories', 'author', 'tags'])
                    ->latest('resource_user_like.created_at'),
            ]);
        }

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    private function buildProfilePayload(User $user, bool $isOwnProfile): array
    {
        $collections = [
            'submissions' => $user->submittedResources
                ->map(fn (Resource $resource): array => $this->serializeResource($resource))
                ->values()
                ->all(),
        ];

        if ($isOwnProfile) {
            $collections['favorites'] = $user->favoriteResources
                ->map(fn (Resource $resource): array => $this->serializeResource($resource))
                ->values()
                ->all();
        }

        return [
            'profileUser' => [
                'id' => $user->getKey(),
                'name' => $user->name,
                'avatar' => $user->avatar,
                'signature' => $user->signature,
            ],
            'profile' => [
                'joinedAt' => $user->created_at?->toDateString(),
                'level' => strtolower((string) $user->email) === 'admin@admin.com'
                    ? '管理员'
                    : '用户',
            ],
            'stats' => [
                [
                    'label' => '投稿数量',
                    'value' => $user->submitted_resources_count ?? 0,
                ],
                [
                    'label' => '收藏数量',
                    'value' => $user->favorite_resources_count ?? 0,
                ],
                [
                    'label' => '评论数量',
                    'value' => 0,
                ],
            ],
            'collections' => $collections,
            'availableTabs' => $isOwnProfile
                ? ['submissions', 'favorites', 'comments']
                : ['submissions'],
            'isOwnProfile' => $isOwnProfile,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeResource(Resource $resource): array
    {
        return [
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
    }
}
