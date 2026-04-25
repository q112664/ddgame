import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { home, login, register } from '@/routes/index';
import { edit as editProfile } from '@/routes/profile/index';
import type { Site, SiteNavigationItem } from '@/types';
import type { User } from '@/types';
import { UserMenuContent } from './user-menu-content';

function isExternalUrl(url: string): boolean {
    return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function SiteNavigationLink({
    item,
    className,
    children,
}: {
    item: SiteNavigationItem;
    className?: string;
    children: ReactNode;
}) {
    if (item.openInNewTab || isExternalUrl(item.url)) {
        return (
            <a
                href={item.url}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={isExternalUrl(item.url) ? 'noopener noreferrer' : undefined}
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={item.url} className={className}>
            {children}
        </Link>
    );
}

function ThemeToggleButton() {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggle = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const nextAppearance: Appearance =
            appearance === 'system'
                ? isDark
                    ? 'light'
                    : 'dark'
                : isDark
                  ? 'light'
                  : 'dark';

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
            <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">切换主题</span>
        </Button>
    );
}

function UserDropdownMenu({ user }: { user: User }) {
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="inline-flex rounded-full transition-opacity outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <span className="sr-only">打开用户菜单</span>
                    <Avatar className="bg-muted">
                        <AvatarImage
                            src={user.avatar ?? undefined}
                            alt={user.name}
                        />
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function FrontSiteShell({ children }: { children: ReactNode }) {
    const {
        name,
        site,
        auth: { user },
    } = usePage<{
        name: string;
        site: Site;
        auth: { user: User | null };
    }>().props;

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-card/85 backdrop-blur-xl [body[data-scroll-locked]_&]:pr-[var(--removed-body-scroll-bar-size,0px)]">
                <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4">
                    <div className="flex items-center gap-2.5">
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
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
                                                {name}
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
                                            {site.navigation.primary.map(
                                                (item) => (
                                                    <SheetClose
                                                        key={`${item.label}-${item.url}`}
                                                        asChild
                                                    >
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            className="h-11 w-full justify-start rounded-xl px-4 text-[15px] font-medium"
                                                        >
                                                            <SiteNavigationLink
                                                                item={item}
                                                            >
                                                                {item.label}
                                                            </SiteNavigationLink>
                                                        </Button>
                                                    </SheetClose>
                                                ),
                                            )}
                                        </nav>

                                        <SheetFooter className="mt-auto gap-3 p-3 pt-0">
                                            <Separator />
                                            {user ? (
                                                <SheetClose asChild>
                                                    <Button
                                                        asChild
                                                        className="h-11 w-full rounded-xl"
                                                    >
                                                        <Link
                                                            href={editProfile()}
                                                        >
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
                                                            <Link
                                                                href={login()}
                                                            >
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
                                                                href={register()}
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
                            href={home()}
                            className="inline-flex items-center gap-2 font-semibold tracking-[0.18em]"
                        >
                            {site.logo ? (
                                <AppLogoIcon className="size-5 rounded object-contain" />
                            ) : null}
                            <span>{name}</span>
                        </Link>

                        <NavigationMenu
                            viewport={false}
                            className="hidden md:flex"
                        >
                            <NavigationMenuList>
                                {site.navigation.primary.map((item) => (
                                    <NavigationMenuItem
                                        key={`${item.label}-${item.url}`}
                                    >
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <SiteNavigationLink item={item}>
                                                {item.label}
                                            </SiteNavigationLink>
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
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-foreground"
                                >
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

            <main className="mx-auto w-full max-w-[1280px] px-2 pt-18 pb-4 sm:px-4 sm:pt-20 sm:pb-6">
                {children}
            </main>

            <footer className="border-t border-border bg-card/60">
                <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 text-sm text-muted-foreground">
                    <span>
                        © {new Date().getFullYear()} {name}
                    </span>
                    <span>All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
