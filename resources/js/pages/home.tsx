import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import { formatResourceRelativeTime } from '@/lib/resource-time';
import { cn } from '@/lib/utils';
import { edit as editProfile } from '@/routes/profile/index';
import { show as showResource } from '@/routes/resources/index';
import type { FrontendResource, User } from '@/types';

const HOME_HREF = '/';
const LOGIN_HREF = '/login';
const REGISTER_HREF = '/register';

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

const tagToneClasses = [
    'bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-blue-400/20',
    'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200/70 dark:bg-fuchsia-500/10 dark:text-fuchsia-100 dark:ring-fuchsia-400/20',
    'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-500/10 dark:text-rose-100 dark:ring-rose-400/20',
    'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-400/20',
    'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-400/20',
] as const;

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
    category,
    categoryColor,
    tags,
    author,
    publishedAt,
}: FrontendResource) {
    const getInitials = useInitials();
    const relativeTime = formatResourceRelativeTime(publishedAt);

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
                        <TopicBadge className={getResourceCategoryBadgeToneClass(categoryColor)}>
                            {category}
                        </TopicBadge>

                        {tags.map((tag, index) => (
                            <TopicBadge
                                key={tag}
                                className={tagToneClasses[index % tagToneClasses.length]}
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
                            <span>{relativeTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
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
                    <Avatar className="bg-muted">
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
        resources,
    } = usePage<{ auth: { user: User | null }; resources: FrontendResource[] }>().props;

    return (
        <>
            <Head title="首页" />

            <div className="min-h-screen bg-background">
                <header className="border-b border-border bg-card">
                    <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4">
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
                                            <div className="flex h-14 items-center justify-between px-5">
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
                                                            <Link href={editProfile()}>
                                                                账号设置
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
                                                                <Link href={LOGIN_HREF}>
                                                                    登录
                                                                </Link>
                                                            </Button>
                                                        </SheetClose>
                                                        <SheetClose asChild>
                                                            <Button
                                                                asChild
                                                                className="h-11 w-full rounded-xl"
                                                            >
                                                                <Link href={REGISTER_HREF}>
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

                            <Link href={HOME_HREF} className="font-semibold tracking-[0.18em]">
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
                                        <Link href={LOGIN_HREF}>登录</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={REGISTER_HREF}>注册</Link>
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

                <main className="mx-auto w-full max-w-[1280px] px-2 py-4 sm:px-4 sm:py-6">
                    <section
                        id="overview"
                        className="space-y-4"
                    >
                        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {resources.map((resource) => <TopicCardItem key={resource.slug} {...resource} />)}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border bg-card/60">
                    <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 text-sm text-muted-foreground">
                        <span>© {new Date().getFullYear()} ACGzone</span>
                        <span>All rights reserved.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
