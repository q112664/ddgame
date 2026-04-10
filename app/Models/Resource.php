<?php

namespace App\Models;

use App\Support\ResourceSlug;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Resource extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'thumbnail_path',
        'user_id',
        'published_at',
    ];

    /**
     * @var list<string>
     */
    protected $appends = ['thumbnail_url'];

    protected static function booted(): void
    {
        static::saving(function (self $resource): void {
            if (ResourceSlug::shouldGenerate($resource->slug)) {
                $resource->slug = ResourceSlug::generateUnique();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
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
