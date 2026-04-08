<?php

namespace App\Filament\Resources\Resources\Schemas;

use App\Models\ResourceCategory;
use App\Support\ResourceSlug;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ResourceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                FileUpload::make('thumbnail_path')
                    ->label('缩略图')
                    ->image()
                    ->disk('public')
                    ->directory('resources/thumbnails')
                    ->visibility('public')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('title')
                    ->label('标题')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, callable $set): void {
                        if (blank($state)) {
                            return;
                        }

                        $set('slug', ResourceSlug::generate($state));
                    }),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Select::make('resource_category_id')
                    ->label('分类')
                    ->relationship('category', 'name')
                    ->options(ResourceCategory::query()->ordered()->pluck('name', 'id')->all())
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('author_name')
                    ->label('作者')
                    ->required()
                    ->maxLength(255),
                TagsInput::make('tags')
                    ->label('标签')
                    ->required()
                    ->reorderable()
                    ->columnSpanFull(),
                DateTimePicker::make('published_at')
                    ->label('发布时间')
                    ->seconds(false)
                    ->required(),
            ]);
    }
}
