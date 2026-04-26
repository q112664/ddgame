<?php

namespace App\Support;

use App\Models\Emoji;
use DOMDocument;
use DOMElement;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class SanitizedHtml
{
    public static function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return $html;
        }

        $config = (new HtmlSanitizerConfig)
            ->allowSafeElements()
            ->allowLinkSchemes(['http', 'https', 'mailto', 'tel'])
            ->allowRelativeLinks()
            ->allowMediaSchemes(['http', 'https'])
            ->allowRelativeMedias();

        return (new HtmlSanitizer($config))->sanitize($html);
    }

    public static function cleanComment(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return $html;
        }

        $html = self::normalizeCommentEmojis($html);

        $config = (new HtmlSanitizerConfig)
            ->allowElement('p')
            ->allowElement('br')
            ->allowElement('strong')
            ->allowElement('b')
            ->allowElement('em')
            ->allowElement('i')
            ->allowElement('s')
            ->allowElement('code')
            ->allowElement('a', ['href'])
            ->allowElement('img', ['src', 'alt', 'data-site-emoji-id'])
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->allowRelativeLinks()
            ->allowRelativeMedias()
            ->forceAttribute('a', 'target', '_blank')
            ->forceAttribute('a', 'rel', 'noopener noreferrer nofollow');

        return self::normalizeCommentEmojis((new HtmlSanitizer($config))->sanitize($html));
    }

    public static function plainText(?string $html): string
    {
        $html = preg_replace(
            '/<img\b(?=[^>]*(?:\bdata-site-emoji-id=|\bsrc=["\'][^"\']*\/storage\/emojis\/))[^>]*>/i',
            '🙂',
            (string) $html,
        ) ?? '';

        $text = html_entity_decode(
            strip_tags($html),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8',
        );

        return trim(preg_replace('/[\s\x{00A0}]+/u', ' ', $text) ?? '');
    }

    private static function normalizeCommentEmojis(string $html): string
    {
        if (! str_contains($html, 'data-site-emoji-id')) {
            return $html;
        }

        preg_match_all('/data-site-emoji-id=["\']?(\d+)/i', $html, $matches);
        $emojiIds = collect($matches[1] ?? [])
            ->map(fn (string $id): int => (int) $id)
            ->filter()
            ->unique()
            ->values();

        if ($emojiIds->isEmpty()) {
            return preg_replace('/<img\b[^>]*>/i', '', $html) ?? '';
        }

        $emojis = Emoji::query()
            ->active()
            ->whereIn('id', $emojiIds)
            ->get()
            ->keyBy('id');

        $document = new DOMDocument('1.0', 'UTF-8');
        $previousErrors = libxml_use_internal_errors(true);

        $document->loadHTML(
            '<?xml encoding="UTF-8"><div>'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previousErrors);

        $container = $document->getElementsByTagName('div')->item(0);

        if (! $container instanceof DOMElement) {
            return $html;
        }

        /** @var list<DOMElement> $images */
        $images = iterator_to_array($container->getElementsByTagName('img'));

        foreach ($images as $image) {
            $emojiId = (int) $image->getAttribute('data-site-emoji-id');
            $emoji = $emojis->get($emojiId);

            if (! $emoji instanceof Emoji) {
                $image->parentNode?->removeChild($image);

                continue;
            }

            while ($image->attributes->length > 0) {
                $attribute = $image->attributes->item(0);

                if ($attribute === null) {
                    break;
                }

                $image->removeAttributeNode($attribute);
            }

            $image->setAttribute('src', $emoji->imageUrl());
            $image->setAttribute('alt', $emoji->name);
            $image->setAttribute('data-site-emoji-id', (string) $emoji->getKey());
        }

        $html = '';

        foreach ($container->childNodes as $childNode) {
            $html .= $document->saveHTML($childNode);
        }

        return $html;
    }
}
