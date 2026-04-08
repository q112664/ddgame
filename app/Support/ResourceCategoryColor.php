<?php

namespace App\Support;

enum ResourceCategoryColor: string
{
    case Sky = 'sky';
    case Emerald = 'emerald';
    case Amber = 'amber';
    case Rose = 'rose';
    case Violet = 'violet';
    case Slate = 'slate';

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $color): array => [$color->value => $color->label()])
            ->all();
    }

    public function filamentColor(): string
    {
        return match ($this) {
            self::Sky => 'info',
            self::Emerald => 'success',
            self::Amber => 'warning',
            self::Rose => 'danger',
            self::Violet => 'primary',
            self::Slate => 'gray',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Sky => '天蓝',
            self::Emerald => '翠绿',
            self::Amber => '琥珀',
            self::Rose => '玫红',
            self::Violet => '紫罗兰',
            self::Slate => '石板灰',
        };
    }
}
