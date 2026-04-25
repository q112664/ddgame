import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import FrontSiteShell from '@/components/front-site-shell';
import { home } from '@/routes/index';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name, site } = usePage<{
        name: string;
        site: { logo: string | null };
    }>().props;

    return (
        <FrontSiteShell>
            <div className="flex min-h-[70vh] items-center justify-center py-6 sm:py-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8 rounded-2xl border border-border/60 bg-card p-6 shadow-md sm:p-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                {site.logo ? (
                                    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                        <AppLogoIcon className="size-9 object-contain" />
                                    </div>
                                ) : (
                                    <span>{name}</span>
                                )}
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">
                                    {title}
                                </h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </FrontSiteShell>
    );
}
