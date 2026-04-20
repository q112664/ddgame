import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, site } = usePage<{ name: string; site: { logo: string | null } }>().props;

    return (
        <>
            {site.logo ? (
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <AppLogoIcon className="size-5 object-contain" />
                </div>
            ) : null}
            <div className={`${site.logo ? 'ml-1' : ''} grid flex-1 text-left text-sm`}>
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
