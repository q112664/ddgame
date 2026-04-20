import type { Auth } from '@/types/auth';
import type { Site } from '@/types/site';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            site: Site;
            auth: Auth;
            sidebarOpen: boolean;
        };
    }
}
