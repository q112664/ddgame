import { Head, Link, useForm } from '@inertiajs/react';
import {
    Heart,
    MessageCircle,
    ShieldCheck,
    SquarePen,
} from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { RichTextContent } from '@/components/rich-text/rich-text-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    contentPanelClass,
    contentPanelStripClass,
    contentPanelTabsTriggerClass,
} from '@/lib/content-panel';
import { useInitials } from '@/hooks/use-initials';
import { buildProfileFavoriteOptimisticProps } from '@/lib/profile-favorite-optimistic';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { formatRelativeTime } from '@/lib/resource-time';
import { cn } from '@/lib/utils';
import {
    favorite as favoriteResource,
    show as showResource,
} from '@/routes/resources/index';
import {
    comments as showUserProfileComments,
    favorites as showUserProfileFavorites,
    show as showUserProfile,
} from '@/routes/users/index';
import type { FrontendProfileComment, FrontendResource } from '@/types';

type ProfileSummary = {
    joinedAt: string | null;
    level: string;
};

type ProfileStat = {
    label: string;
    value: number;
};

type ProfileTabKey = 'submissions' | 'favorites' | 'comments';

type ProfileUser = {
    id: number;
    name: string;
    avatar: string | null;
    signature: string | null;
};

type ProfileCollections = {
    submissions?: FrontendResource[];
    favorites?: FrontendResource[];
    comments?: FrontendProfileComment[];
};

type ProfileShowPageProps = {
    stats: ProfileStat[];
    collections: ProfileCollections;
    isOwnProfile: boolean;
};

const profileTabItems = [
    {
        value: 'submissions' as const,
        label: '投稿',
        emptyTitle: '还没有投稿内容',
        emptyDescription:
            '发布后的资源会展示在这里，方便你快速回看自己分享的内容。',
    },
    {
        value: 'favorites' as const,
        label: '收藏',
        emptyTitle: '还没有收藏内容',
        emptyDescription:
            '你收藏过的资源会展示在这里，之后可以直接回来继续查看。',
    },
    {
        value: 'comments' as const,
        label: '评论',
        emptyTitle: '还没有评论内容',
        emptyDescription: '你在资源讨论区留下的评论会展示在这里。',
    },
] satisfies Array<{
    value: ProfileTabKey;
    label: string;
    emptyTitle: string;
    emptyDescription: string;
}>;

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

function ProfileStatIcon({
    label,
    className,
}: {
    label: string;
    className?: string;
}) {
    if (label === '投稿数量') {
        return <SquarePen className={className} />;
    }

    if (label === '收藏数量') {
        return <Heart className={className} />;
    }

    return <MessageCircle className={className} />;
}

function ProfileResourceCard({
    slug,
    title,
    thumbnail,
    categories,
    subtitle,
    action,
}: FrontendResource & { action?: ReactNode }) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
            <Link
                href={showResource({ slug })}
                className="flex flex-1 cursor-pointer flex-col focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
                <div className="relative h-44 overflow-hidden bg-muted leading-none">
                    <img
                        src={thumbnail}
                        alt={title}
                        loading="lazy"
                        className="block h-full w-full object-cover"
                    />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="space-y-2">
                        <h3 className="line-clamp-2 text-[1.05rem] leading-6 font-medium text-foreground">
                            {title}
                        </h3>

                        {subtitle ? (
                            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {subtitle}
                            </p>
                        ) : null}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-1.5">
                        {categories.map((category) => (
                            <TopicBadge
                                key={`${slug}-${category.name}`}
                                className={getResourceCategoryBadgeToneClass(
                                    category.color,
                                )}
                            >
                                {category.name}
                            </TopicBadge>
                        ))}
                    </div>
                </div>
            </Link>

            {action ? (
                <div className="border-t border-border/70 px-3 py-3">
                    {action}
                </div>
            ) : null}
        </div>
    );
}

function formatProfileCommentTime(dateString: string | null): string {
    if (dateString === null) {
        return '刚刚';
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
        return '刚刚';
    }

    return formatRelativeTime(new Date(), parsedDate);
}

