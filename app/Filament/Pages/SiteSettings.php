<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting as SiteSettingModel;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class SiteSettings extends BaseSiteSettingsPage
{
    protected static ?string $navigationLabel = '站点地址';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static ?int $navigationSort = 100;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->model($this->record ?? SiteSettingModel::class)
            ->statePath('data')
            ->components([
                Section::make('站点地址')
                    ->description('在这里维护前台共享的站点主地址。')
                    ->schema([
                        TextInput::make('site_url')
                            ->label('站点地址')
                            ->url()
                            ->required()
                            ->maxLength(255)
                            ->helperText('用于记录站点主地址，未填写时默认使用 APP_URL。'),
                    ]),
            ]);
    }

    protected function getFillData(SiteSettingModel $settings): array
    {
        return [
            'site_url' => $settings->site_url ?: config('app.url'),
        ];
    }

    protected function mutateSaveData(array $data, SiteSettingModel $settings): array
    {
        return [
            'site_url' => $data['site_url'] ?: config('app.url'),
        ];
    }

    protected function getSavedNotificationTitle(): string
    {
        return '站点地址已保存';
    }

    public function getTitle(): string
    {
        return '站点地址';
    }
}
