<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Resource extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'thumbnail_path',
        'resource_category_id',
        'tags',
        'author_name',
        'published_at',
    ];

    /**
     * @var list<string>
     */
    protected $appends = ['thumbnail_url'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ResourceCategory::class, 'resource_category_id');
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