function ProfileCommentCard({ comment }: { comment: FrontendProfileComment }) {
    const resource = comment.resource;

    return (
        <article className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                {resource ? (
                    <Link
                        href={showResource({ slug: resource.slug })}
                        className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-36"
                    >
                        <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    </Link>
                ) : null}

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatProfileCommentTime(comment.createdAt)}</span>
                        {comment.replyTo ? (
                            <>
                                <span>·</span>
                                <span>回复给 {comment.replyTo}</span>
                            </>
                        ) : null}
                    </div>

                    <RichTextContent
                        html={comment.body}
                        className="text-sm leading-7 text-foreground/88"
                    />

                    {resource ? (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        >
                            <Link href={showResource({ slug: resource.slug })}>
                                <MessageCircle className="size-4" />
                                查看资源：{resource.title}
                            </Link>
                        </Button>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            原资源暂不可用
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

const profileSurfaceClass = contentPanelClass;

export default function ProfileShow({
    profileUser,
    profile,
    stats,
    activeTab,
    collections,
    availableTabs,
    isOwnProfile,
}: {
    profileUser: ProfileUser;
    profile: ProfileSummary;
    stats: ProfileStat[];
    activeTab: ProfileTabKey;
    collections: ProfileCollections;
    availableTabs: ProfileTabKey[];
    isOwnProfile: boolean;
}) {
    const getInitials = useInitials();
    const favoriteForm = useForm({
        favorited: false,
    });
    const [pendingFavoriteSlug, setPendingFavoriteSlug] = useState<string | null>(
        null,
    );
    const visibleTabItems = profileTabItems.filter((item) =>
        availableTabs.includes(item.value),
    );
    const currentTab = visibleTabItems.some((item) => item.value === activeTab)
        ? activeTab
        : (visibleTabItems[0]?.value ?? 'submissions');
    const [pendingTab, setPendingTab] = useState<ProfileTabKey>(currentTab);
    const currentTabItem =
        visibleTabItems.find((item) => item.value === currentTab) ??
        profileTabItems[0];
    const currentResources =
        currentTab === 'comments' ? [] : (collections[currentTab] ?? []);
    const currentComments =
        currentTab === 'comments' ? (collections.comments ?? []) : [];
    const isTabTransitioning = pendingTab !== currentTab;

    useEffect(() => {
        setPendingTab(currentTab);
    }, [currentTab]);

    const getProfileTabHref = (tab: ProfileTabKey) => {
        if (tab === 'favorites') {
            return showUserProfileFavorites({ user: profileUser.id });
        }

        if (tab === 'comments') {
            return showUserProfileComments({ user: profileUser.id });
        }

        return showUserProfile({ user: profileUser.id });
    };

    const handleUnfavorite = (resourceSlug: string) => {
        if (!isOwnProfile || favoriteForm.processing) {
            return;
        }

        setPendingFavoriteSlug(resourceSlug);
        favoriteForm.transform(() => ({
            favorited: false,
        }));

        favoriteForm
            .optimistic((pageProps: ProfileShowPageProps) =>
                buildProfileFavoriteOptimisticProps(pageProps, resourceSlug),
            )
            .post(favoriteResource.url({ resource: resourceSlug }), {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setPendingFavoriteSlug((currentSlug) =>
                        currentSlug === resourceSlug ? null : currentSlug,
                    );
                },
            });
    };

    return (
        <>
            <Head
                title={
                    isOwnProfile ? '个人信息' : `${profileUser.name} 的个人信息`
                }
            />

            <div>
                <div
                    className={cn(
                        'overflow-hidden text-card-foreground',
                        profileSurfaceClass,
                    )}
                >
                    <div className="flex flex-col items-center gap-3.5 px-4 py-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-5 sm:text-left">
                        <Avatar className="size-16 shrink-0 bg-muted sm:size-20">
                            <AvatarImage
                                src={profileUser.avatar ?? undefined}
                                alt={profileUser.name}
                            />
                            <AvatarFallback className="text-base font-medium">
                                {getInitials(profileUser.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="w-full min-w-0 space-y-2.5">
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                        {profileUser.name}
                                    </h2>

                                    <Badge
                                        variant="outline"
                                        className="h-7 rounded-full border-primary/20 bg-primary/8 px-2.5 text-[12px] font-medium tracking-[0.01em] text-primary shadow-none dark:border-primary/24 dark:bg-primary/12"
                                    >
                                        <ShieldCheck className="size-3.5" />
                                        {profile.level}
                                    </Badge>
                                </div>

                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                    {profileUser.signature ?? '这个人还没有留下签名。'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={cn(
                                'min-w-0 px-2.5 py-3 sm:px-5',
                                profileSurfaceClass,
                            )}
                        >
                            <div className="flex min-h-[92px] flex-col items-center justify-center gap-1.5 text-center sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-left">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground sm:hidden">
                                    <ProfileStatIcon
                                        label={stat.label}
                                        className="size-3.5"
                                    />
                                </div>

                                <div className="min-w-0 space-y-0.5 sm:space-y-1">
                                    <p className="text-[11px] leading-4 tracking-[0.01em] text-muted-foreground sm:text-sm sm:leading-5">
                                        {stat.label}
                                    </p>
                                    <p className="text-lg leading-none font-semibold tracking-tight text-foreground sm:text-2xl">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-muted/70 text-muted-foreground sm:flex">
                                    <ProfileStatIcon
                                        label={stat.label}
                                        className="size-4.5"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 space-y-4">
                    <Tabs value={currentTab} className="gap-4">
                        <LayoutGroup id="profile-resource-tabs">
                            <TabsList
                                className={`w-full justify-start rounded-lg p-0.75 group-data-horizontal/tabs:h-10.5 ${contentPanelStripClass}`}
                                aria-label="个人资源分区"
                            >
                                {visibleTabItems.map((item) => (
                                <TabsTrigger
                                    key={item.value}
                                    value={item.value}
                                    asChild
                                    className={cn(
                                        contentPanelTabsTriggerClass,
                                        isTabTransitioning
                                            ? pendingTab === item.value
                                                ? '!text-foreground dark:!text-foreground'
                                            : '!text-foreground/60 dark:!text-muted-foreground'
                                            : null,
                                    )}
                                >
                                        <Link
                                            href={getProfileTabHref(item.value)}
                                            preserveScroll
                                            onMouseDown={() =>
                                                setPendingTab(item.value)
                                            }
                                            onTouchStart={() =>
                                                setPendingTab(item.value)
                                            }
                                            onClick={() =>
                                                setPendingTab(item.value)
                                            }
                                        >
                                            {pendingTab === item.value ? (
                                                <motion.span
                                                    layoutId="profile-resource-tabs-active-pill"
                                                    className="pointer-events-none absolute inset-0 rounded-md bg-primary/10 dark:bg-primary/14"
                                                    transition={{
                                                        bounce: 0.14,
                                                        duration: 0.2,
                                                        ease: 'easeOut',
                                                    }}
                                                />
                                            ) : null}

                                            <span className="relative z-10 inline-flex items-center gap-1.5">
                                                {item.value === 'submissions' ? (
                                                    <SquarePen className="size-4" />
                                                ) : item.value === 'favorites' ? (
                                                    <Heart className="size-4" />
                                                ) : (
                                                    <MessageCircle className="size-4" />
                                                )}
                                                <span>{item.label}</span>
                                            </span>
                                        </Link>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </LayoutGroup>

                        <TabsContent value={currentTab} className="mt-0">
                            {currentTab === 'comments' &&
                            currentComments.length > 0 ? (
                                <div className="grid gap-3">
                                    {currentComments.map((comment) => (
                                        <ProfileCommentCard
                                            key={comment.id}
                                            comment={comment}
                                        />
                                    ))}
                                </div>
                            ) : currentResources.length > 0 ? (
                                <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4">
                                    {currentResources.map((resource) => {
                                        const shouldShowFavoriteAction =
                                            currentTab === 'favorites' &&
                                            isOwnProfile;

                                        return (
                                            <ProfileResourceCard
                                                key={`${currentTab}-${resource.slug}`}
                                                {...resource}
                                                action={
                                                    shouldShowFavoriteAction ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-9 w-full rounded-lg border-border/80 bg-background px-3.5 text-sm shadow-none hover:bg-muted"
                                                            disabled={
                                                                favoriteForm.processing &&
                                                                pendingFavoriteSlug ===
                                                                    resource.slug
                                                            }
                                                            onClick={() =>
                                                                handleUnfavorite(
                                                                    resource.slug,
                                                                )
                                                            }
                                                        >
                                                            <Heart className="size-4" />
                                                            {favoriteForm.processing &&
                                                            pendingFavoriteSlug ===
                                                                resource.slug
                                                                ? '取消中...'
                                                                : '取消收藏'}
                                                        </Button>
                                                    ) : undefined
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border bg-card px-5 py-9 text-center shadow-xs">
                                    <p className="text-base font-medium text-foreground">
                                        {currentTabItem.emptyTitle}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {currentTabItem.emptyDescription}
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
