import { Head, Link, usePage } from '@inertiajs/react';
import FrontSiteShell from '@/components/front-site-shell';
import { Badge } from '@/components/ui/badge';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { cn } from '@/lib/utils';
import { show as showResource } from '@/routes/resources/index';
import type { FrontendResource } from '@/types';

function TopicBadge({
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

function TopicCardItem({
    slug,
    title,
    thumbnail,
    categories,
}: FrontendResource) {
    return (
        <Link
            href={showResource({ slug })}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
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
                            <TopicBadge
                                key={category.name}
                                className={getResourceCategoryBadgeToneClass(category.color)}
                            >
                                {category.name}
                            </TopicBadge>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Home() {
    const { resources } = usePage<{ resources: FrontendResource[] }>().props;

    return (
        <>
            <Head title="首页" />

            <FrontSiteShell>
                <section
                    id="overview"
                    className="space-y-4"
                >
                    <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {resources.map((resource) => (
                            <TopicCardItem
                                key={resource.slug}
                                {...resource}
                            />
                        ))}
                    </div>
                </section>
            </FrontSiteShell>
        </>
    );
}
