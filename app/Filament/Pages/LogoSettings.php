<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting as SiteSettingModel;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Storage;

class LogoSettings extends BaseSiteSettingsPage
{
    protected static ?string $navigationLabel = 'Logo 设置';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?int $navigationSort = 110;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->model($this->record ?? SiteSettingModel::class)
            ->statePath('data')
            ->components([
                Section::make('Logo 设置')
                    ->description('在这里维护站点的 Logo 图片和 Logo 文字。')
                    ->columns(2)
                    ->schema([
                        TextInput::make('logo_text')
                            ->label('Logo 文字')
                            ->required()
                            ->maxLength(255)
                            ->helperText('用于站点头部、后台品牌名等文字品牌展示。'),
                        FileUpload::make('logo_path')
                            ->label('Logo 图片')
                            ->image()
                            ->disk('public')
                            ->directory('site-settings/logos')
                            ->visibility('public')
                            ->helperText('建议上传透明底图片，保存后将同步用于前台与后台品牌图标展示。')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    protected function getFillData(SiteSettingModel $settings): array
    {
        return [
            'logo_text' => $settings->logo_text ?: config('app.name'),
            'logo_path' => $settings->logo_path,
        ];
    }

    protected function mutateSaveData(array $data, SiteSettingModel $settings): array
    {
        return [
            'logo_text' => $data['logo_text'] ?: config('app.name'),
            'logo_path' => $data['logo_path'] ?? null,
        ];
    }

    protected function afterSave(SiteSettingModel $previous, SiteSettingModel $current): void
    {
        if (filled($previous->logo_path) && $previous->logo_path !== $current->logo_path) {
            Storage::disk('public')->delete((string) $previous->logo_path);
        }
    }

    protected function getSavedNotificationTitle(): string
    {
        return 'Logo 设置已保存';
    }

    public function getTitle(): string
    {
        return 'Logo 设置';
    }
}
