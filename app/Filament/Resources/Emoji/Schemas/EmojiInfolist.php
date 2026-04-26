<?php

namespace App\Filament\Resources\Emoji\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class EmojiInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                ImageEntry::make('image_path')
                    ->label('表情图片')
                    ->disk('public')
                    ->square(),
                TextEntry::make('name')
                    ->label('表情名称'),
                TextEntry::make('pack.name')
                    ->label('表情包'),
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
