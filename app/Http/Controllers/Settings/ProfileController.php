<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Comment;
use App\Models\Resource;
use App\Models\User;
use App\Support\FrontendCommentSerializer;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    private const TAB_SUBMISSIONS = 'submissions';

    private const TAB_FAVORITES = 'favorites';

    private const TAB_COMMENTS = 'comments';

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
        return $this->renderProfileTab($request, $user, self::TAB_SUBMISSIONS);
    }

    /**
     * Show a user's favorited resources page.
     */
    public function showFavorites(Request $request, User $user): Response|RedirectResponse
    {
        return $this->renderProfileTab($request, $user, self::TAB_FAVORITES);
    }

    /**
     * Show a user's comments page.
     */
    public function showComments(Request $request, User $user): Response|RedirectResponse
    {
        return $this->renderProfileTab($request, $user, self::TAB_COMMENTS);
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

    private function renderProfileTab(Request $request, User $user, string $activeTab): Response|RedirectResponse
    {
        $isOwnProfile = $request->user()?->is($user) ?? false;

        if (! $this->tabIsAvailable($activeTab, $isOwnProfile)) {
            return to_route('users.show', $user);
        }

        $profileUser = $this->loadProfileUser($user, $activeTab, $isOwnProfile);

        return Inertia::render('profile/show', $this->buildProfilePayload($profileUser, $isOwnProfile, $activeTab));
    }

    private function loadProfileUser(User $user, string $activeTab, bool $isOwnProfile): User
    {
        $user->loadCount([
            'comments',
            'submittedResources',
            'favoriteResources',
        ]);

        if ($activeTab === self::TAB_SUBMISSIONS) {
            $user->load([
                'submittedResources' => fn ($query) => $query
                    ->with(['categories', 'author', 'tags'])
                    ->latest('published_at'),
            ]);
        }

        if ($isOwnProfile && $activeTab === self::TAB_FAVORITES) {
            $user->load([
                'favoriteResources' => fn ($query) => $query
                    ->with(['categories', 'author', 'tags'])
                    ->latest('resource_user_like.created_at'),
            ]);
        }

        if ($isOwnProfile && $activeTab === self::TAB_COMMENTS) {
            $user->load([
                'comments' => fn ($query) => $query
                    ->with([
                        'parent.author',
                        'commentable' => fn (MorphTo $morphTo) => $morphTo->morphWith([
                            Resource::class => ['categories', 'author', 'tags'],
                        ]),
                    ])
                    ->latest()
                    ->limit(50),
            ]);
        }

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    private function buildProfilePayload(User $user, bool $isOwnProfile, string $activeTab): array
    {
        $collections = match ($activeTab) {
            self::TAB_SUBMISSIONS => [
                self::TAB_SUBMISSIONS => $user->submittedResources
                    ->map(fn (Resource $resource): array => $this->serializeResource($resource))
                    ->values()
                    ->all(),
            ],
            self::TAB_FAVORITES => [
                self::TAB_FAVORITES => $user->favoriteResources
                    ->map(fn (Resource $resource): array => $this->serializeResource($resource))
                    ->values()
                    ->all(),
            ],
            self::TAB_COMMENTS => [
                self::TAB_COMMENTS => $user->comments
                    ->map(fn (Comment $comment): array => FrontendCommentSerializer::profileSummary($comment))
                    ->values()
                    ->all(),
            ],
            default => [],
        };

        return [
            'profileUser' => [
                'id' => $user->getKey(),
                'name' => $user->name,
                'avatar' => $user->avatar,
                'signature' => $user->signature,
            ],
            'profile' => [
                'joinedAt' => $user->created_at?->toDateString(),
                'level' => $user->isAdmin() ? '管理员' : '用户',
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
                    'value' => $user->comments_count ?? 0,
                ],
            ],
            'activeTab' => $activeTab,
            'collections' => $collections,
            'availableTabs' => $isOwnProfile
                ? [self::TAB_SUBMISSIONS, self::TAB_FAVORITES, self::TAB_COMMENTS]
                : [self::TAB_SUBMISSIONS],
            'isOwnProfile' => $isOwnProfile,
        ];
    }

    private function tabIsAvailable(string $activeTab, bool $isOwnProfile): bool
    {
        if ($activeTab === self::TAB_SUBMISSIONS) {
            return true;
        }

        return $isOwnProfile && in_array($activeTab, [self::TAB_FAVORITES, self::TAB_COMMENTS], true);
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
