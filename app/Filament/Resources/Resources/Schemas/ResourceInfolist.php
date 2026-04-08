<?php

namespace App\Filament\Resources\Resources\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ResourceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                ImageEntry::make('thumbnail_url')
                    ->label('缩略图')
                    ->columnSpanFull(),
                TextEntry::make('title')
                    ->label('标题'),
                TextEntry::make('slug')
                    ->label('Slug'),
                TextEntry::make('category.name')
                    ->label('分类'),
                TextEntry::make('author_name')
                    ->label('作者'),
                TextEntry::make('tags')
                    ->label('标签')
                    ->badge()
                    ->separator(','),
                TextEntry::make('published_at')
                    ->label('发布时间')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->label('更新时间')
                    ->dateTime(),
            ]);
    }
}
