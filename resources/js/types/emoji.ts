export type SiteEmoji = {
    id: number;
    name: string;
    url: string;
    packName: string;
};

export type SiteEmojiPack = {
    id: number;
    name: string;
    emojis: SiteEmoji[];
};
