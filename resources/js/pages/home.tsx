import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Eye, Heart, Menu, MessageCircle, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';
import type { User } from '@/types';

const navItems = [
    {
        label: '概览',
        href: '#overview',
        description: '用于展示项目整体框架的首页区域。',
    },
    {
        label: '系统',
        href: '#systems',
        description: '用于呈现玩法模块与配套工具的区域。',
    },
    {
        label: '状态',
        href: '#status',
        description: '用于展示当前里程碑和进度的区域。',
    },
] as const;

const topicCards = [
    {
        title: '大家的 galgame 入坑历程是怎么样的（好奇）',
        href: '/topic/3342',
        thumbnail: 'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F972%2Fcover%2F33732c4c-6a10-468d-ba67-9047065f97d4.webp&w=384&q=75',
        category: '闲聊',
        accent: 'blue',
        tags: ['文章', '闲聊', '水贴'],
        stats: { views: '333', likes: '7', replies: '10' },
        author: '言语枫秋',
        time: '29 分钟前',
    },
    {
        title: '能尽量快且免费地下载几乎所有二次元资源的导航（4.5 更新备用提示）',
        href: '/topic/3340',
        thumbnail: 'https://t.shionlib.com/game/9897/cover/ac518d01-bc2a-4ba4-9c86-2638ba39dd70.webp',
        category: '动画',
        accent: 'pink',
        tags: ['音乐', '轻小说', '资源', '漫画', 'galgame'],
        stats: { views: '2.2w', likes: '168', replies: '65' },
        author: 'uoht',
        time: '1 小时前',
    },
    {
        title: '向站友们征集自兑鼠标垫图案',
        href: '/topic/3294',
        thumbnail: 'https://t.shionlib.com/game/11103/cover/ccadf9f4-906e-4de8-a24b-5794fc58a789.webp',
        category: '日常',
        accent: 'rose',
        tags: ['鼠标垫', 'galgame'],
        stats: { views: '290', likes: '1', replies: '2' },
        author: '战争之马',
        time: '5 小时前',
    },
    {
        title: 'B 站坠机的一年',
        href: '/topic/3335',
        thumbnail: 'https://t.shionlib.com/game/10817/cover/a7ec62ef-3941-4414-81b9-bddb2c79f547.webp',
        category: '日常',
        accent: 'pink',
        tags: ['哔哩哔哩'],
        stats: { views: '738', likes: '16', replies: '5' },
        author: 'aurora',
        time: '5 小时前',
    },
    {
        title: '不要相信这些发资源的 UP 主！和资源！新诈骗简介群诈骗我已经机',
        href: '/topic/3287',
        thumbnail: 'https://t.shionlib.com/game/1967/cover/e5d3b430-5dac-432c-a1c0-871fee13d0c0.webp',
        category: '投票话题',
        accent: 'indigo',
        tags: ['日常', '其它', '资源', '萌新', '警惕', '引流', '假药', '失信'],
        stats: { views: '1.0w', likes: '44', replies: '45' },
        author: '舞释',
        time: '16 小时前',
    },
    {
        title: '似乎注册的时候会有问题……',
        href: '/topic/3346',
        thumbnail: 'https://t.shionlib.com/game/1947/cover/ae6660ad-f3fd-410a-a7da-929dc9d6bbcf.webp',
        category: '其它',
        accent: 'green',
        tags: ['注册'],
        stats: { views: '129', likes: '1', replies: '0' },
        author: 'es_123_xk',
        time: '19 小时前',
    },
] as const;

const accentStyles = {
    blue: {
        category: 'bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20',
        tag: 'bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-blue-400/20',
    },
    pink: {
        category: 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/15 dark:text-fuchsia-100 dark:ring-fuchsia-400/20',
        tag: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200/70 dark:bg-fuchsia-500/10 dark:text-fuchsia-100 dark:ring-fuchsia-400/20',
    },
    rose: {
        category: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-100 dark:ring-rose-400/20',
        tag: 'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-500/10 dark:text-rose-100 dark:ring-rose-400/20',
    },
    indigo: {
        category: 'bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-100 dark:ring-indigo-400/20',
        tag: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-400/20',
    },
    green: {
        category: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-400/20',
        tag: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-400/20',
    },
} as const;

