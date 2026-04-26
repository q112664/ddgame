import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import FrontSettingsLayout from '@/layouts/front-settings-layout';
import FrontSiteLayout from '@/layouts/front-site-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Set the stored appearance before React renders, avoiding icon/theme flicker.
initializeTheme();

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'home':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('resources/'):
                return FrontSiteLayout;
            case name.startsWith('profile/'):
                return FrontSiteLayout;
            case name.startsWith('settings/'):
                return [FrontSiteLayout, FrontSettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
