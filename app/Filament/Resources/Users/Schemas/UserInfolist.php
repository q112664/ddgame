<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                ImageEntry::make('avatar_path')
                    ->label('头像')
                    ->disk('public')
                    ->circular(),
                TextEntry::make('name')
                    ->label('用户名'),
                TextEntry::make('email')
                    ->label('邮箱'),
                TextEntry::make('email_verified_at')
                    ->label('邮箱验证时间')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->label('创建时间')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->label('更新时间')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('two_factor_confirmed_at')
                    ->label('两步验证确认时间')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('avatar_path')
                    ->label('头像路径')
                    ->placeholder('-'),
            ]);
    }
}
