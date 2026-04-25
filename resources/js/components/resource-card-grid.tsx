import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { formatResourceRelativeTime } from '@/lib/resource-time';
import { cn } from '@/lib/utils';
import { useInitials } from '@/hooks/use-initials';
import { show as showResource } from '@/routes/resources/index';
import type { FrontendResource } from '@/types';

function ResourceCategoryBadge({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'h-6 rounded-full border-0 px-2.5 text-[11px] font-medium ring-1',
                className,
            )}
        >
            {children}
        </Badge>
    );
}

function ResourceCard({
    slug,
    title,
    thumbnail,
    categories,
    author,
    authorAvatar,
    publishedAt,
}: FrontendResource) {
    const getInitials = useInitials();
    const relativeTime = formatResourceRelativeTime(publishedAt);

    return (
        <Link
            href={showResource({ slug })}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-200 hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="relative h-44 overflow-hidden leading-none">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    className="block h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="space-y-3">
                    <h2 className="line-clamp-2 min-h-[3rem] text-[1.05rem] leading-6 font-medium text-foreground">
                        {title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5">
                        {categories.map((category) => (
                            <ResourceCategoryBadge
                                key={`${slug}-${category.name}`}
                                className={getResourceCategoryBadgeToneClass(
                                    category.color,
                                )}
                            >
                                {category.name}
                            </ResourceCategoryBadge>
                        ))}
                    </div>

                    <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                        <Avatar
                            size="sm"
                            className="size-5 bg-muted"
                        >
                            <AvatarImage
                                src={authorAvatar ?? undefined}
                                alt={author}
                            />
                            <AvatarFallback className="text-[10px] font-medium">
                                {getInitials(author)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate font-medium text-foreground/70">
                                {author}
                            </span>
                            <span className="shrink-0 text-muted-foreground/60">
                                ·
                            </span>
                            <span className="shrink-0">{relativeTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function ResourceCardGrid({
    resources,
    emptyTitle,
    emptyDescription,
}: {
    resources: FrontendResource[];
    emptyTitle: string;
    emptyDescription: string;
}) {
    if (resources.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border/70 bg-card/70 px-6 py-14 text-center shadow-xs">
                <div className="mx-auto max-w-md space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">
                        {emptyTitle}
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        {emptyDescription}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4">
            {resources.map((resource) => (
                <ResourceCard
                    key={resource.slug}
                    {...resource}
                />
            ))}
        </div>
    );
}

export { ResourceCategoryBadge };
