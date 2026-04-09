<?php

namespace App\Support;

class TagNameParser
{
    /** @return list<string> */
    public static function parse(mixed $names): array
    {
        $segments = is_array($names) ? $names : [$names];

        return collect($segments)
            ->filter(fn (mixed $segment): bool => is_string($segment))
            ->flatMap(function (string $segment): array {
                $parts = preg_split('/[\s,，]+/u', trim($segment), -1, PREG_SPLIT_NO_EMPTY);

                return is_array($parts) ? $parts : [];
            })
            ->map(fn (string $name): string => trim($name))
            ->filter(fn (string $name): bool => filled($name))
            ->unique()
            ->values()
            ->all();
    }
}
