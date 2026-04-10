<?php

namespace App\Filament\Resources\Resources\Schemas;

use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use App\Support\TagNameParser;
use App\Support\TagSlug;
use Filament\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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
                    ->maxLength(255),
                TextInput::make('slug')
                    ->label('Slug')
                    ->maxLength(255)
                    ->readOnly()
                    ->dehydrated()
                    ->helperText('保存后自动生成 7 位大小写字母数字混合 Slug。')
                    ->unique(ignoreRecord: true),
                Select::make('categories')
                    ->label('分类')
                    ->relationship('categories', 'name')
                    ->options(ResourceCategory::query()->ordered()->pluck('name', 'id')->all())
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->required()
                    ->native(false),
                Select::make('user_id')
                    ->label('作者')
                    ->relationship('author', 'name')
                    ->options(User::query()->orderBy('name')->pluck('name', 'id')->all())
                    ->searchable()
                    ->preload()
                    ->required()
                    ->native(false),
                Select::make('tags')
                    ->label('标签')
                    ->relationship('tags', 'name')
                    ->options(Tag::query()->orderBy('name')->pluck('name', 'id')->all())
                    ->multiple()
                    ->createOptionForm([
                        TextInput::make('name')
                            ->label('标签名称')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->createOptionUsing(fn (array $data): int => static::resolveTagId((string) ($data['name'] ?? '')))
                    ->searchable()
                    ->preload()
                    ->required()
                    ->native(false)
                    ->hintAction(
                        Action::make('bulkCreateTags')
                            ->label('批量添加')
                            ->icon('heroicon-m-plus')
                            ->color('gray')
                            ->schema([
                                Textarea::make('names')
                                    ->label('标签名称')
                                    ->helperText('支持英文逗号、中文逗号、空格和换行分隔，提交后会批量创建并自动选中。')
                                    ->rows(5)
                                    ->required(),
                            ])
                            ->modalHeading('批量添加标签')
                            ->modalSubmitActionLabel('添加标签')
                            ->action(function (Select $component, array $data): void {
                                $tagIds = static::resolveTagIds($data['names'] ?? []);
                                $state = collect($component->getState() ?? [])
                                    ->merge($tagIds)
                                    ->filter()
                                    ->unique()
                                    ->values()
                                    ->all();

                                $component->state($state);
                                $component->callAfterStateUpdated();
                                $component->refreshSelectedOptionLabel();
                            }),
                    )
                    ->columnSpanFull(),
                DateTimePicker::make('published_at')
                    ->label('发布时间')
                    ->seconds(false)
                    ->required(),
            ]);
    }

    protected static function resolveTagId(string $name): int
    {
        $name = trim($name);

        return Tag::query()->firstOrCreate(
            ['slug' => TagSlug::generate($name)],
            ['name' => $name],
        )->getKey();
    }

    /** @return list<int> */
    protected static function resolveTagIds(mixed $names): array
    {
        return collect(TagNameParser::parse($names))
            ->map(fn (string $name): int => static::resolveTagId($name))
            ->unique()
            ->values()
            ->all();
    }
}
