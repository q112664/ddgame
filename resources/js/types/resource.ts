import type { ResourceCategoryColor } from '@/lib/resource-category-colors';

export type FrontendResourceCategory = {
    name: string;
    color: ResourceCategoryColor;
};

export type FrontendResource = {
    slug: string;
    thumbnail: string;
    title: string;
    categories: FrontendResourceCategory[];
    tags: string[];
    author: string;
    authorAvatar: string | null;
    publishedAt: string;
};
