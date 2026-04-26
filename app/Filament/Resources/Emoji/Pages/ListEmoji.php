<?php

namespace App\Filament\Resources\Emoji\Pages;

use App\Filament\Resources\Emoji\EmojiResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEmoji extends ListRecords
{
    protected static string $resource = EmojiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
