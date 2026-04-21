import { Head, usePage } from '@inertiajs/react';
import FrontSiteShell from '@/components/front-site-shell';
import {
    ResourceCardGrid,
    ResourceCategoryBadge,
} from '@/components/resource-card-grid';
import { getResourceCategoryBadgeToneClass } from '@/lib/resource-category-colors';
import type { ResourceCategoryColor } from '@/lib/resource-category-colors';
import type { FrontendResource } from '@/types';

type FrontendCategoryPage = {
    name: string;
    slug: string;
    color: ResourceCategoryColor;
    resourceCount: number;
};

export default function CategoryShow() {
    const { category, resources } = usePage<{
        category: FrontendCategoryPage;
        resources: FrontendResource[];
    }>().props;

    return (
        <>
            <Head title={`${category.name} 分类`} />

            <FrontSiteShell>
                <div className="space-y-4">
                    <section className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                        {category.name}
                                    </h1>
                                    <ResourceCategoryBadge
                                        className={getResourceCategoryBadgeToneClass(
                                            category.color,
                                        )}
                                    >
                                        分类
                                    </ResourceCategoryBadge>
                                </div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    当前页面展示“{category.name}”分类下的全部资源。
                                </p>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                共 {category.resourceCount} 个资源
                            </p>
                        </div>
                    </section>

                    <ResourceCardGrid
                        resources={resources}
                        emptyTitle={`${category.name} 分类下还没有资源`}
                        emptyDescription="这个分类已经创建完成，但目前还没有资源被归入这里。"
                    />
                </div>
            </FrontSiteShell>
        </>
    );
}
