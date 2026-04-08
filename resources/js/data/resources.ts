import type { ResourceCategoryColor } from '@/lib/resource-category-colors';

export type ResourceAccent = 'blue' | 'pink' | 'rose' | 'indigo' | 'green';

export type ResourceEntry = {
    id: string;
    title: string;
    subtitle: string;
    originalTitle: string;
    thumbnail: string;
    category: string;
    categoryColor: ResourceCategoryColor;
    accent: ResourceAccent;
    platform: string;
    tags: string[];
    stats: {
        views: string;
        downloads: string;
        likes: string;
        comments: string;
    };
    author: string;
    time: string;
    releaseDate: string;
    summary: string;
    details: string[];
    introduction: string[];
    staff: {
        role: string;
        name: string;
    }[];
    links: {
        label: string;
        href: string;
    }[];
};

export const resources: ResourceEntry[] = [
    {
        id: '10662',
        title: '告别回忆 双想 Break out of my shell',
        subtitle: 'MAGES. · Shionlib 本月新作',
        originalTitle: '告别回忆 双想 Break out of my shell',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F10662%2Fcover%2F76ab00d4-c987-4cdf-90a6-041e14f7a1b4.webp&w=3840&q=75',
        category: '本月新作',
        categoryColor: 'sky',
        accent: 'blue',
        platform: 'PC',
        tags: ['Galgame', '全年龄', 'NTR', 'FD', '校园'],
        stats: { views: '18.4k', downloads: '5.2k', likes: '2.1k', comments: '386' },
        author: 'MAGES.',
        time: '本月新作',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页展示的本月新作条目之一，来源为游戏详情页的真实简介与标签信息。',
        details: ['Galgame', '全年龄', 'NTR'],
        introduction: [
            '踏上各自道路的女主角们。在全新的环境中度过充实的每一天，并为升学考试努力的「洲宫纱绘」，与伙伴们一起专心投入足球的「福尔斯特・玛丽・晓空」，为自己的梦想全力前进的「北方和音」，以及为了和重要的“你”一起抓住各自未来而努力的少女们，各自的思念如今正要迸发。',
        ],
        staff: [
            { role: '开发', name: 'MAGES.' },
        ],
        links: [
            { label: 'Official website', href: 'https://memoriesoff.jp/sousou/fd' },
            { label: 'Official website', href: 'https://memoriesoff.jp/sousou/fd/' },
        ],
    },
    {
        id: '9897',
        title: '哀鸿：城破十日记',
        subtitle: '零创游戏 · Shionlib 本月新作',
        originalTitle: '哀鸿：城破十日记',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F9897%2Fcover%2F0573d2f9-334f-4f2a-b2ab-6fdbd3fcca10.webp&w=3840&q=75',
        category: '本月新作',
        categoryColor: 'sky',
        accent: 'pink',
        platform: 'PC',
        tags: ['Galgame', '游戏', 'AVG', '全年龄'],
        stats: { views: '22.8k', downloads: '8.4k', likes: '3.7k', comments: '512' },
        author: '零创游戏',
        time: '本月新作',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页展示的本月新作条目之一，内容来自对应游戏页面的真实简介与外链。',
        details: ['Galgame', 'AVG', '全年龄'],
        introduction: [
            '明末生存题材文字冒险游戏，玩家将扮演一名书生误入“狮驼国”，需要在群妖屠城的十日内努力生存，并在此期间找回记忆、解开关于一位扬州名妓的死亡之谜。作品一半篇章记叙残酷屠城，另一半追忆唯美的明末士妓恋情。',
        ],
        staff: [
            { role: '开发', name: '零创游戏' },
        ],
        links: [
            { label: 'Wikidata', href: 'https://www.wikidata.org/wiki/Q131869366' },
            { label: 'Steam', href: 'https://store.steampowered.com/app/3220060/' },
            { label: 'SteamDB', href: 'https://steamdb.info/app/3220060/info/' },
        ],
    },
    {
        id: '11103',
        title: '光翼戦姫エクスティア Marina ～Bright Feather～',
        subtitle: 'Lusterise · Shionlib 本月新作',
        originalTitle: '光翼戦姫エクスティア Marina ～Bright Feather～',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F11103%2Fcover%2Fccadf9f4-906e-4de8-a24b-5794fc58a789.webp&w=3840&q=75',
        category: '本月新作',
        categoryColor: 'sky',
        accent: 'rose',
        platform: 'PC',
        tags: ['Galgame', '游戏', '拔作', 'AVG'],
        stats: { views: '14.6k', downloads: '4.9k', likes: '1.8k', comments: '274' },
        author: 'Lusterise',
        time: '本月新作',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页展示的本月新作条目之一，数据同步自游戏详情页的真实标签与简介。',
        details: ['Galgame', '拔作', 'AVG'],
        introduction: [
            '敗北した展開における様々な堕ちた真理奈が、時空を超えて幸せな生活を送る二人へと迫る作品。大学生活を送る“真理奈”与“創真”面前，因为次元干涉而出现了多个堕落分支的真理奈，故事由此展开。',
        ],
        staff: [
            { role: '开发', name: 'Lusterise' },
        ],
        links: [
            { label: 'Official website', href: 'https://lusterise.nexton-net.jp/product/exs-tia_10th/marina.html' },
            { label: 'Getchu', href: 'http://www.getchu.com/soft.phtml?id=1353086' },
            { label: 'Official website', href: 'https://lusterise.nexton-net.jp/product/exs-tia_10th/box.html' },
        ],
    },
    {
        id: '10817',
        title: 'リルカは幾重に夜を彩る',
        subtitle: 'シルキーズプラス · Shionlib 本月新作',
        originalTitle: 'リルカは幾重に夜を彩る',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F10817%2Fcover%2Fa7ec62ef-3941-4414-81b9-bddb2c79f547.webp&w=3840&q=75',
        category: '本月新作',
        categoryColor: 'sky',
        accent: 'pink',
        platform: 'PC',
        tags: ['Galgame', '游戏', 'GAL', '2026'],
        stats: { views: '11.9k', downloads: '3.6k', likes: '1.4k', comments: '198' },
        author: 'シルキーズプラス',
        time: '本月新作',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页展示的本月新作条目之一，保留站点中的原始标题、标签与简介。',
        details: ['Galgame', 'GAL', '2026'],
        introduction: [
            '一名自称拥有多重人格的少女丸森リルカ，在夜里出现在自称侦探的白石奈绪矢面前。随着相处展开，多个性格与愿望交织在同一身体中的少女，其愿望与命运逐渐显现。',
        ],
        staff: [
            { role: '开发', name: 'シルキーズプラス' },
        ],
        links: [
            { label: 'Official website', href: 'http://www.silkysplus.jp/riruka/index.html' },
            { label: 'Getchu', href: 'http://www.getchu.com/soft.phtml?id=1350336' },
            { label: 'DMM', href: 'https://dlsoft.dmm.co.jp/detail/silkysall_0054/' },
        ],
    },
    {
        id: '1967',
        title: '誰ソ彼のシェイプシフター',
        subtitle: 'Liar-soft · Shionlib 本月新作',
        originalTitle: '誰ソ彼のシェイプシフター',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F1967%2Fcover%2Fe5d3b430-5dac-432c-a1c0-871fee13d0c0.webp&w=3840&q=75',
        category: '本月新作',
        categoryColor: 'sky',
        accent: 'indigo',
        platform: 'PC',
        tags: ['galgame', '游戏', 'adv', '悬疑'],
        stats: { views: '9.7k', downloads: '2.8k', likes: '1.1k', comments: '143' },
        author: 'Liar-soft',
        time: '本月新作',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页展示的本月新作条目之一，简介与外部链接均来自站点真实页面。',
        details: ['galgame', 'adv', '悬疑'],
        introduction: [
            '一名刚刚分手的青年，面对外表与前女友一模一样、实则是“拟态者”的异形存在。对方提出以恋人身份相处作为交换，以便将真正的前女友安全释放，一段夹杂怪异与情感修复的关系由此开始。',
        ],
        staff: [
            { role: '开发', name: 'Liar-soft' },
        ],
        links: [
            { label: 'Official website', href: 'https://www.liar.co.jp/tasogare/index.html' },
            { label: 'Getchu', href: 'http://www.getchu.com/soft.phtml?id=1355349' },
        ],
    },
    {
        id: '1096',
        title: '欧尼酱 ConTiNuE！我与结梨的恋爱小秘密',
        subtitle: 'ぱんみみそふと · Shionlib 最近更新',
        originalTitle: '欧尼酱 ConTiNuE！我与结梨的恋爱小秘密',
        thumbnail:
            'https://shionlib.com/_next/image?url=https%3A%2F%2Ft.shionlib.com%2Fgame%2F1096%2Fcover%2F51f3f4e4-4bb0-4a54-b88b-eb0291215c85.webp&w=3840&q=75',
        category: '最近更新',
        categoryColor: 'emerald',
        accent: 'green',
        platform: 'PC',
        tags: ['Galgame', 'ADV', '拔作'],
        stats: { views: '16.3k', downloads: '6.1k', likes: '2.6k', comments: '341' },
        author: 'ぱんみみそふと',
        time: '最近更新',
        releaseDate: '2026',
        summary: 'Shionlib 当前首页最近更新区展示的条目之一，已同步站点标题、封面、标签和相关链接。',
        details: ['Galgame', 'ADV', '拔作'],
        introduction: [
            '主人公白雪飒人是一名与妹妹结梨一起生活的社会人。表面上品学兼优的妹妹，回到家却把家务全部丢给哥哥，还沉迷游戏。兄妹与好友之间的微妙关系，在日常相处和恋爱边界之间不断推进。',
        ],
        staff: [
            { role: '开发', name: 'ぱんみみそふと' },
        ],
        links: [
            { label: 'Official website', href: 'https://pannomimi.net/panmimisoft' },
            { label: 'BOOTH', href: 'https://booth.pm/en/items/7041936' },
            { label: 'Melonbooks.co.jp', href: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=3010466' },
        ],
    },
];

export function getResourceHref(id: string) {
    return `/resources/${id}`;
}

export function getResourceById(id: string) {
    return resources.find((resource) => resource.id === id) ?? null;
}
