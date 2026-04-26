<?php

namespace App\Filament\Resources\Emoji\Pages;

use App\Filament\Resources\Emoji\EmojiResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEmoji extends CreateRecord
{
    protected static string $resource = EmojiResource::class;
}
