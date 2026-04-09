<?php

namespace App\Filament\Resources\Tags\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class TagInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextEntry::make('name')
                    ->label('标签名称'),
                TextEntry::make('slug')
                    ->label('Slug'),
                TextEntry::make('resources_count')
                    ->label('资源数'),
                TextEntry::make('updated_at')
                    ->label('更新时间')
                    ->dateTime(),
            ]);
    }
}
