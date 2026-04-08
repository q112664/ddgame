import type { ResourceCategoryColor } from '@/lib/resource-category-colors';

export type FrontendResource = {
    slug: string;
    thumbnail: string;
    title: string;
    category: string;
    categoryColor: ResourceCategoryColor;
    tags: string[];
    author: string;
    publishedAt: string;
};
