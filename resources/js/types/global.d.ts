import type { Auth } from '@/types/auth';
import type { Flash } from '@/types/flash';
import type { Site } from '@/types/site';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            site: Site;
            auth: Auth;
            flash: Flash;
            sidebarOpen: boolean;
        };
    }
}