type TopicCard = (typeof topicCards)[number];

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
    title,
    href,
    thumbnail,
    category,
    accent,
    tags,
    stats,
    author,
    time,
}: TopicCard) {
    const styles = accentStyles[accent];
    const getInitials = useInitials();
    const [overlayStrength, setOverlayStrength] = useState(0.42);

    const handleThumbnailLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;
        const canvas = document.createElement('canvas');
        const sampleSize = 24;

        canvas.width = sampleSize;
        canvas.height = sampleSize;

        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (!context) {
            return;
        }

        try {
            context.drawImage(image, 0, 0, sampleSize, sampleSize);
            const { data } = context.getImageData(0, 0, sampleSize, sampleSize);

            let luminanceTotal = 0;
            const pixelCount = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i] / 255;
                const green = data[i + 1] / 255;
                const blue = data[i + 2] / 255;
                luminanceTotal += 0.2126 * red + 0.7152 * green + 0.0722 * blue;
            }

            const averageLuminance = luminanceTotal / pixelCount;
            const dynamicStrength = 0.24 + averageLuminance * 0.34;
            setOverlayStrength(Number(dynamicStrength.toFixed(3)));
        } catch {
            setOverlayStrength(0.42);
        }
    };

    const midStrength = Math.max(0, overlayStrength - 0.16);
    const upperStrength = Math.max(0, overlayStrength - 0.3);
    const topStrength = Math.max(0, overlayStrength - 0.38);

    return (
        <a
            href={href}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <div className="relative h-48 overflow-hidden leading-none">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    onLoad={handleThumbnailLoad}
                    className="block h-full w-full object-cover"
                />

                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,${overlayStrength}) 0%, rgba(0,0,0,${midStrength}) 28%, rgba(0,0,0,${upperStrength}) 52%, rgba(0,0,0,${topStrength}) 72%, transparent 100%)`,
                    }}
                />

                <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-white/95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]">
                        <span className="inline-flex items-center gap-1.5">
                            <Eye className="size-3.5" />
                            {stats.views}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Heart className="size-3.5" />
                            {stats.likes}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <MessageCircle className="size-3.5" />
                            {stats.replies}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="space-y-3">
                    <h2 className="line-clamp-2 min-h-[3rem] text-[1.05rem] leading-6 font-medium text-foreground">
                        {title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5">
                        <TopicBadge className={styles.category}>{category}</TopicBadge>
                        {tags.map((tag) => (
                            <TopicBadge
                                key={tag}
                                className={styles.tag}
                            >
                                {tag}
                            </TopicBadge>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center gap-2.5 pt-2">
                        <Avatar className="size-7 ring-1 ring-border">
                            <AvatarImage alt={author} />
                            <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                                {getInitials(author)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
                            <span className="font-medium text-foreground/85">{author}</span>
                            <span>·</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}

function ThemeToggleButton() {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggle = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const nextAppearance: Appearance =
            appearance === 'system' ? (isDark ? 'light' : 'dark') : isDark ? 'light' : 'dark';

        updateAppearance(nextAppearance);
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={handleToggle}
        >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">切换主题</span>
        </Button>
    );
}

function UserDropdownMenu({
    user,
}: {
    user: User;
}) {
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="inline-flex rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <span className="sr-only">打开用户菜单</span>
                    <Avatar>
                        <AvatarImage
                            src={user.avatar}
                            alt={user.name}
                        />
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-56"
            >
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Home() {
    const {
        auth: { user },
    } = usePage<{ auth: { user: User | null } }>().props;

    return (
        <>
            <Head title="首页" />

            <div className="min-h-screen bg-background">
                <header className="border-b border-border bg-card">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                        <div className="flex items-center gap-2.5">
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Menu className="size-5" />
                                            <span className="sr-only">
                                                打开导航菜单
                                            </span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        showCloseButton={false}
                                        className="gap-0 p-0"
                                    >
                                        <SheetHeader className="gap-0 border-b p-0">
                                            <div className="flex h-16 items-center justify-between px-5">
                                                <SheetTitle className="text-base font-semibold tracking-[0.18em]">
                                                    ACGzone
                                                </SheetTitle>
                                                <SheetClose asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="shrink-0"
                                                    >
                                                        <X className="size-4" />
                                                        <span className="sr-only">
                                                            关闭菜单
                                                        </span>
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        </SheetHeader>

                                        <div className="flex flex-1 flex-col">
                                            <nav className="flex flex-col gap-1 px-3 py-4">
                                                {navItems.map((item) => (
                                                    <SheetClose key={item.label} asChild>
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            className="h-11 w-full justify-start rounded-xl px-4 text-[15px] font-medium"
                                                        >
                                                            <a href={item.href}>
                                                                {item.label}
                                                            </a>
                                                        </Button>
                                                    </SheetClose>
                                                ))}
                                            </nav>

                                            <SheetFooter className="mt-auto gap-3 p-3 pt-0">
                                                <Separator />
                                                {user ? (
                                                    <SheetClose asChild>
                                                        <Button
                                                            asChild
                                                            className="h-11 w-full rounded-xl"
                                                        >
                                                            <Link href={dashboard()}>
                                                                控制台
                                                                <ArrowRight />
                                                            </Link>
                                                        </Button>
                                                    </SheetClose>
                                                ) : (
                                                    <>
                                                        <SheetClose asChild>
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                className="h-11 w-full rounded-xl"
                                                            >
                                                                <Link href={login()}>
                                                                    登录
                                                                </Link>
                                                            </Button>
                                                        </SheetClose>
                                                        <SheetClose asChild>
                                                            <Button
                                                                asChild
                                                                className="h-11 w-full rounded-xl"
                                                            >
                                                                <Link href={register()}>
                                                                    注册
                                                                </Link>
                                                            </Button>
                                                        </SheetClose>
                                                    </>
                                                )}
                                            </SheetFooter>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <Link href={home()} className="font-semibold tracking-[0.18em]">
                                ACGzone
                            </Link>

                            <NavigationMenu
                                viewport={false}
                                className="hidden md:flex"
                            >
                                <NavigationMenuList>
                                    {navItems.map((item) => (
                                        <NavigationMenuItem key={item.label}>
                                            <NavigationMenuLink
                                                asChild
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                <a href={item.href}>{item.label}</a>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                            <ThemeToggleButton />
                            {user ? (
                                <UserDropdownMenu user={user} />
                            ) : (
                                <>
                                    <Button asChild>
                                        <Link href={login()}>登录</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>注册</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:hidden">
                            <ThemeToggleButton />
                            {user && <UserDropdownMenu user={user} />}
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-6xl px-2 py-4 sm:px-4 sm:py-6">
                    <section
                        id="overview"
                        className="space-y-4"
                    >
                        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {topicCards.map((card) => (
                                <TopicCardItem
                                    key={card.title}
                                    {...card}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border bg-card/60">
                    <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
                        <span>© {new Date().getFullYear()} ACGzone</span>
                        <span>All rights reserved.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
