export type ResourceCategoryColor = 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
export type ResourceCategoryColorMap = Partial<Record<string, ResourceCategoryColor>>;

const categoryBadgeToneClasses: Record<ResourceCategoryColor, string> = {
    sky: 'border-sky-500/25 bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-400/20',
    emerald:
        'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/20',
    amber: 'border-amber-500/25 bg-amber-500/12 text-amber-700 ring-amber-500/20 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/20',
    rose: 'border-rose-500/25 bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/20',
    violet:
        'border-violet-500/25 bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-400/20',
    slate: 'border-slate-400/30 bg-slate-500/10 text-slate-700 ring-slate-400/20 dark:border-slate-500/40 dark:bg-slate-500/15 dark:text-slate-200 dark:ring-slate-400/20',
};

export function getResourceCategoryBadgeToneClass(color: ResourceCategoryColor): string {
    return categoryBadgeToneClasses[color];
}

export function resolveResourceCategoryColor(
    category: string,
    fallbackColor: ResourceCategoryColor,
    categoryColors?: ResourceCategoryColorMap,
): ResourceCategoryColor {
    return categoryColors?.[category] ?? fallbackColor;
}
