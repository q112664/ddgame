import type { FrontendResource } from '@/types';

export type ResourceFavoritePageProps = {
    resource: FrontendResource | null;
};

export type ResourceFavoriteOptimisticInput = {
    resourceSlug: string;
    favorited: boolean;
};

export function buildResourceFavoriteOptimisticProps<
    TPageProps extends ResourceFavoritePageProps,
>(
    pageProps: TPageProps,
    { resourceSlug, favorited }: ResourceFavoriteOptimisticInput,
): Partial<TPageProps> | void {
    const resource = pageProps.resource;

    if (resource === null || resource.slug !== resourceSlug) {
        return;
    }

    const currentFavorited = resource.favoritedByCurrentUser ?? false;

    if (currentFavorited === favorited) {
        return;
    }

    const currentFavoriteCount = resource.favoriteCount ?? 0;
    const nextFavoriteCount = Math.max(
        0,
        currentFavoriteCount + (favorited ? 1 : -1),
    );

    return {
        resource: {
            ...resource,
            favoritedByCurrentUser: favorited,
            favoriteCount: nextFavoriteCount,
        },
    } as Partial<TPageProps>;
}
