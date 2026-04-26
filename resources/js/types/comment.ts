import type { FrontendResource } from './resource';

export type FrontendCommentAuthor = {
    id: number;
    name: string;
    avatar: string | null;
};

export type FrontendComment = {
    id: number;
    body: string;
    createdAt: string | null;
    floorNumber: number | null;
    parentId: number | null;
    replyTo: string | null;
    author: FrontendCommentAuthor;
    likeCount: number;
    likedByCurrentUser: boolean;
    replyCount: number;
    replies: FrontendComment[];
};

export type FrontendProfileComment = {
    id: number;
    body: string;
    createdAt: string | null;
    parentId: number | null;
    replyTo: string | null;
    resource: FrontendResource | null;
};
