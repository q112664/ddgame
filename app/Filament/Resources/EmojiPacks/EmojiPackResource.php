<?php

namespace App\Filament\Resources\EmojiPacks;

use App\Filament\Resources\EmojiPacks\Pages\CreateEmojiPack;
use App\Filament\Resources\EmojiPacks\Pages\EditEmojiPack;
use App\Filament\Resources\EmojiPacks\Pages\ListEmojiPacks;
use App\Filament\Resources\EmojiPacks\Pages\ViewEmojiPack;
use App\Filament\Resources\EmojiPacks\Schemas\EmojiPackForm;
use App\Filament\Resources\EmojiPacks\Schemas\EmojiPackInfolist;
use App\Filament\Resources\EmojiPacks\Tables\EmojiPacksTable;
use App\Models\EmojiPack;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EmojiPackResource extends Resource
{
    protected static ?string $model = EmojiPack::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = '表情包';

    protected static ?string $modelLabel = '表情包';

    protected static ?string $pluralModelLabel = '表情包';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withCount('emojis')
            ->ordered();
    }

    public static function form(Schema $schema): Schema
    {
        return EmojiPackForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return EmojiPackInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmojiPacksTable::configure($table);
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
            'index' => ListEmojiPacks::route('/'),
            'create' => CreateEmojiPack::route('/create'),
            'view' => ViewEmojiPack::route('/{record}'),
            'edit' => EditEmojiPack::route('/{record}/edit'),
        ];
    }
}
