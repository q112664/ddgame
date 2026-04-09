<?php

use App\Support\TagNameParser;

test('it parses tag names from mixed separators', function () {
    expect(TagNameParser::parse("Galgame, 汉化，全年龄\nADV 视觉小说"))
        ->toBe([
            'Galgame',
            '汉化',
            '全年龄',
            'ADV',
            '视觉小说',
        ]);
});

test('it removes empty values and duplicates', function () {
    expect(TagNameParser::parse([' Galgame ', '汉化，Galgame', '', "  \n"]))
        ->toBe([
            'Galgame',
            '汉化',
        ]);
});
