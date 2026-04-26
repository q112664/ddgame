<?php

namespace App\Filament\Resources\EmojiPacks\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class EmojiPackInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextEntry::make('name')
                    ->label('表情包名称'),
                TextEntry::make('emojis_count')
                    ->label('表情数'),
                TextEntry::make('sort_order')
                    ->label('排序'),
                IconEntry::make('is_active')
                    ->label('启用')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->label('创建时间')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->label('更新时间')
                    ->dateTime(),
            ]);
    }
}
