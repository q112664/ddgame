<?php

namespace App\Filament\Resources\ResourceCategories\Schemas;

use App\Support\ResourceCategoryColor;
use App\Support\ResourceCategorySlug;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ResourceCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->label('分类名称')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, callable $set): void {
                        if (blank($state)) {
                            return;
                        }

                        $set('slug', ResourceCategorySlug::generate($state));
                    }),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Select::make('color')
                    ->label('分类颜色')
                    ->options(ResourceCategoryColor::options())
                    ->default(ResourceCategoryColor::Sky->value)
                    ->native(false)
                    ->required()
                    ->helperText('用于前台分类徽标的颜色。'),
                TextInput::make('sort_order')
                    ->label('排序')
                    ->integer()
                    ->default(0)
                    ->required()
                    ->minValue(0),
            ]);
    }
}
