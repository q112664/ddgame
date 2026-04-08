<?php

namespace App\Filament\Resources\ResourceCategories\Tables;

use App\Support\ResourceCategoryColor;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ResourceCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('分类名称')
                    ->searchable(),
                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable(),
                TextColumn::make('color')
                    ->label('分类颜色')
                    ->badge()
                    ->color(fn (ResourceCategoryColor|string|null $state): string => $state instanceof ResourceCategoryColor ? $state->filamentColor() : 'gray')
                    ->formatStateUsing(fn (ResourceCategoryColor|string|null $state): string => $state instanceof ResourceCategoryColor ? $state->label() : (string) $state),
                TextColumn::make('sort_order')
                    ->label('排序')
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('更新时间')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
