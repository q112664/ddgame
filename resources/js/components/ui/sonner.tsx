import type { ComponentProps } from 'react';
import { Toaster as Sonner, toast } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

type ToasterProps = ComponentProps<typeof Sonner>;

function Toaster({ className, toastOptions, ...props }: ToasterProps) {
    const { resolvedAppearance } = useAppearance();

    return (
        <Sonner
            theme={resolvedAppearance}
            className={cn('toaster group', className)}
            toastOptions={{
                classNames: {
                    toast: 'group toast border-border bg-card text-card-foreground shadow-lg',
                    title: 'text-sm font-medium',
                    description: 'text-sm text-muted-foreground',
                    actionButton:
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    cancelButton:
                        'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                },
                ...toastOptions,
            }}
            {...props}
        />
    );
}

export { Toaster, toast };
