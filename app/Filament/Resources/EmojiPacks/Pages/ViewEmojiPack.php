<?php

namespace App\Filament\Resources\EmojiPacks\Pages;

use App\Filament\Resources\EmojiPacks\EmojiPackResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewEmojiPack extends ViewRecord
{
    protected static string $resource = EmojiPackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
