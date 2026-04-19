import type { ReactNode } from 'react';
import FrontSiteShell from '@/components/front-site-shell';

export default function FrontSiteLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <FrontSiteShell>{children}</FrontSiteShell>;
}
