import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    Eye,
    Heart,
    ImageIcon,
    MessageCircle,
    ScrollText,
} from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { startTransition, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { formatResourceRelativeTime } from '@/lib/resource-time';
import { home } from '@/routes/index';
import {
    discussion as discussionRoute,
    downloads as downloadsRoute,
    favorite as favoriteRoute,
    screenshots as screenshotsRoute,
    show as showRoute,
} from '@/routes/resources/index';
import type { FrontendResource } from '@/types';
import type { User } from '@/types';

type ResourceSection = 'details' | 'downloads' | 'screenshots' | 'discussion';

const detailTagToneClass =
    'border-[#fb7299]/25 bg-[#fb7299]/10 text-[#fb7299] dark:border-[#fb7299]/30 dark:bg-[#fb7299]/14 dark:text-[#ff8fb0]';
const favoriteAuthToastId = 'resource-favorite-auth-required';

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
        description:
            '详情区域保留结构占位，后续可以继续接资源介绍、参数信息或补充说明。',
        icon: ScrollText,
    },
    downloads: {
        title: '下载',
        description:
            '下载区域保留结构占位，后续可以继续接资源版本、下载方式或安装说明。',
        icon: Download,
    },
    screenshots: {
        title: '截图',
        description:
            '截图区域保留结构占位，后续可以继续接画廊、预览图或宣传素材。',
        icon: ImageIcon,
    },
    discussion: {
        title: '讨论',
        description:
            '讨论区域保留结构占位，后续可以继续接评论、帖子或引用内容。',
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
    const {
        auth: { user },
    } = usePage<{ auth: { user: User | null } }>().props;
    const getInitials = useInitials();
    const [isFavorited, setIsFavorited] = useState(
        resource?.favoritedByCurrentUser ?? false,
    );
    const [favoriteCount, setFavoriteCount] = useState(
        resource?.favoriteCount ?? 0,
    );
    const [isFavoriting, setIsFavoriting] = useState(false);
    const currentSection = sectionMeta[section] ? section : 'details';
    const [activeSection, setActiveSection] =
        useState<ResourceSection>(currentSection);
    const currentSlug = resource?.slug ?? slug;
    const relativeTime = resource
        ? formatResourceRelativeTime(resource.publishedAt)
        : '—';
    const formattedFavoriteCount = new Intl.NumberFormat('zh-CN', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(favoriteCount);
    const formattedViewCount = new Intl.NumberFormat('zh-CN', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(resource?.viewCount ?? 0);
    const favoriteButtonVariant = 'outline';
    const favoriteButtonClass = isFavorited
        ? 'border-[#fb7299]/28 bg-[#fb7299]/8 text-[#e25f8d] shadow-none hover:border-[#fb7299]/38 hover:bg-[#fb7299]/12 hover:text-[#cf4d7d] dark:border-[#fb7299]/24 dark:bg-[#fb7299]/12 dark:text-[#ffb0ca] dark:hover:border-[#fb7299]/32 dark:hover:bg-[#fb7299]/16 dark:hover:text-[#ffc5da]'
        : 'border-[#fb7299]/18 bg-[#fb7299]/[0.04] text-[#e25f8d] shadow-none hover:border-[#fb7299]/26 hover:bg-[#fb7299]/[0.07] hover:text-[#cf4d7d] dark:border-[#fb7299]/20 dark:bg-[#fb7299]/[0.07] dark:text-[#ffb0ca] dark:hover:border-[#fb7299]/28 dark:hover:bg-[#fb7299]/[0.11] dark:hover:text-[#ffc5da]';
    const favoriteIconClass = isFavorited
        ? 'fill-current text-[#e25f8d] dark:text-[#ffb0ca]'
        : 'text-[#e25f8d] dark:text-[#ffb0ca]';
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

    useEffect(() => {
        return router.on('start', () => {
            toast.dismiss(favoriteAuthToastId);
        });
    }, []);

    useEffect(() => {
        setActiveSection(currentSection);
    }, [currentSection]);

    const handleFavoriteToggle = () => {
        if (resource === null || isFavoriting) {
            return;
        }

        if (user === null) {
            toast('请先登录后再收藏。', {
                id: favoriteAuthToastId,
                description: '登录后可以同步你的收藏记录。',
            });

            return;
        }

        const nextFavoritedState = !isFavorited;
        const nextFavoriteCount = Math.max(
            0,
            favoriteCount + (nextFavoritedState ? 1 : -1),
        );

        setIsFavoriting(true);

        startTransition(() => {
            setIsFavorited(nextFavoritedState);
            setFavoriteCount(nextFavoriteCount);
        });

        router.post(
            favoriteRoute({ resource: resource.slug }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    startTransition(() => {
                        setIsFavorited(!nextFavoritedState);
                        setFavoriteCount(favoriteCount);
                    });
                },
                onFinish: () => {
                    setIsFavoriting(false);
                },
            },
        );
    };

    if (resource === null) {
        return (
            <>
                <Head title="资源不存在" />

                <div className="space-y-6 py-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        资源不存在
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground">
                        当前资源未找到，可能已被移除，或者这个 Slug
                        还没有接入后台数据。
                    </p>
                    <Button asChild>
                        <Link href={home()}>
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
                    <Breadcrumb className="overflow-hidden">
                        <BreadcrumbList className="flex-nowrap overflow-hidden whitespace-nowrap">
                            <BreadcrumbItem className="shrink-0">
                                <BreadcrumbLink asChild>
                                    <Link href={home()}>首页</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="shrink-0" />
                            <BreadcrumbItem className="min-w-0 shrink overflow-hidden">
                                <BreadcrumbPage className="block truncate">
                                    {resource.title}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <article className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                    <div className="flex flex-col lg:flex-row">
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[16/9] lg:aspect-auto lg:min-h-[288px] lg:w-[400px] lg:shrink-0 lg:self-stretch">
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
                                    {resource.subtitle ? (
                                        <p className="max-w-3xl text-sm leading-6 text-foreground/72 sm:text-[15px]">
                                            {resource.subtitle}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    {resource.categories.map((category) => (
                                        <Badge
                                            key={category.name}
                                            variant="secondary"
                                            className={`h-7 rounded-full border px-2.5 text-[13px] font-medium tracking-[0.01em] sm:h-8 sm:text-sm ${getResourceCategoryBadgeToneClass(category.color)}`}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                                    <Button
                                        asChild
                                        className="h-9 w-full rounded-md px-2.5 text-sm sm:w-auto sm:px-3.5"
                                    >
                                        <Link
                                            href={downloadsRoute({
                                                slug: currentSlug,
                                            })}
                                        >
                                            <Download className="size-3.5" />
                                            下载
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={favoriteButtonVariant}
                                        className={`h-9 w-full rounded-md px-2.5 text-sm transition-colors sm:w-auto sm:px-3.5 ${favoriteButtonClass}`}
                                        aria-pressed={isFavorited}
                                        disabled={isFavoriting}
                                        onClick={handleFavoriteToggle}
                                    >
                                        <Heart
                                            className={`size-3.5 ${favoriteIconClass}`}
                                        />
                                        <span>
                                            {isFavorited ? '已收藏' : '收藏'}
                                        </span>
                                    </Button>
                                </div>

                                <div className="border-t border-border/70" />

                                <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-5 sm:gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-8 border border-border bg-muted">
                                            <AvatarImage
                                                src={
                                                    resource.authorAvatar ??
                                                    undefined
                                                }
                                                alt={resource.author}
                                            />
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
                                            {formattedViewCount}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Download className="size-4" />—
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Heart className="size-4 text-[#db2627]" />
                                            {formattedFavoriteCount}
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

                <Tabs value={activeSection} className="gap-4">
                    <LayoutGroup id="resource-tabs">
                        <TabsList className="w-full justify-start rounded-lg p-0.75 group-data-horizontal/tabs:h-10.5 dark:bg-white/[0.045]">
                            {tabItems.map((item) => (
                                <TabsTrigger
                                    key={item.value}
                                    value={item.value}
                                    asChild
                                    className="rounded-md px-4.25 text-[14px] data-active:border-transparent data-active:bg-transparent group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent dark:data-active:text-foreground"
                                >
                                    <Link
                                        href={item.href}
                                        prefetch={['hover', 'click']}
                                        onMouseDown={() =>
                                            setActiveSection(item.value)
                                        }
                                        onTouchStart={() =>
                                            setActiveSection(item.value)
                                        }
                                        onClick={() =>
                                            setActiveSection(item.value)
                                        }
                                    >
                                        {activeSection === item.value ? (
                                            <motion.span
                                                layoutId="resource-tabs-active-pill"
                                                className="pointer-events-none absolute inset-0 rounded-md bg-primary/10 dark:bg-primary/14"
                                                transition={{
                                                    bounce: 0.14,
                                                    duration: 0.2,
                                                    ease: 'easeOut',
                                                }}
                                            />
                                        ) : null}

                                        <span className="relative z-10 inline-flex items-center gap-1.5">
                                            <item.icon className="size-4" />
                                            {item.label}
                                        </span>
                                    </Link>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </LayoutGroup>
                </Tabs>

                <article className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
                    {currentSection === 'details' ? (
                        <div className="space-y-5">
                            {resource.content ? (
                                <div
                                    className="text-sm leading-7 text-foreground/90 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_hr]:my-6 [&_hr]:border-border [&_li]:leading-7 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:text-muted-foreground [&_p:not(:last-child)]:mb-4 [&_strong]:font-semibold [&_ul]:ml-6 [&_ul]:list-disc"
                                    dangerouslySetInnerHTML={{
                                        __html: resource.content,
                                    }}
                                />
                            ) : (
                                <p className="text-sm leading-6 text-muted-foreground">
                                    暂未填写资源详情内容，后续可以在后台补充介绍、参数信息或补充说明。
                                </p>
                            )}

                            {resource.tags.length > 0 ? (
                                <div className="space-y-3 border-t border-border/70 pt-5">
                                    <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                        标签
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {resource.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className={`h-7 rounded-full border px-2.5 text-[13px] font-medium ${detailTagToneClass}`}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <p className="text-sm leading-6 text-muted-foreground">
                            {sectionMeta[currentSection].description}
                        </p>
                    )}
                </article>
            </div>
        </>
    );
}
