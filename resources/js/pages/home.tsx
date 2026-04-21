import { Head, Link } from '@inertiajs/react';
import FrontSiteShell from '@/components/front-site-shell';
import { Button } from '@/components/ui/button';
import { index as showResources } from '@/routes/resources/index';

export default function Home() {
    return (
        <>
            <Head title="首页" />

            <FrontSiteShell>
                <div className="space-y-4">
                    <section
                        id="overview"
                        className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6"
                    >
                        <div className="max-w-2xl space-y-3">
                            <p className="text-sm font-medium text-primary">
                                首页
                            </p>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                首页结构已拆分，资源内容现在单独归档展示
                            </h1>
                            <p className="text-sm leading-6 text-muted-foreground sm:text-[15px]">
                                当前首页先保留轻量结构占位，资源总列表已经迁到独立页面，后续可以在这里继续补欢迎区、推荐位或站点说明。
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href={showResources()}>
                                        进入资源页
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section
                        id="systems"
                        className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-foreground">
                                系统
                            </h2>
                            <p className="text-sm leading-6 text-muted-foreground">
                                这里预留给后续的系统说明、使用方式或站点能力介绍，当前先保留稳定锚点结构。
                            </p>
                        </div>
                    </section>

                    <section
                        id="status"
                        className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-foreground">
                                状态
                            </h2>
                            <p className="text-sm leading-6 text-muted-foreground">
                                这里预留给后续的更新状态、运行状态或公告信息，当前先保留稳定锚点结构。
                            </p>
                        </div>
                    </section>
                </div>
            </FrontSiteShell>
        </>
    );
}
