<?php

namespace App\Filament\Resources\Emoji\Pages;

use App\Filament\Resources\Emoji\EmojiResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditEmoji extends EditRecord
{
    protected static string $resource = EmojiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
