<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->label('用户名')
                    ->required(),
                TextInput::make('email')
                    ->label('邮箱')
                    ->email()
                    ->unique(ignoreRecord: true)
                    ->required(),
                DateTimePicker::make('email_verified_at')
                    ->label('邮箱验证时间'),
                Checkbox::make('is_admin')
                    ->label('管理员'),
                TextInput::make('password')
                    ->label('密码')
                    ->password()
                    ->revealable()
                    ->dehydrated(fn (?string $state): bool => filled($state))
                    ->required(fn (string $operation): bool => $operation === 'create'),
                FileUpload::make('avatar_path')
                    ->label('头像')
                    ->image()
                    ->avatar()
                    ->disk('public')
                    ->directory('avatars')
                    ->visibility('public'),
            ]);
    }
}
