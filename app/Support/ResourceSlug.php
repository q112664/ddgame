<?php

namespace App\Support;

use Illuminate\Support\Str;

class ResourceSlug
{
    public static function generate(string $title): string
    {
        $slug = Str::slug($title);

        if (filled($slug)) {
            return $slug;
        }

        return 'resource-'.substr(md5($title), 0, 10);
    }
}
