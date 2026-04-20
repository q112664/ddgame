<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting as SiteSettingModel;
use BackedEnum;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class NavigationSettings extends BaseSiteSettingsPage
{
    protected static ?string $navigationLabel = '导航菜单';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBars3;

    protected static ?int $navigationSort = 120;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->model($this->record ?? SiteSettingModel::class)
            ->statePath('data')
            ->components([
                Section::make('导航菜单')
                    ->description('维护前台桌面与移动端共用的主导航菜单。支持自定义链接、排序和新窗口打开。')
                    ->schema([
                        Repeater::make('primary_navigation')
                            ->label('菜单项')
                            ->defaultItems(0)
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => filled($state['label'] ?? null)
                                ? (string) $state['label']
                                : '新菜单项')
                            ->schema([
                                Hidden::make('sort_order')
                                    ->default(0),
                                TextInput::make('label')
                                    ->label('菜单名称')
                                    ->maxLength(255)
                                    ->placeholder('例如：概览'),
                                TextInput::make('url')
                                    ->label('链接地址')
                                    ->maxLength(2048)
                                    ->placeholder('/#overview 或 https://example.com'),
                                Toggle::make('open_in_new_tab')
                                    ->label('新窗口打开')
                                    ->inline(false),
                            ])
                            ->addActionLabel('添加菜单项')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    protected function getFillData(SiteSettingModel $settings): array
    {
        return [
            'primary_navigation' => $settings->primary_navigation ?? SiteSettingModel::defaultPrimaryNavigation(),
        ];
    }

    protected function mutateSaveData(array $data, SiteSettingModel $settings): array
    {
        return [
            'primary_navigation' => collect($data['primary_navigation'] ?? [])
                ->filter(fn (mixed $item): bool => is_array($item))
                ->values()
                ->map(fn (array $item, int $index): array => [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'url' => trim((string) ($item['url'] ?? '')),
                    'open_in_new_tab' => (bool) ($item['open_in_new_tab'] ?? false),
                    'sort_order' => $index + 1,
                ])
                ->filter(fn (array $item): bool => filled($item['label']) && filled($item['url']))
                ->values()
                ->all(),
        ];
    }

    protected function getSavedNotificationTitle(): string
    {
        return '导航菜单已保存';
    }

    public function getTitle(): string
    {
        return '导航菜单';
    }
}
