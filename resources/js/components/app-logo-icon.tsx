import { usePage } from '@inertiajs/react';

export default function AppLogoIcon({
    className,
}: {
    className?: string;
}) {
    const { name, site } = usePage<{
        name: string;
        site: { logo: string | null };
    }>().props;

    if (!site.logo) {
        return null;
    }

    return (
        <img
            src={site.logo}
            alt={`${name} logo`}
            className={className}
        />
    );
}
