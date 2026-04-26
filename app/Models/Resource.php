<?php

namespace App\Models;

use App\Support\ResourceSlug;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Resource extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'slug',
        'thumbnail_path',
        'user_id',
        'published_at',
        'view_count',
        'content',
    ];

    /**
     * @var list<string>
     */
    protected $appends = ['thumbnail_url'];

    protected static function booted(): void
    {
        static::creating(function (self $resource): void {
            if (blank($resource->published_at)) {
                $resource->published_at = now();
            }
        });

        static::saving(function (self $resource): void {
            if (ResourceSlug::shouldGenerate($resource->slug)) {
                $resource->slug = ResourceSlug::generateUnique();
            }
        });

        static::deleting(function (self $resource): void {
            $resource->comments()->delete();
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'view_count' => 'integer',
        ];
    }

    public function incrementViewCount(): void
    {
        static::withoutTimestamps(function (): void {
            $this->increment('view_count');
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ResourceCategory::class, 'resource_category_resource')
            ->withTimestamps()
            ->orderBy('resource_categories.sort_order')
            ->orderBy('resource_categories.name');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withTimestamps();
    }

    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'resource_user_like')
            ->withTimestamps();
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if (blank($this->thumbnail_path)) {
                return null;
            }

            if (Str::startsWith($this->thumbnail_path, ['http://', 'https://'])) {
                return $this->thumbnail_path;
            }

            return asset('storage/'.$this->thumbnail_path);
        });
    }
}
