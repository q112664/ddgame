import type { ResourceCategoryColor } from '@/lib/resource-category-colors';

export type FrontendResourceCategory = {
    name: string;
    color: ResourceCategoryColor;
};

export type FrontendResource = {
    slug: string;
    thumbnail: string;
    title: string;
    subtitle?: string | null;
    categories: FrontendResourceCategory[];
    tags: string[];
    author: string;
    authorAvatar: string | null;
    publishedAt: string;
    viewCount?: number;
    content?: string | null;
    favoriteCount?: number;
    favoritedByCurrentUser?: boolean;
};
