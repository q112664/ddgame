<?php

namespace App\Filament\Resources\ResourceCategories;

use App\Filament\Resources\ResourceCategories\Pages\CreateResourceCategory;
use App\Filament\Resources\ResourceCategories\Pages\EditResourceCategory;
use App\Filament\Resources\ResourceCategories\Pages\ListResourceCategories;
use App\Filament\Resources\ResourceCategories\Pages\ViewResourceCategory;
use App\Filament\Resources\ResourceCategories\Schemas\ResourceCategoryForm;
use App\Filament\Resources\ResourceCategories\Schemas\ResourceCategoryInfolist;
use App\Filament\Resources\ResourceCategories\Tables\ResourceCategoriesTable;
use App\Models\ResourceCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ResourceCategoryResource extends Resource
{
    protected static ?string $model = ResourceCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    protected static ?string $navigationLabel = '资源分类';

    protected static ?string $modelLabel = '资源分类';

    protected static ?string $pluralModelLabel = '资源分类';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->ordered();
    }

    public static function form(Schema $schema): Schema
    {
        return ResourceCategoryForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ResourceCategoryInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ResourceCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListResourceCategories::route('/'),
            'create' => CreateResourceCategory::route('/create'),
            'view' => ViewResourceCategory::route('/{record}'),
            'edit' => EditResourceCategory::route('/{record}/edit'),
        ];
    }
}
