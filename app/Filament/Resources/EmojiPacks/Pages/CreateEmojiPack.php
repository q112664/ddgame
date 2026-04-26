<?php

namespace App\Filament\Resources\EmojiPacks\Pages;

use App\Filament\Resources\EmojiPacks\EmojiPackResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEmojiPack extends CreateRecord
{
    protected static string $resource = EmojiPackResource::class;
}
