<?php

namespace App\Filament\Resources\Emoji\Schemas;

use App\Models\EmojiPack;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EmojiForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Select::make('emoji_pack_id')
                    ->label('所属表情包')
                    ->options(fn (): array => EmojiPack::query()->ordered()->pluck('name', 'id')->all())
                    ->searchable()
                    ->preload()
                    ->native(false)
                    ->required(),
                TextInput::make('name')
                    ->label('表情名称')
                    ->required()
                    ->maxLength(255),
                FileUpload::make('image_path')
                    ->label('表情图片')
                    ->acceptedFileTypes(['image/png', 'image/webp', 'image/gif'])
                    ->maxSize(1024)
                    ->disk('public')
                    ->directory('emojis')
                    ->visibility('public')
                    ->image()
                    ->required()
                    ->columnSpanFull(),
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
