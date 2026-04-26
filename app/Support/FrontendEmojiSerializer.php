<?php

namespace App\Support;

use App\Models\Emoji;
use App\Models\EmojiPack;

class FrontendEmojiSerializer
{
    /**
     * @return list<array{id: int, name: string, emojis: list<array{id: int, name: string, url: string, packName: string}>}>
     */
    public static function packs(): array
    {
        return EmojiPack::query()
            ->active()
            ->ordered()
            ->whereHas('emojis', fn ($query) => $query->active())
            ->with([
                'emojis' => fn ($query) => $query
                    ->active()
                    ->ordered(),
            ])
            ->get()
            ->map(fn (EmojiPack $pack): array => [
                'id' => $pack->getKey(),
                'name' => $pack->name,
                'emojis' => $pack->emojis
                    ->map(fn (Emoji $emoji): array => [
                        'id' => $emoji->getKey(),
                        'name' => $emoji->name,
                        'url' => $emoji->imageUrl(),
                        'packName' => $pack->name,
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }
}
