<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

/**
 * @property ?string $site_url
 * @property ?string $logo_text
 * @property ?string $logo_path
 * @property ?array<int, array{
 *     label?: mixed,
 *     url?: mixed,
 *     open_in_new_tab?: mixed,
 *     sort_order?: mixed
 * }> $primary_navigation
 * @property-read ?string $logo_url
 */
class SiteSetting extends Model
{
    protected $fillable = [
        'site_url',
        'logo_text',
        'logo_path',
        'primary_navigation',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'primary_navigation' => 'array',
        ];
    }

    public static function singleton(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'site_url' => config('app.url'),
                'logo_text' => config('app.name'),
            ],
        );
    }

    /**
     * @return list<array{
     *     label: string,
     *     url: string,
     *     open_in_new_tab: bool,
     *     sort_order: int
     * }>
     */
    public static function defaultPrimaryNavigation(): array
    {
        $homePath = route('home', absolute: false);

        return [
            [
                'label' => '概览',
                'url' => "{$homePath}#overview",
                'open_in_new_tab' => false,
                'sort_order' => 1,
            ],
            [
                'label' => '系统',
                'url' => "{$homePath}#systems",
                'open_in_new_tab' => false,
                'sort_order' => 2,
            ],
            [
                'label' => '状态',
                'url' => "{$homePath}#status",
                'open_in_new_tab' => false,
                'sort_order' => 3,
            ],
        ];
    }

    /**
     * @return array{
     *     name: string,
     *     url: string,
     *     logo: ?string,
     *     navigation: array{
     *         primary: list<array{
     *             label: string,
     *             url: string,
     *             openInNewTab: bool
     *         }>
     *     }
     * }
     */
    public static function shared(): array
    {
        if (! Schema::hasTable('site_settings')) {
            return [
                'name' => (string) config('app.name'),
                'url' => (string) config('app.url'),
                'logo' => null,
                'navigation' => [
                    'primary' => static::formatPrimaryNavigationForShared(static::defaultPrimaryNavigation()),
                ],
            ];
        }

        $settings = static::singleton();
        $primaryNavigation = $settings->primary_navigation;

        return [
            'name' => $settings?->logo_text ?: (string) config('app.name'),
            'url' => $settings?->site_url ?: (string) config('app.url'),
            'logo' => $settings?->logo_url,
            'navigation' => [
                'primary' => static::formatPrimaryNavigationForShared(
                    $primaryNavigation ?? static::defaultPrimaryNavigation(),
                ),
            ],
        ];
    }

    /**
     * @return list<array{
     *     label: string,
     *     url: string,
     *     open_in_new_tab: bool,
     *     sort_order: int
     * }>
     */
    public static function normalizePrimaryNavigation(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        return collect($items)
            ->filter(fn (mixed $item): bool => is_array($item))
            ->map(function (array $item, int $index): array {
                return [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'url' => trim((string) ($item['url'] ?? '')),
                    'open_in_new_tab' => (bool) ($item['open_in_new_tab'] ?? false),
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ];
            })
            ->filter(fn (array $item): bool => filled($item['label']) && filled($item['url']))
            ->sortBy('sort_order')
            ->values()
            ->all();
    }

    /**
     * @return list<array{
     *     label: string,
     *     url: string,
     *     openInNewTab: bool
     * }>
     */
    private static function formatPrimaryNavigationForShared(mixed $items): array
    {
        return collect(static::normalizePrimaryNavigation($items))
            ->map(fn (array $item): array => [
                'label' => $item['label'],
                'url' => $item['url'],
                'openInNewTab' => $item['open_in_new_tab'],
            ])
            ->values()
            ->all();
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (blank($this->logo_path)) {
            return null;
        }

        return asset('storage/'.ltrim((string) $this->logo_path, '/'));
    }
}
