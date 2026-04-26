import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code2,
    Eraser,
    Italic,
    LinkIcon,
    SmilePlus,
    Strikethrough,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SiteEmoji as SiteEmojiExtension } from '@/components/rich-text/site-emoji-extension';
import { getRichTextPlainText } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import type { SiteEmoji, SiteEmojiPack } from '@/types';

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    error?: string;
    minHeight?: number;
    showFocusRing?: boolean;
    surface?: 'transparent' | 'card';
    enableSiteEmojis?: boolean;
    emojiPacks?: SiteEmojiPack[];
    className?: string;
};

type ToolbarButton = {
    label: string;
    icon: typeof Bold;
    isActive: boolean;
    onClick: () => void;
};

export function RichTextEditor({
    value,
    onChange,
    placeholder,
    disabled = false,
    maxLength,
    error,
    minHeight = 80,
    showFocusRing = true,
    surface = 'transparent',
    enableSiteEmojis = false,
    emojiPacks = [],
    className,
}: RichTextEditorProps) {
    const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        editable: !disabled,
        extensions: [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                bulletList: false,
                orderedList: false,
                horizontalRule: false,
                codeBlock: false,
            }),
            SiteEmojiExtension,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    rel: 'noopener noreferrer nofollow',
                    target: '_blank',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount.configure({
                limit: maxLength,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-full px-3 py-2.5 text-sm leading-6 outline-none',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.isEmpty ? '' : currentEditor.getHTML());
        },
    });

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [disabled, editor]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        if (value === '') {
            if (!editor.isEmpty) {
                editor.commands.clearContent(false);
            }

            return;
        }

        if (editor.getHTML() === value) {
            return;
        }

        editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    const textLength = editor
        ? editor.storage.characterCount.characters()
        : getRichTextPlainText(value).length;
    const activeMarks = useEditorState({
        editor,
        selector: ({ editor: currentEditor }) => ({
            bold: currentEditor?.isActive('bold') ?? false,
            italic: currentEditor?.isActive('italic') ?? false,
            strike: currentEditor?.isActive('strike') ?? false,
            code: currentEditor?.isActive('code') ?? false,
            link: currentEditor?.isActive('link') ?? false,
        }),
    }) ?? {
        bold: false,
        italic: false,
        strike: false,
        code: false,
        link: false,
    };
    const hasExceededLimit =
        typeof maxLength === 'number' && textLength > maxLength;
    const toolbarButtons: ToolbarButton[] = editor
        ? [
              {
                  label: '粗体',
                  icon: Bold,
                  isActive: activeMarks.bold,
                  onClick: () => editor.chain().focus().toggleBold().run(),
              },
              {
                  label: '斜体',
                  icon: Italic,
                  isActive: activeMarks.italic,
                  onClick: () => editor.chain().focus().toggleItalic().run(),
              },
              {
                  label: '删除线',
                  icon: Strikethrough,
                  isActive: activeMarks.strike,
                  onClick: () => editor.chain().focus().toggleStrike().run(),
              },
              {
                  label: '行内代码',
                  icon: Code2,
                  isActive: activeMarks.code,
                  onClick: () => editor.chain().focus().toggleCode().run(),
              },
          ]
        : [];

    const openLinkEditor = () => {
        if (!editor) {
            return;
        }

        setIsEmojiPickerOpen(false);
        const previousUrl = editor.getAttributes('link').href as
            | string
            | undefined;

        setLinkUrl(previousUrl ?? '');
        setIsLinkEditorOpen(true);
    };

    const insertSiteEmoji = (emoji: SiteEmoji) => {
        if (!editor) {
            return;
        }

        editor
            .chain()
            .focus()
            .insertContent({
                type: 'siteEmoji',
                attrs: {
                    id: String(emoji.id),
                    name: emoji.name,
                    src: emoji.url,
                },
            })
            .run();
        setIsEmojiPickerOpen(false);
    };

    const applyLink = () => {
        if (!editor) {
            return;
        }

        if (linkUrl.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setIsLinkEditorOpen(false);
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: linkUrl.trim() })
            .run();
        setIsLinkEditorOpen(false);
    };

    const toolbarButton = (item: ToolbarButton) => {
        const Icon = item.icon;

        return (
            <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'size-8 border border-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground',
                            item.isActive &&
                                'border-primary/25 bg-primary/12 text-primary hover:bg-primary/16 hover:text-primary',
                        )}
                        disabled={disabled || !editor}
                        aria-label={item.label}
                        aria-pressed={item.isActive}
                        onClick={item.onClick}
                    >
                        <Icon className="size-4" aria-hidden="true" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
        );
    };

    const handleLinkSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        applyLink();
    };

    useEffect(() => {
        if (activeMarks.link || isLinkEditorOpen) {
            return;
        }

        setLinkUrl('');
    }, [activeMarks.link, isLinkEditorOpen]);

    const canUseSiteEmojis = enableSiteEmojis && emojiPacks.length > 0;

    return (
        <div className={cn('space-y-2', className)}>
            <div
                className={cn(
                    'overflow-hidden rounded-lg border border-input transition-[color,box-shadow]',
                    surface === 'card' ? 'bg-card' : 'bg-transparent',
                    showFocusRing
                        ? 'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50'
                        : 'focus-within:border-input',
                    error &&
                        (showFocusRing
                            ? 'border-destructive focus-within:ring-destructive/20'
                            : 'border-destructive focus-within:border-destructive'),
                    disabled && 'cursor-not-allowed opacity-60',
                )}
            >
                <TooltipProvider>
                    <div className="relative flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/30 px-2 py-1.5">
                        {toolbarButtons.map(toolbarButton)}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        'size-8 border border-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground',
                                        activeMarks.link &&
                                            'border-primary/25 bg-primary/12 text-primary hover:bg-primary/16 hover:text-primary',
                                    )}
                                    disabled={disabled || !editor}
                                    aria-label="链接"
                                    aria-pressed={activeMarks.link}
                                    aria-expanded={isLinkEditorOpen}
                                    onClick={openLinkEditor}
                                >
                                    <LinkIcon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>链接</TooltipContent>
                        </Tooltip>

                        {canUseSiteEmojis ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground"
                                        disabled={disabled || !editor}
                                        aria-label="站内表情"
                                        aria-expanded={isEmojiPickerOpen}
                                        onClick={() => {
                                            setIsLinkEditorOpen(false);
                                            setIsEmojiPickerOpen(
                                                (isOpen) => !isOpen,
                                            );
                                        }}
                                    >
                                        <SmilePlus
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>站内表情</TooltipContent>
                            </Tooltip>
                        ) : null}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
                                    disabled={disabled || !editor}
                                    aria-label="清除格式"
                                    onClick={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .unsetAllMarks()
                                            .run()
                                    }
                                >
                                    <Eraser
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>清除格式</TooltipContent>
                        </Tooltip>

                        {isLinkEditorOpen ? (
                            <form
                                className="absolute top-full left-2 z-20 mt-2 flex w-[min(22rem,calc(100vw-3rem))] flex-col gap-2 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md"
                                onSubmit={handleLinkSubmit}
                            >
                                <Input
                                    type="text"
                                    inputMode="url"
                                    value={linkUrl}
                                    placeholder="https://example.com"
                                    autoFocus
                                    className="h-8 text-sm"
                                    onChange={(event) =>
                                        setLinkUrl(event.target.value)
                                    }
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setIsLinkEditorOpen(false)
                                        }
                                    >
                                        取消
                                    </Button>
                                    <Button type="submit" size="sm">
                                        {linkUrl.trim() === ''
                                            ? '移除链接'
                                            : '应用链接'}
                                    </Button>
                                </div>
                            </form>
                        ) : null}

                        {isEmojiPickerOpen && canUseSiteEmojis ? (
                            <div className="absolute top-full left-2 z-20 mt-2 flex max-h-72 w-[min(23rem,calc(100vw-3rem))] flex-col gap-3 overflow-y-auto rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
                                {emojiPacks.map((pack) => (
                                    <div key={pack.id} className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {pack.name}
                                        </p>
                                        <div className="grid grid-cols-8 gap-1.5">
                                            {pack.emojis.map((emoji) => (
                                                <button
                                                    key={emoji.id}
                                                    type="button"
                                                    className="flex size-9 items-center justify-center rounded-md border border-transparent bg-transparent transition hover:border-border hover:bg-accent focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                                                    title={emoji.name}
                                                    onClick={() =>
                                                        insertSiteEmoji(emoji)
                                                    }
                                                >
                                                    <img
                                                        src={emoji.url}
                                                        alt={emoji.name}
                                                        className="max-h-7 max-w-7 object-contain"
                                                        loading="lazy"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </TooltipProvider>

                <EditorContent
                    editor={editor}
                    className={cn(
                        'prose-editor text-foreground [&_.tiptap]:min-h-[inherit] [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_a]:font-medium [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_img[data-site-emoji-id]]:mx-0.5 [&_img[data-site-emoji-id]]:inline-block [&_img[data-site-emoji-id]]:size-7 [&_img[data-site-emoji-id]]:align-[-0.35em] [&_img[data-site-emoji-id]]:object-contain [&_p]:my-0 [&_p+p]:mt-2',
                    )}
                    style={{ minHeight }}
                />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className={error ? 'text-destructive' : undefined}>
                    {error}
                </span>

                {typeof maxLength === 'number' ? (
                    <span
                        className={cn(
                            'tabular-nums',
                            hasExceededLimit && 'text-destructive',
                        )}
                    >
                        {textLength}/{maxLength}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
