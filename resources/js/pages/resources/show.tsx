import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    Eye,
    Heart,
    ImageIcon,
    MessageCircle,
    ScrollText,
} from 'lucide-react';
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
import { getResourceById } from '@/data/resources';
import { useInitials } from '@/hooks/use-initials';
import {
    discussion as discussionRoute,
    downloads as downloadsRoute,
    screenshots as screenshotsRoute,
    show as showRoute,
} from '@/routes/resources/index';

type ResourceSection = 'details' | 'downloads' | 'screenshots' | 'discussion';

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
    id,
    section = 'details',
}: {
    id: string;
    section?: ResourceSection;
}) {
    const resource = getResourceById(id);
    const getInitials = useInitials();
    const currentSection = sectionMeta[section] ? section : 'details';
    const displayMetric = (value: string) =>
        /\d/.test(value) ? value : '—';
    const tabItems = [
        {
            value: 'details' as const,
            href: showRoute({ id }),
            icon: ScrollText,
            label: '详情',
        },
        {
            value: 'downloads' as const,
            href: downloadsRoute({ id }),
            icon: Download,
            label: '下载',
        },
        {
            value: 'screenshots' as const,
            href: screenshotsRoute({ id }),
            icon: ImageIcon,
            label: '截图',
        },
        {
            value: 'discussion' as const,
            href: discussionRoute({ id }),
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
                        当前资源未找到，可能已被移除，或者这个 ID 还没有接入演示数据。
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
                        <div className="lg:h-[300px] lg:w-[400px] lg:shrink-0">
                            <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                className="h-64 w-full object-cover lg:h-full"
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                    {resource.title}
                                </h2>
                                <p className="text-base text-muted-foreground">
                                    {resource.originalTitle} · {resource.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <Badge
                                        variant="secondary"
                                        className="h-8 rounded-full border border-primary/15 bg-primary/10 px-3.5 text-[13px] font-semibold tracking-[0.01em] text-primary"
                                    >
                                        {resource.category}
                                    </Badge>
                                    {resource.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="h-8 rounded-full border-border/60 bg-muted/55 px-3.5 text-[13px] font-medium text-foreground/75"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
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
                                        <span>{resource.time}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Eye className="size-4" />
                                            {displayMetric(resource.stats.views)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Download className="size-4" />
                                            —
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Heart className="size-4" />
                                            {displayMetric(resource.stats.likes)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MessageCircle className="size-4" />
                                            {displayMetric(resource.stats.replies)}
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
