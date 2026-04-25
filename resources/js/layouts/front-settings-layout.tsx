import { Link } from '@inertiajs/react';
import { Palette, ShieldCheck, UserRound } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUrl } from '@/hooks/use-current-url';
import {
    contentPanelClass,
    contentPanelStripClass,
    contentPanelTabsTriggerClass,
} from '@/lib/content-panel';
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
    const activeValue = toUrl(activeTab?.href ?? navItems[0].href);
    const [pendingValue, setPendingValue] = useState(activeValue);

    useEffect(() => {
        setPendingValue(activeValue);
    }, [activeValue]);

    return (
        <div className="space-y-6 py-4">
            <Tabs value={pendingValue} className="gap-0">
                <LayoutGroup id="front-settings-tabs">
                    <TabsList
                        className={`w-full justify-start rounded-lg p-0.75 group-data-horizontal/tabs:h-10.5 ${contentPanelStripClass}`}
                        aria-label="前台设置导航"
                    >
                        {navItems.map((item) => {
                            const itemValue = toUrl(item.href);

                            return (
                                <TabsTrigger
                                    key={itemValue}
                                    value={itemValue}
                                    asChild
                                    className={contentPanelTabsTriggerClass}
                                >
                                    <Link
                                        href={item.href}
                                        prefetch={['hover', 'click']}
                                        onMouseDown={() =>
                                            setPendingValue(itemValue)
                                        }
                                        onTouchStart={() =>
                                            setPendingValue(itemValue)
                                        }
                                        onClick={() => setPendingValue(itemValue)}
                                    >
                                        {pendingValue === itemValue ? (
                                            <motion.span
                                                layoutId="front-settings-tabs-active-pill"
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
                                            <span>{item.title}</span>
                                        </span>
                                    </Link>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </LayoutGroup>
            </Tabs>

            <div
                className={`${contentPanelClass} p-5 sm:p-6 lg:p-8`}
            >
                {children}
            </div>
        </div>
    );
}
