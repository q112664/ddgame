<?php

namespace App\Filament\Resources\Emoji\Pages;

use App\Filament\Resources\Emoji\EmojiResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewEmoji extends ViewRecord
{
    protected static string $resource = EmojiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
