<?php

namespace App\Filament\Resources\EmojiPacks\Pages;

use App\Filament\Resources\EmojiPacks\EmojiPackResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditEmojiPack extends EditRecord
{
    protected static string $resource = EmojiPackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
