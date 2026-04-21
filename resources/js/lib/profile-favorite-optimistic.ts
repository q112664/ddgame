import type { FrontendResource } from '@/types';

type ProfileCollectionKey = 'submissions' | 'favorites';

type ProfileFavoriteStat = {
    label: string;
    value: number;
};

type ProfileFavoritePageProps = {
    collections: Partial<Record<ProfileCollectionKey, FrontendResource[]>>;
    stats: ProfileFavoriteStat[];
    isOwnProfile: boolean;
};

export function buildProfileFavoriteOptimisticProps<
    TPageProps extends ProfileFavoritePageProps,
>(pageProps: TPageProps, resourceSlug: string): Partial<TPageProps> | void {
    if (!pageProps.isOwnProfile) {
        return;
    }

    const favorites = pageProps.collections.favorites ?? [];

    if (!favorites.some((resource) => resource.slug === resourceSlug)) {
        return;
    }

    return {
        collections: {
            ...pageProps.collections,
            favorites: favorites.filter((resource) => resource.slug !== resourceSlug),
        },
        stats: pageProps.stats.map((stat) =>
            stat.label === '收藏数量'
                ? {
                      ...stat,
                      value: Math.max(0, stat.value - 1),
                  }
                : stat,
        ),
    } as Partial<TPageProps>;
}
