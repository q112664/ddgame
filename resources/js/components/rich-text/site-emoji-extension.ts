import { mergeAttributes, Node } from '@tiptap/core';

export const SiteEmoji = Node.create({
    name: 'siteEmoji',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: false,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) =>
                    element.getAttribute('data-site-emoji-id'),
            },
            name: {
                default: '',
                parseHTML: (element) => element.getAttribute('alt') ?? '',
            },
            src: {
                default: '',
                parseHTML: (element) => element.getAttribute('src') ?? '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'img[data-site-emoji-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'img',
            mergeAttributes({
                src: HTMLAttributes.src,
                alt: HTMLAttributes.name,
                'data-site-emoji-id': HTMLAttributes.id,
            }),
        ];
    },
});
