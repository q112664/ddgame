<?php

namespace App\Models;

use App\Support\ResourceCategoryColor;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResourceCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'color' => ResourceCategoryColor::class,
            'sort_order' => 'integer',
        ];
    }

    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query
            ->orderBy('sort_order')
            ->orderBy('name');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'resource_category_id');
    }
}
