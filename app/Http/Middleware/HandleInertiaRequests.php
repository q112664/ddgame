<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => fn (): string => SiteSetting::shared()['name'],
            'site' => fn (): array => SiteSetting::shared(),
            'auth' => [
                'user' => fn (): ?array => $this->resolveSharedUser($request),
            ],
            'flash' => [
                'favoriteUpdate' => fn (): ?array => $this->resolveFavoriteUpdateFlash($request),
            ],
            'sidebarOpen' => fn (): bool => $this->resolveSidebarOpen($request),
        ];
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     email: string,
     *     avatar: ?string,
     *     signature: ?string,
     *     can_access_admin_panel: bool,
     *     email_verified_at: ?string
     * }|null
     */
    private function resolveSharedUser(Request $request): ?array
    {
        $user = $request->user();

        if ($user === null) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'signature' => $user->signature,
            'can_access_admin_panel' => $user->isAdmin(),
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
        ];
    }

    private function resolveSidebarOpen(Request $request): bool
    {
        return ! $request->hasCookie('sidebar_state')
            || $request->cookie('sidebar_state') === 'true';
    }

    /**
     * @return array{
     *     resourceSlug: string,
     *     favorited: bool,
     *     favoriteCount: int
     * }|null
     */
    private function resolveFavoriteUpdateFlash(Request $request): ?array
    {
        $favoriteUpdate = $request->session()->get('favoriteUpdate');

        if (! is_array($favoriteUpdate)) {
            return null;
        }

        $resourceSlug = $favoriteUpdate['resourceSlug'] ?? null;
        $favoriteCount = $favoriteUpdate['favoriteCount'] ?? null;

        if (! is_string($resourceSlug) || ! is_numeric($favoriteCount)) {
            return null;
        }

        return [
            'resourceSlug' => $resourceSlug,
            'favorited' => (bool) ($favoriteUpdate['favorited'] ?? false),
            'favoriteCount' => (int) $favoriteCount,
        ];
    }
}
