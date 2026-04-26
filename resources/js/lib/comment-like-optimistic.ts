import type { FrontendComment, FrontendResource } from '@/types';

export type CommentLikePageProps = {
    comments?: FrontendComment[];
    resource?: FrontendResource | null;
};

export type CommentLikeOptimisticInput = {
    commentId: number;
    liked: boolean;
};

function updateCommentTree(
    comments: FrontendComment[],
    { commentId, liked }: CommentLikeOptimisticInput,
): { comments: FrontendComment[]; changed: boolean } {
    let changed = false;

    const nextComments = comments.map((comment) => {
        let nextComment = comment;

        if (comment.id === commentId) {
            const currentlyLiked = comment.likedByCurrentUser;

            if (currentlyLiked !== liked) {
                changed = true;
                nextComment = {
                    ...comment,
                    likedByCurrentUser: liked,
                    likeCount: Math.max(
                        0,
                        comment.likeCount + (liked ? 1 : -1),
                    ),
                };
            }
        }

        if (nextComment.replies.length > 0) {
            const replies = updateCommentTree(nextComment.replies, {
                commentId,
                liked,
            });

            if (replies.changed) {
                changed = true;
                nextComment = {
                    ...nextComment,
                    replies: replies.comments,
                };
            }
        }

        return nextComment;
    });

    return { comments: nextComments, changed };
}

export function buildCommentLikeOptimisticProps<
    TPageProps extends CommentLikePageProps,
>(
    pageProps: TPageProps,
    input: CommentLikeOptimisticInput,
): Partial<TPageProps> | void {
    if (pageProps.resource?.comments) {
        const update = updateCommentTree(pageProps.resource.comments, input);

        if (!update.changed) {
            return;
        }

        return {
            resource: {
                ...pageProps.resource,
                comments: update.comments,
            },
        } as Partial<TPageProps>;
    }

    if (pageProps.comments) {
        const update = updateCommentTree(pageProps.comments, input);

        if (!update.changed) {
            return;
        }

        return {
            comments: update.comments,
        } as Partial<TPageProps>;
    }
}
