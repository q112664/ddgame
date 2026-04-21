<?php

namespace App\Support;

use App\Models\Resource;

class FrontendResourceSerializer
{
    /**
     * @param  iterable<resource>  $resources
     * @return list<array<string, mixed>>
     */
    public static function summaries(iterable $resources): array
    {
        return collect($resources)
            ->map(fn (Resource $resource): array => static::summary($resource))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function summary(Resource $resource): array
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

    /**
     * @return array<string, mixed>
     */
    public static function details(Resource $resource): array
    {
        return [
            ...static::summary($resource),
            'content' => $resource->content,
            'viewCount' => $resource->view_count,
            'favoriteCount' => $resource->favorited_by_users_count ?? $resource->favoritedByUsers()->count(),
            'favoritedByCurrentUser' => (bool) ($resource->is_favorited_by_current_user ?? false),
        ];
    }
}
