import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Bookmark,
    Download,
    Eye,
    Heart,
    ImageIcon,
    MessageCircle,
    ScrollText,
} from 'lucide-react';
import { useState } from 'react';
import type { ComponentType } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Avatar,
    AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { formatResourceRelativeTime } from '@/lib/resource-time';
import {
    discussion as discussionRoute,
    downloads as downloadsRoute,
    screenshots as screenshotsRoute,
    show as showRoute,
} from '@/routes/resources/index';
import type { FrontendResource } from '@/types';

type ResourceSection = 'details' | 'downloads' | 'screenshots' | 'discussion';

const tagToneClasses = [
    'border-[color:color-mix(in_oklab,var(--color-chart-1)_24%,var(--color-border))] bg-[color:color-mix(in_oklab,var(--color-chart-1)_14%,var(--color-background))] text-[color:color-mix(in_oklab,var(--color-chart-1)_58%,var(--color-foreground))]',
    'border-[color:color-mix(in_oklab,var(--color-chart-2)_24%,var(--color-border))] bg-[color:color-mix(in_oklab,var(--color-chart-2)_14%,var(--color-background))] text-[color:color-mix(in_oklab,var(--color-chart-2)_58%,var(--color-foreground))]',
    'border-[color:color-mix(in_oklab,var(--color-chart-3)_24%,var(--color-border))] bg-[color:color-mix(in_oklab,var(--color-chart-3)_14%,var(--color-background))] text-[color:color-mix(in_oklab,var(--color-chart-3)_58%,var(--color-foreground))]',
    'border-[color:color-mix(in_oklab,var(--color-chart-4)_24%,var(--color-border))] bg-[color:color-mix(in_oklab,var(--color-chart-4)_14%,var(--color-background))] text-[color:color-mix(in_oklab,var(--color-chart-4)_58%,var(--color-foreground))]',
    'border-[color:color-mix(in_oklab,var(--color-chart-5)_24%,var(--color-border))] bg-[color:color-mix(in_oklab,var(--color-chart-5)_14%,var(--color-background))] text-[color:color-mix(in_oklab,var(--color-chart-5)_58%,var(--color-foreground))]',
] as const;

const sectionMeta: Record<
    ResourceSection,
    {
        title: string;
        description: string;
        icon: ComponentType<{ className?: string }>;
    }
> = {
    details: {
        title: '详情',
        description: '详情区域保留结构占位，后续可以继续接资源介绍、参数信息或补充说明。',
        icon: ScrollText,
    },
    downloads: {
        title: '下载',
        description: '下载区域保留结构占位，后续可以继续接资源版本、下载方式或安装说明。',
        icon: Download,
    },
    screenshots: {
        title: '截图',
        description: '截图区域保留结构占位，后续可以继续接画廊、预览图或宣传素材。',
        icon: ImageIcon,
    },
    discussion: {
        title: '讨论',
        description: '讨论区域保留结构占位，后续可以继续接评论、帖子或引用内容。',
        icon: MessageCircle,
    },
};

