import { Link } from '@inertiajs/react';
import { Palette, ShieldCheck, UserRound } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance/index';
import { edit as editProfile } from '@/routes/profile/index';
import { edit as editSecurity } from '@/routes/security/index';

const navItems = [
    {
        title: '个人资料',
        href: editProfile(),
        icon: UserRound,
    },
    {
        title: '安全',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: '外观',
        href: editAppearance(),
        icon: Palette,
    },
] as const;

export default function FrontSettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const activeTab = navItems.find((item) => isCurrentOrParentUrl(item.href));

    return (
        <div className="space-y-6 px-1 py-4">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    编辑设置
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    你可以在此页面管理你的个人信息和站点设置。
                </p>
            </header>

            <Tabs
                value={toUrl(activeTab?.href ?? navItems[0].href)}
                className="gap-0"
            >
                <TabsList
                    className="h-auto w-full justify-start"
                    aria-label="前台设置导航"
                >
                    {navItems.map((item) => (
                        <TabsTrigger
                            key={toUrl(item.href)}
                            value={toUrl(item.href)}
                            asChild
                            className="px-5"
                        >
                            <Link
                                href={item.href}
                                className="inline-flex items-center gap-1.5"
                            >
                                <item.icon className="size-4" />
                                <span>{item.title}</span>
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
                {children}
            </div>
        </div>
    );
}
