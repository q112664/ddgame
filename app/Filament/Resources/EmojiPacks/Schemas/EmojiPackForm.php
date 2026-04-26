<?php

namespace App\Filament\Resources\EmojiPacks\Schemas;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EmojiPackForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->label('表情包名称')
                    ->required()
                    ->maxLength(255),
                TextInput::make('sort_order')
                    ->label('排序')
                    ->numeric()
                    ->minValue(0)
                    ->default(0)
                    ->required(),
                Checkbox::make('is_active')
                    ->label('启用')
                    ->default(true),
            ]);
    }
}
