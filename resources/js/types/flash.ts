export type FavoriteUpdateFlash = {
    resourceSlug: string;
    favorited: boolean;
    favoriteCount: number;
};

export type Flash = {
    favoriteUpdate: FavoriteUpdateFlash | null;
};
