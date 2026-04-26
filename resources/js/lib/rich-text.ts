export function getRichTextPlainText(value: string): string {
    const valueWithEmojiText = value.replace(
        /<img\b(?=[^>]*(?:\bdata-site-emoji-id=|\bsrc=["'][^"']*\/storage\/emojis\/))[^>]*>/gi,
        '🙂',
    );

    if (typeof document === 'undefined') {
        return valueWithEmojiText
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    const container = document.createElement('div');
    container.innerHTML = valueWithEmojiText;

    return (container.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function isRichTextEmpty(value: string): boolean {
    return getRichTextPlainText(value).length === 0;
}
