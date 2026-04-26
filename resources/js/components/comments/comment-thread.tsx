import { Link, useForm } from '@inertiajs/react';
import { MessageCircle, MessageSquareReply, Send, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { RichTextContent } from '@/components/rich-text/rich-text-content';
import { RichTextEditor } from '@/components/rich-text/rich-text-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useInitials } from '@/hooks/use-initials';
import {
    buildCommentLikeOptimisticProps,
    type CommentLikePageProps,
} from '@/lib/comment-like-optimistic';
import { getRichTextPlainText, isRichTextEmpty } from '@/lib/rich-text';
import { formatRelativeTime } from '@/lib/resource-time';
import { login } from '@/routes';
import type { FrontendComment, SiteEmojiPack, User } from '@/types';

type CommentThreadRoutes = {
    store: string;
    reply: (commentId: number) => string;
    like: (commentId: number) => string;
};

type CommentThreadProps = {
    comments: FrontendComment[];
    currentUser: User | null;
    routes: CommentThreadRoutes;
    emojiPacks?: SiteEmojiPack[];
    emptyText?: string;
};

type ActiveReplyTarget = {
    id: number;
    author: string;
    rootId: number;
};

const bodyMaxLength = 500;
const authToastId = 'comment-thread-auth-required';
const previewReplyCount = 3;
const commentActionButtonClass =
    'h-8 px-2.5 text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground';

function formatCommentTime(dateString: string | null): string {
    if (dateString === null) {
        return '刚刚';
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
        return '刚刚';
    }

    return formatRelativeTime(new Date(), parsedDate);
}

function CommentComposer({
    value,
    error,
    placeholder,
    processing,
    submitLabel,
    editorSurface = 'transparent',
    emojiPacks = [],
    onChange,
    onCancel,
    onSubmit,
}: {
    value: string;
    error?: string;
    placeholder: string;
    processing: boolean;
    submitLabel: string;
    editorSurface?: 'transparent' | 'card';
    emojiPacks?: SiteEmojiPack[];
    onChange: (value: string) => void;
    onCancel?: () => void;
    onSubmit: () => void;
}) {
    const textLength = getRichTextPlainText(value).length;
    const hasExceededLimit = textLength > bodyMaxLength;

    return (
        <div className="space-y-3">
            <RichTextEditor
                placeholder={placeholder}
                value={value}
                maxLength={bodyMaxLength}
                error={error}
                disabled={processing}
                showFocusRing={false}
                surface={editorSurface}
                enableSiteEmojis={emojiPacks.length > 0}
                emojiPacks={emojiPacks}
                onChange={onChange}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {hasExceededLimit ? (
                        <span className="text-destructive">
                            评论最多 {bodyMaxLength} 个字符
                        </span>
                    ) : null}
                </div>

                <div className="flex justify-end gap-2">
                    {onCancel ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                        >
                            取消
                        </Button>
                    ) : null}
                    <Button
                        type="button"
                        size="sm"
                        disabled={
                            processing ||
                            isRichTextEmpty(value) ||
                            hasExceededLimit
                        }
                        onClick={onSubmit}
                    >
                        <Send className="size-3.5" aria-hidden="true" />
                        {processing ? '提交中...' : submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    isReply = false,
    rootId,
    floorNumber,
    activeReplyTarget,
    replyBody,
    replyError,
    replyProcessing,
    emojiPacks,
    pendingLikeId,
    getInitials,
    onReplyToggle,
    onReplyBodyChange,
    onReplyCancel,
    onReplySubmit,
    onLikeToggle,
    expandedReplyIds,
    onReplyListToggle,
}: {
    comment: FrontendComment;
    isReply?: boolean;
    rootId?: number;
    floorNumber?: number;
    activeReplyTarget: ActiveReplyTarget | null;
    replyBody: string;
    replyError?: string;
    replyProcessing: boolean;
    emojiPacks: SiteEmojiPack[];
    pendingLikeId: number | null;
    getInitials: (name: string) => string;
    onReplyToggle: (target: ActiveReplyTarget) => void;
    onReplyBodyChange: (value: string) => void;
    onReplyCancel: () => void;
    onReplySubmit: () => void;
    onLikeToggle: (comment: FrontendComment) => void;
    expandedReplyIds: ReadonlySet<number>;
    onReplyListToggle: (commentId: number) => void;
}) {
    const isReplying = activeReplyTarget?.id === comment.id;
    const replyBoxId = `comment-reply-box-${comment.id}`;
    const replyCount = !isReply && comment.replyCount > 0
        ? comment.replyCount
        : null;
    const shouldShowReplyPanel =
        !isReply && (comment.replies.length > 0 || isReplying);
    const hasCollapsedReplies =
        !isReply && comment.replies.length > previewReplyCount;
    const isReplyListExpanded = !isReply && expandedReplyIds.has(comment.id);
    const isReplyTargetInThread =
        !isReply &&
        activeReplyTarget !== null &&
        comment.replies.some((reply) => reply.id === activeReplyTarget.id);
    const shouldShowAllReplies =
        isReplyListExpanded || isReplyTargetInThread;
    const visibleReplies =
        hasCollapsedReplies && !shouldShowAllReplies
            ? comment.replies.slice(0, previewReplyCount)
            : comment.replies;
    const collapsedReplyCount = comment.replies.length - previewReplyCount;
    const currentRootId = rootId ?? comment.id;

    return (
        <article
            id={`comment-${comment.id}`}
            className={
                isReply
                    ? 'text-card-foreground'
                    : 'relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-none'
            }
        >
            <div
                className={
                    isReply
                        ? 'flex flex-col gap-1.5'
                        : 'flex flex-col gap-3.5 p-3.5 sm:p-4'
                }
            >
                <div
                    className={
                        isReply
                            ? 'flex min-w-0 flex-1 gap-2.5'
                            : 'flex items-start gap-3 pr-11'
                    }
                >
                    <Avatar
                        className={`shrink-0 cursor-pointer ${isReply ? 'size-8 bg-muted' : 'size-10 bg-primary/20'}`}
                    >
                        <AvatarImage
                            src={comment.author.avatar ?? undefined}
                            alt={comment.author.name}
                        />
                        <AvatarFallback
                            className={`${isReply ? 'bg-muted' : 'bg-primary/20'} text-xs font-medium text-foreground`}
                        >
                            {getInitials(comment.author.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                            <div className="flex min-w-0 flex-col gap-0.5">
                                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                    <span
                                        className={
                                            isReply
                                                ? 'text-sm font-semibold text-foreground'
                                                : 'text-base font-semibold text-primary'
                                        }
                                    >
                                        {comment.author.name}
                                    </span>

                                    {comment.replyTo ? (
                                        <span className="text-sm text-muted-foreground">
                                            回复 {comment.replyTo}
                                        </span>
                                    ) : null}
                                </div>

                                {!isReply ? (
                                    <span className="text-xs text-muted-foreground">
                                        {formatCommentTime(comment.createdAt)}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <RichTextContent
                            html={comment.body}
                            className={
                                isReply
                                    ? 'mt-0.5 text-sm leading-6 text-foreground/88'
                                    : 'mt-3 text-[15px] leading-7 font-medium text-foreground/90 sm:text-base'
                            }
                        />
                    </div>
                </div>

                {!isReply && floorNumber ? (
                    <span className="absolute top-3.5 right-3.5 text-base font-bold text-muted-foreground/60 tabular-nums sm:top-4 sm:right-4">
                        #{floorNumber}
                    </span>
                ) : null}

                <div
                    className={
                        isReply
                            ? 'flex items-center justify-between gap-2 pl-10'
                            : 'flex flex-wrap items-center justify-between gap-3'
                    }
                >
                    {isReply ? (
                        <span className="text-xs text-muted-foreground">
                            {formatCommentTime(comment.createdAt)}
                        </span>
                    ) : null}

                    <div className="flex gap-1.5">
                        <Button
                            type="button"
                            variant="secondary"
                            className={commentActionButtonClass}
                            aria-pressed={comment.likedByCurrentUser}
                            aria-label={`${comment.author.name} 的评论点赞，当前 ${comment.likeCount} 次`}
                            disabled={pendingLikeId === comment.id}
                            onClick={() => onLikeToggle(comment)}
                        >
                            <ThumbsUp
                                className={`size-4 ${comment.likedByCurrentUser ? 'fill-current text-primary' : ''}`}
                                aria-hidden="true"
                            />
                            <span
                                className={`font-light tabular-nums ${comment.likedByCurrentUser ? 'text-primary' : ''}`}
                            >
                                {comment.likeCount}
                            </span>
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className={commentActionButtonClass}
                            aria-label={`回复 ${comment.author.name} 的评论${
                                replyCount ? `，当前 ${replyCount} 条回复` : ''
                            }`}
                            aria-expanded={isReplying}
                            aria-controls={isReplying ? replyBoxId : undefined}
                            onClick={() =>
                                onReplyToggle({
                                    id: comment.id,
                                    author: comment.author.name,
                                    rootId: currentRootId,
                                })
                            }
                        >
                            <MessageSquareReply
                                className="size-4"
                                aria-hidden="true"
                            />
                            <span>回复</span>
                            {replyCount ? (
                                <span className="font-light tabular-nums">
                                    {replyCount}
                                </span>
                            ) : null}
                        </Button>
                    </div>

                    {!isReply ? (
                        <Button
                            type="button"
                            variant="secondary"
                            className={`hidden ${commentActionButtonClass} sm:inline-flex`}
                            aria-label={`${comment.author.name} 的评论区`}
                            onClick={() =>
                                onReplyToggle({
                                    id: comment.id,
                                    author: comment.author.name,
                                    rootId: currentRootId,
                                })
                            }
                        >
                            <MessageCircle className="size-4" aria-hidden="true" />
                        </Button>
                    ) : null}
                </div>

                {isReplying && isReply ? (
                    <div id={replyBoxId}>
                        <CommentComposer
                            value={replyBody}
                            error={replyError}
                            placeholder={`回复 ${comment.author.name}…`}
                            processing={replyProcessing}
                            submitLabel="提交回复"
                            editorSurface="card"
                            emojiPacks={emojiPacks}
                            onChange={onReplyBodyChange}
                            onCancel={onReplyCancel}
                            onSubmit={onReplySubmit}
                        />
                    </div>
                ) : null}

                {shouldShowReplyPanel ? (
                    <div className="rounded-xl bg-muted/35 p-3 dark:bg-input/20">
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            评论
                        </h3>

                        {isReplying ? (
                            <div id={replyBoxId} className="mt-3">
                                <CommentComposer
                                    value={replyBody}
                                    error={replyError}
                                    placeholder={`回复 ${comment.author.name}…`}
                                    processing={replyProcessing}
                                    submitLabel="提交回复"
                                    editorSurface="card"
                                    emojiPacks={emojiPacks}
                                    onChange={onReplyBodyChange}
                                    onCancel={onReplyCancel}
                                    onSubmit={onReplySubmit}
                                />
                            </div>
                        ) : null}

                        <div className="mt-3 space-y-3">
                            {visibleReplies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    isReply
                                    activeReplyTarget={activeReplyTarget}
                                    replyBody={replyBody}
                                    replyError={replyError}
                                    replyProcessing={replyProcessing}
                                    emojiPacks={emojiPacks}
                                    pendingLikeId={pendingLikeId}
                                    getInitials={getInitials}
                                    onReplyToggle={onReplyToggle}
                                    onReplyBodyChange={onReplyBodyChange}
                                    onReplyCancel={onReplyCancel}
                                    onReplySubmit={onReplySubmit}
                                    onLikeToggle={onLikeToggle}
                                    expandedReplyIds={expandedReplyIds}
                                    onReplyListToggle={onReplyListToggle}
                                    rootId={comment.id}
                                />
                            ))}
                        </div>

                        {hasCollapsedReplies ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-3 h-8 px-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={() => onReplyListToggle(comment.id)}
                            >
                                {isReplyListExpanded
                                    ? '收起回复'
                                    : `展开其余 ${collapsedReplyCount} 条回复`}
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </article>
    );
}

export function CommentThread({
    comments,
    currentUser,
    routes,
    emojiPacks = [],
    emptyText = '还没有评论，来做第一个留下想法的人吧。',
}: CommentThreadProps) {
    const getInitials = useInitials();
    const commentForm = useForm({ body: '' });
    const replyForm = useForm({ body: '' });
    const likeForm = useForm({ liked: false });
    const [activeReplyTarget, setActiveReplyTarget] =
        useState<ActiveReplyTarget | null>(null);
    const [pendingLikeId, setPendingLikeId] = useState<number | null>(null);
    const [expandedReplyIds, setExpandedReplyIds] = useState<Set<number>>(
        () => new Set(),
    );

    const requireAuth = (message: string) => {
        if (currentUser !== null) {
            return true;
        }

        toast(message, {
            id: authToastId,
            description: '登录后可以参与评论、回复和点赞。',
        });

        return false;
    };

    const handleCommentSubmit = () => {
        if (!requireAuth('请先登录后再评论。')) {
            return;
        }

        commentForm.post(routes.store, {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset('body');
                commentForm.setData('body', '');
            },
        });
    };

    const handleReplyToggle = (target: ActiveReplyTarget) => {
        if (!requireAuth('请先登录后再回复。')) {
            return;
        }

        setActiveReplyTarget((currentTarget) =>
            currentTarget?.id === target.id ? null : target,
        );
        replyForm.reset('body');
        replyForm.clearErrors();
    };

    const handleReplyCancel = () => {
        setActiveReplyTarget(null);
        replyForm.reset('body');
        replyForm.clearErrors();
    };

    const handleReplyListToggle = (commentId: number) => {
        setExpandedReplyIds((currentIds) => {
            const nextIds = new Set(currentIds);

            if (nextIds.has(commentId)) {
                nextIds.delete(commentId);
            } else {
                nextIds.add(commentId);
            }

            return nextIds;
        });
    };

    const handleReplySubmit = () => {
        if (activeReplyTarget === null) {
            return;
        }

        const replyTarget = activeReplyTarget;

        replyForm.post(routes.reply(replyTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setExpandedReplyIds((currentIds) => {
                    const nextIds = new Set(currentIds);
                    nextIds.add(replyTarget.rootId);

                    return nextIds;
                });
                setActiveReplyTarget(null);
                replyForm.reset('body');
                replyForm.setData('body', '');
            },
        });
    };

    const handleLikeToggle = (comment: FrontendComment) => {
        if (!requireAuth('请先登录后再点赞。') || likeForm.processing) {
            return;
        }

        const nextLikedState = !comment.likedByCurrentUser;
        setPendingLikeId(comment.id);
        likeForm.transform(() => ({
            liked: nextLikedState,
        }));

        likeForm
            .optimistic((pageProps) =>
                buildCommentLikeOptimisticProps(
                    pageProps as CommentLikePageProps,
                    {
                        commentId: comment.id,
                        liked: nextLikedState,
                    },
                ),
            )
            .post(routes.like(comment.id), {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setPendingLikeId((currentId) =>
                        currentId === comment.id ? null : currentId,
                    );
                },
            });
    };

    return (
        <section
            className="flex w-full flex-col gap-4"
            id="comment-content"
            aria-labelledby="resource-comments-title"
        >
            <div className="flex flex-col gap-2">
                <h2
                    id="resource-comments-title"
                    className="flex items-center gap-4 text-lg font-bold text-foreground"
                >
                    <span className="h-6 w-1 rounded bg-primary" aria-hidden="true" />
                    评论
                </h2>
                <p className="text-sm text-muted-foreground">耳を澄まして。</p>
            </div>

            {currentUser ? (
                <CommentComposer
                    value={commentForm.data.body}
                    error={commentForm.errors.body}
                    placeholder="写下你的评论…"
                    processing={commentForm.processing}
                    submitLabel="提交"
                    emojiPacks={emojiPacks}
                    onChange={(value) => commentForm.setData('body', value)}
                    onSubmit={handleCommentSubmit}
                />
            ) : (
                <div className="space-y-3">
                    <textarea
                        className="min-h-20 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70 dark:bg-transparent"
                        placeholder="登录后参与评论…"
                        disabled
                    />
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href={login()}>
                                <Send className="size-3.5" aria-hidden="true" />
                                登录后评论
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {comments.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {comments.map((comment, index) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            floorNumber={comment.floorNumber ?? index + 1}
                            activeReplyTarget={activeReplyTarget}
                            replyBody={replyForm.data.body}
                            replyError={replyForm.errors.body}
                            replyProcessing={replyForm.processing}
                            emojiPacks={emojiPacks}
                            pendingLikeId={pendingLikeId}
                            getInitials={getInitials}
                            onReplyToggle={handleReplyToggle}
                            onReplyBodyChange={(value) =>
                                replyForm.setData('body', value)
                            }
                            onReplyCancel={handleReplyCancel}
                            onReplySubmit={handleReplySubmit}
                            onLikeToggle={handleLikeToggle}
                            expandedReplyIds={expandedReplyIds}
                            onReplyListToggle={handleReplyListToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border bg-card px-5 py-9 text-center shadow-xs">
                    <p className="text-sm leading-6 text-muted-foreground">
                        {emptyText}
                    </p>
                </div>
            )}
        </section>
    );
}
