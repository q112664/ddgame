<?php

namespace App\Filament\Resources\ResourceCategories\Schemas;

use App\Support\ResourceCategoryColor;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ResourceCategoryInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextEntry::make('name')
                    ->label('分类名称'),
                TextEntry::make('slug')
                    ->label('Slug'),
                TextEntry::make('color')
                    ->label('分类颜色')
                    ->badge()
                    ->color(fn (ResourceCategoryColor|string|null $state): string => $state instanceof ResourceCategoryColor ? $state->filamentColor() : 'gray')
                    ->formatStateUsing(fn (ResourceCategoryColor|string|null $state): string => $state instanceof ResourceCategoryColor ? $state->label() : (string) $state),
                TextEntry::make('sort_order')
                    ->label('排序'),
                TextEntry::make('created_at')
                    ->label('创建时间')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->label('更新时间')
                    ->dateTime(),
            ]);
    }
}
