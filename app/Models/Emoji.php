<?php

namespace App\Models;

use Database\Factories\EmojiFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Emoji extends Model
{
    /** @use HasFactory<EmojiFactory> */
    use HasFactory;

    protected $table = 'emojis';

    protected $fillable = [
        'emoji_pack_id',
        'name',
        'image_path',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::deleted(function (Emoji $emoji): void {
            if ($emoji->image_path !== '') {
                Storage::disk('public')->delete($emoji->image_path);
            }
        });
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(EmojiPack::class, 'emoji_pack_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderBy('name');
    }

    public function imageUrl(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
