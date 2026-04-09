<?php

namespace App\Filament\Resources\Resources;

use App\Filament\Resources\Resources\Pages\CreateResource;
use App\Filament\Resources\Resources\Pages\EditResource;
use App\Filament\Resources\Resources\Pages\ListResources;
use App\Filament\Resources\Resources\Pages\ViewResource;
use App\Filament\Resources\Resources\Schemas\ResourceForm;
use App\Filament\Resources\Resources\Schemas\ResourceInfolist;
use App\Filament\Resources\Resources\Tables\ResourcesTable;
use App\Models\Resource as ResourceModel;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ResourceResource extends Resource
{
    protected static ?string $model = ResourceModel::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = '资源';

    protected static ?string $modelLabel = '资源';

    protected static ?string $pluralModelLabel = '资源';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['categories', 'author', 'tags'])
            ->latest('published_at');
    }

    public static function form(Schema $schema): Schema
    {
        return ResourceForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ResourceInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ResourcesTable::configure($table);
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
            'index' => ListResources::route('/'),
            'create' => CreateResource::route('/create'),
            'view' => ViewResource::route('/{record}'),
            'edit' => EditResource::route('/{record}/edit'),
        ];
    }
}
