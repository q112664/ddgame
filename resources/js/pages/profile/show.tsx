import { Head, Link, useForm, useRemember } from '@inertiajs/react';
import {
    Heart,
    MessageCircle,
    ShieldCheck,
    SquarePen,
} from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { buildProfileFavoriteOptimisticProps } from '@/lib/profile-favorite-optimistic';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { cn } from '@/lib/utils';
import {
    favorite as favoriteResource,
    show as showResource,
} from '@/routes/resources/index';
import type { FrontendResource } from '@/types';

type ProfileSummary = {
    joinedAt: string | null;
    level: string;
};

type ProfileStat = {
    label: string;
    value: number;
};

type ProfileTabKey = 'submissions' | 'favorites' | 'comments';
type ProfileCollectionKey = 'submissions' | 'favorites';

type ProfileUser = {
    id: number;
    name: string;
    avatar: string | null;
    signature: string | null;
};

type ProfileCollections = Partial<
    Record<ProfileCollectionKey, FrontendResource[]>
>;

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
        emptyTitle: '评论功能即将上线',
        emptyDescription:
            '这里先预留评论区位置，后续会接入真实评论内容和互动能力。',
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

function ProfileResourceCard({
    slug,
    title,
    thumbnail,
    categories,
    subtitle,
    action,
}: FrontendResource & { action?: ReactNode }) {
    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Link
                href={showResource({ slug })}
                className="flex flex-1 cursor-pointer flex-col transition-all duration-200 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.97] dark:hover:bg-primary/10"
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

const profileSurfaceClass = 'rounded-xl border border-border bg-card shadow-xs';

export default function ProfileShow({
    profileUser,
    profile,
    stats,
    collections,
    availableTabs,
    isOwnProfile,
}: {
    profileUser: ProfileUser;
    profile: ProfileSummary;
    stats: ProfileStat[];
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
    const [activeTab, setActiveTab] = useRemember<ProfileTabKey>(
        'submissions',
        'profile-show-active-tab',
    );
    const visibleTabItems = profileTabItems.filter((item) =>
        availableTabs.includes(item.value),
    );
    const currentTab = visibleTabItems.some((item) => item.value === activeTab)
        ? activeTab
        : (visibleTabItems[0]?.value ?? 'submissions');

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

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={cn(
                                'px-4 py-3 sm:px-5',
                                profileSurfaceClass,
                            )}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex size-10 items-center justify-center rounded-full bg-muted/70 text-muted-foreground">
                                    {stat.label === '投稿数量' ? (
                                        <SquarePen className="size-4.5" />
                                    ) : stat.label === '收藏数量' ? (
                                        <Heart className="size-4.5" />
                                    ) : (
                                        <MessageCircle className="size-4.5" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 space-y-4">
                    <Tabs
                        value={currentTab}
                        onValueChange={(value) =>
                            setActiveTab(value as ProfileTabKey)
                        }
                        className="gap-4"
                    >
                        <LayoutGroup id="profile-resource-tabs">
                            <TabsList
                                className="w-full justify-start rounded-lg p-0.75 group-data-horizontal/tabs:h-10.5 dark:bg-white/[0.045]"
                                aria-label="个人资源分区"
                            >
                                {visibleTabItems.map((item) => (
                                    <TabsTrigger
                                        key={item.value}
                                        value={item.value}
                                        className="rounded-md px-4.25 text-[14px] data-active:border-transparent data-active:bg-transparent group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent dark:data-active:text-foreground"
                                    >
                                        {currentTab === item.value ? (
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
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </LayoutGroup>

                        {visibleTabItems.map((item) => {
                            const resources =
                                item.value === 'comments'
                                    ? []
                                    : (collections[item.value] ?? []);

                            return (
                                <TabsContent
                                    key={item.value}
                                    value={item.value}
                                    className="mt-0"
                                >
                                    {resources.length > 0 ? (
                                        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
                                            {resources.map((resource) => {
                                                const shouldShowFavoriteAction =
                                                    item.value === 'favorites' &&
                                                    isOwnProfile;

                                                return (
                                                    <ProfileResourceCard
                                                        key={`${item.value}-${resource.slug}`}
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
                                        <div
                                            className="rounded-xl border border-dashed border-border bg-card px-5 py-9 text-center shadow-xs"
                                        >
                                            <p className="text-base font-medium text-foreground">
                                                {item.emptyTitle}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {item.emptyDescription}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
        </>
    );
}
