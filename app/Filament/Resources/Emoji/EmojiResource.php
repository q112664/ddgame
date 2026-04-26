<?php

namespace App\Filament\Resources\Emoji;

use App\Filament\Resources\Emoji\Pages\CreateEmoji;
use App\Filament\Resources\Emoji\Pages\EditEmoji;
use App\Filament\Resources\Emoji\Pages\ListEmoji;
use App\Filament\Resources\Emoji\Pages\ViewEmoji;
use App\Filament\Resources\Emoji\Schemas\EmojiForm;
use App\Filament\Resources\Emoji\Schemas\EmojiInfolist;
use App\Filament\Resources\Emoji\Tables\EmojiTable;
use App\Models\Emoji;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EmojiResource extends Resource
{
    protected static ?string $model = Emoji::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = '表情';

    protected static ?string $modelLabel = '表情';

    protected static ?string $pluralModelLabel = '表情';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with('pack')
            ->ordered();
    }

    public static function form(Schema $schema): Schema
    {
        return EmojiForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return EmojiInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmojiTable::configure($table);
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
            'index' => ListEmoji::route('/'),
            'create' => CreateEmoji::route('/create'),
            'view' => ViewEmoji::route('/{record}'),
            'edit' => EditEmoji::route('/{record}/edit'),
        ];
    }
}
