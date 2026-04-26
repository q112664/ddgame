<?php

namespace App\Filament\Resources\EmojiPacks\Pages;

use App\Filament\Resources\EmojiPacks\EmojiPackResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEmojiPacks extends ListRecords
{
    protected static string $resource = EmojiPackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