export default function ResourceShow({
    resource,
    slug,
    section = 'details',
}: {
    resource: FrontendResource | null;
    slug: string;
    section?: ResourceSection;
}) {
    const getInitials = useInitials();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const currentSection = sectionMeta[section] ? section : 'details';
    const currentSlug = resource?.slug ?? slug;
    const relativeTime = resource ? formatResourceRelativeTime(resource.publishedAt) : '—';
    const tabItems = [
        {
            value: 'details' as const,
            href: showRoute({ slug: currentSlug }),
            icon: ScrollText,
            label: '详情',
        },
        {
            value: 'downloads' as const,
            href: downloadsRoute({ slug: currentSlug }),
            icon: Download,
            label: '下载',
        },
        {
            value: 'screenshots' as const,
            href: screenshotsRoute({ slug: currentSlug }),
            icon: ImageIcon,
            label: '截图',
        },
        {
            value: 'discussion' as const,
            href: discussionRoute({ slug: currentSlug }),
            icon: MessageCircle,
            label: '讨论',
        },
    ];

    if (resource === null) {
        return (
            <>
                <Head title="资源不存在" />

                <div className="space-y-6 py-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        资源不存在
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground">
                        当前资源未找到，可能已被移除，或者这个 Slug 还没有接入后台数据。
                    </p>
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeft data-icon="inline-start" />
                            返回首页
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={resource.title} />

            <div className="space-y-5 pt-2 pb-4">
                <div className="pb-1">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">首页</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>资源页面</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <article className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                    <div className="flex flex-col lg:flex-row">
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[16/9] lg:min-h-[288px] lg:w-[400px] lg:shrink-0 lg:self-stretch lg:aspect-auto">
                            <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                className="h-full w-full object-cover lg:absolute lg:inset-0 lg:h-full"
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                            <div className="flex min-h-full flex-col justify-center gap-3 sm:gap-3.5">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <h2 className="text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
                                        {resource.title}
                                    </h2>
                                    <p className="text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
                                        {resource.author} · {relativeTime}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`h-7 rounded-full border px-2.5 text-[13px] font-medium tracking-[0.01em] sm:h-8 sm:text-sm ${getResourceCategoryBadgeToneClass(resource.categoryColor)}`}
                                    >
                                        {resource.category}
                                    </Badge>
                                    {resource.tags.map((tag, index) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className={`h-7 rounded-full border px-2.5 text-[13px] font-medium sm:h-8 sm:text-sm ${tagToneClasses[index % tagToneClasses.length]}`}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
                                    <Button
                                        asChild
                                        className="h-9 w-full rounded-md px-2.5 text-sm sm:w-auto sm:px-3.5"
                                    >
                                        <Link href={downloadsRoute({ slug: currentSlug })}>
                                            <Download className="size-3.5" />
                                            下载
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 w-full rounded-md border-border/70 bg-background/80 px-2.5 text-sm shadow-none transition-colors hover:bg-muted sm:w-auto sm:px-3.5"
                                        aria-pressed={isFavorite}
                                        onClick={() => setIsFavorite((current) => !current)}
                                    >
                                        <Bookmark
                                            className={`size-3.5 ${isFavorite ? 'fill-current text-primary' : ''}`}
                                        />
                                        {isFavorite ? '已收藏' : '收藏'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 w-full rounded-md border-border/70 bg-background/80 px-2.5 text-sm shadow-none transition-colors hover:bg-muted sm:w-auto sm:px-3.5"
                                        aria-pressed={isLiked}
                                        onClick={() => setIsLiked((current) => !current)}
                                    >
                                        <Heart
                                            className={`size-3.5 ${isLiked ? 'fill-current text-primary' : ''}`}
                                        />
                                        {isLiked ? '已点赞' : '点赞'}
                                    </Button>
                                </div>

                                <div className="border-t border-border/70" />

                                <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-5 sm:gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-8 border border-border bg-muted">
                                            <AvatarFallback className="bg-transparent text-xs font-medium text-foreground/80">
                                                {getInitials(resource.author)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground/85">
                                            {resource.author}
                                        </span>
                                        <span>·</span>
                                        <span>{relativeTime}</span>
                                    </div>

                                    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-[13px] sm:w-auto">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Eye className="size-4" />
                                            —
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Download className="size-4" />
                                            —
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Heart className="size-4" />
                                            —
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MessageCircle className="size-4" />
                                            —
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <Tabs
                    value={currentSection}
                    className="gap-4"
                >
                    <TabsList className="h-auto w-full justify-start">
                        {tabItems.map((item) => (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-4" />
                                    {item.label}
                                </Link>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <article className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
                    <p className="text-sm leading-6 text-muted-foreground">
                        {sectionMeta[currentSection].description}
                    </p>
                </article>
            </div>
        </>
    );
}
