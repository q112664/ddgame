<?php

namespace App\Support;

use App\Models\Resource;
use Illuminate\Support\Str;

class ResourceSlug
{
    public static function generateUnique(): string
    {
        do {
            $slug = Str::random(7);
        } while (static::slugExists($slug));

        return $slug;
    }

    public static function shouldGenerate(?string $slug): bool
    {
        return blank($slug) || ! preg_match('/^[A-Za-z0-9]{7}$/', $slug);
    }

    protected static function slugExists(string $slug, ?int $ignoreResourceId = null): bool
    {
        return Resource::query()
            ->when($ignoreResourceId !== null, fn ($query) => $query->whereKeyNot($ignoreResourceId))
            ->where('slug', $slug)
            ->exists();
    }
}
