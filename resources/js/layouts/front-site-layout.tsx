import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
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
import { edit as editProfile } from '@/routes/profile/index';
import type { User } from '@/types';

const HOME_HREF = '/';
const LOGIN_HREF = '/login';
const REGISTER_HREF = '/register';

const navItems = [
    {
        label: '概览',
        href: `${HOME_HREF}#overview`,
    },
    {
        label: '系统',
        href: `${HOME_HREF}#systems`,
    },
    {
        label: '状态',
        href: `${HOME_HREF}#status`,
    },
] as const;

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

export default function FrontSiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const {
        auth: { user },
    } = usePage<{ auth: { user: User | null } }>().props;

    return (
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
                                                <SheetClose
                                                    key={item.label}
                                                    asChild
                                                >
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
                                                            <Link
                                                                href={REGISTER_HREF}
                                                            >
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

                        <Link
                            href={HOME_HREF}
                            className="font-semibold tracking-[0.18em]"
                        >
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
                {children}
            </main>

            <footer className="border-t border-border bg-card/60">
                <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 text-sm text-muted-foreground">
                    <span>© {new Date().getFullYear()} ACGzone</span>
                    <span>All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
