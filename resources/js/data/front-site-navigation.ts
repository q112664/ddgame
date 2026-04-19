import { home } from '@/routes/index';

export const FRONT_SITE_BRAND_NAME = 'ACGzone';

export const FRONT_SITE_NAV_ITEMS = [
    {
        label: '概览',
        hash: '#overview',
        description: '用于展示项目整体框架的首页区域。',
    },
    {
        label: '系统',
        hash: '#systems',
        description: '用于呈现玩法模块与配套工具的区域。',
    },
    {
        label: '状态',
        hash: '#status',
        description: '用于展示当前里程碑和进度的区域。',
    },
] as const;

export function getFrontSiteSectionHref(
    hash: (typeof FRONT_SITE_NAV_ITEMS)[number]['hash'],
): string {
    return `${home.url()}${hash}`;
}
