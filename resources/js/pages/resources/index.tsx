import { Head, usePage } from '@inertiajs/react';
import FrontSiteShell from '@/components/front-site-shell';
import { ResourceCardGrid } from '@/components/resource-card-grid';
import type { FrontendResource } from '@/types';

export default function ResourceIndex() {
    const { resources } = usePage<{ resources: FrontendResource[] }>().props;

    return (
        <>
            <Head title="资源" />

            <FrontSiteShell>
                <div className="space-y-4">
                    <section className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-primary">
                                    资源
                                </p>
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    全部资源
                                </h1>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    当前收录的资源会按发布时间倒序展示，方便你直接浏览最新内容。
                                </p>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                共 {resources.length} 个资源
                            </p>
                        </div>
                    </section>

                    <ResourceCardGrid
                        resources={resources}
                        emptyTitle="还没有资源"
                        emptyDescription="当前还没有可以展示的资源，后续发布后会出现在这里。"
                    />
                </div>
            </FrontSiteShell>
        </>
    );
}
