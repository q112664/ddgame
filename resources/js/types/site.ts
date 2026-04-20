export type SiteNavigationItem = {
    label: string;
    url: string;
    openInNewTab: boolean;
};

export type Site = {
    name: string;
    url: string;
    logo: string | null;
    navigation: {
        primary: SiteNavigationItem[];
    };
};
