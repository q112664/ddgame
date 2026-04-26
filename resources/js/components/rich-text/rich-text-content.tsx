import { cn } from '@/lib/utils';

type RichTextContentProps = {
    html: string;
    className?: string;
};

export function RichTextContent({ html, className }: RichTextContentProps) {
    return (
        <div
            className={cn(
                'break-words [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_br]:block [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_img[data-site-emoji-id]]:mx-0.5 [&_img[data-site-emoji-id]]:inline-block [&_img[data-site-emoji-id]]:size-7 [&_img[data-site-emoji-id]]:align-[-0.35em] [&_img[data-site-emoji-id]]:object-contain [&_p]:my-0 [&_p+p]:mt-2 [&_s]:text-muted-foreground',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
