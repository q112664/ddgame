<?php

namespace App\Support;

use Illuminate\Support\Str;

class TagSlug
{
    public static function generate(string $name): string
    {
        $slug = Str::slug(trim($name));

        if (filled($slug)) {
            return $slug;
        }

        return 'tag-'.substr(md5($name), 0, 10);
    }
}
