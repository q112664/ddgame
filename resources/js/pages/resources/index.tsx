import { Head, router, usePage } from '@inertiajs/react';
import { CalendarDays, Filter, Tags } from 'lucide-react';
import { ResourceCardGrid } from '@/components/resource-card-grid';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { index as resourcesIndex } from '@/routes/resources/index';
import type { PaginatedResources } from '@/types';

type FilterOption = {
    label: string;
    value: string;
};

type ResourceFilters = {
    category: string;
    sort: string;
};

type ResourceFilterQuery = Partial<{
    category: string | null;
    sort: string | null;
}>;

type ResourceFilterOptions = {
    categories: FilterOption[];
};

const allCategoriesValue = '__all__';

const timeSorts = [
    { label: '最新发布', value: 'latest' },
    { label: '最早发布', value: 'oldest' },
    { label: '最多浏览', value: 'views' },
];

function StaticFilterDropdown({
    label,
    icon: Icon,
    value,
    options,
    onValueChange,
}: {
    label: string;
    icon: typeof Filter;
    value: string;
    options: FilterOption[];
    onValueChange: (value: string) => void;
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    'h-10 w-full rounded-md border-border bg-background px-3 text-sm shadow-xs transition-all hover:bg-muted hover:text-foreground data-[state=open]:border-primary/40 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring/20 sm:w-56',
                )}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-4" />
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                        {label}
                    </span>
                    <SelectValue />
                </span>
            </SelectTrigger>
            <SelectContent
                align="start"
                position="popper"
                className="w-(--radix-select-trigger-width) min-w-(--radix-select-trigger-width) rounded-md border-border bg-popover p-0.5 text-popover-foreground shadow-md ring-1 ring-foreground/10 [&_[data-position=popper]]:h-auto [&_[data-position=popper]]:min-w-0"
            >
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value || allCategoriesValue}
                            className="rounded-sm py-1.5 pr-8 pl-2 text-sm text-popover-foreground transition-colors focus:bg-accent focus:text-accent-foreground"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default function ResourceIndex() {
    const { resources, filters, filterOptions } = usePage<{
        resources: PaginatedResources;
        filters: ResourceFilters;
        filterOptions: ResourceFilterOptions;
    }>().props;

    const categoryOptions = filterOptions.categories.map((category) => ({
        ...category,
        value: category.value || allCategoriesValue,
    }));

    const visitWithFilters = (nextFilters: ResourceFilterQuery) => {
        const query = {
            category: filters.category || null,
            sort: filters.sort === 'latest' ? null : filters.sort,
            ...nextFilters,
            page: null,
        };

        router.visit(resourcesIndex.url({ query }), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="资源" />

            <section className="mb-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <div className="border-b border-border/70 bg-muted/30 px-4 py-3 sm:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Filter className="size-4" />
                            </span>
                            <div>
                                <h1 className="text-base font-semibold text-foreground">
                                    筛选资源
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    当前为静态展示，后续可接入后端筛选查询。
                                </p>
                            </div>
                        </div>

                        <Badge
                            variant="outline"
                            className="h-7 rounded-md border-primary/20 bg-primary/10 px-3 text-primary"
                        >
                            共 {resources.data.length} 个资源
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:px-5">
                    <StaticFilterDropdown
                        label="分类筛选"
                        icon={Tags}
                        value={filters.category || allCategoriesValue}
                        options={categoryOptions}
                        onValueChange={(category) => {
                            visitWithFilters({
                                category:
                                    category === allCategoriesValue
                                        ? null
                                        : category,
                            });
                        }}
                    />
                    <StaticFilterDropdown
                        label="时间排序"
                        icon={CalendarDays}
                        value={filters.sort}
                        options={timeSorts}
                        onValueChange={(sort) => {
                            visitWithFilters({
                                sort: sort === 'latest' ? null : sort,
                            });
                        }}
                    />
                </div>
            </section>

            <ResourceCardGrid
                resources={resources.data}
                emptyTitle="还没有资源"
                emptyDescription="当前还没有可以展示的资源，后续发布后会出现在这里。"
            />
        </>
    );
}
