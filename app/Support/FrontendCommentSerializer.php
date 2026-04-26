<?php

namespace App\Support;

use App\Models\Comment;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Support\Collection;

class FrontendCommentSerializer
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function threadForResource(Resource $resource, ?User $viewer): array
    {
        $rootIds = $resource->comments()
            ->whereNull('parent_id')
            ->latest()
            ->limit(20)
            ->pluck('comments.id');

        if ($rootIds->isEmpty()) {
            return [];
        }

        $comments = Comment::query()
            ->where(function ($query) use ($rootIds): void {
                $query
                    ->whereIn('id', $rootIds)
                    ->orWhereIn('root_id', $rootIds);
            })
            ->with('author')
            ->withCount('likedByUsers')
            ->when(
                $viewer,
                fn ($query, User $user) => $query->withExists([
                    'likedByUsers as is_liked_by_current_user' => fn ($likeQuery) => $likeQuery->whereKey($user->getKey()),
                ]),
                fn ($query) => $query->selectRaw('false as is_liked_by_current_user'),
            )
            ->oldest()
            ->get();

        $commentsById = $comments->keyBy('id');
        $repliesByRootId = $comments
            ->whereNotNull('root_id')
            ->groupBy('root_id');

        return $rootIds
            ->map(fn (int $rootId): ?Comment => $commentsById->get($rootId))
            ->filter()
            ->map(fn (Comment $comment): array => self::rootComment($comment, $repliesByRootId, $commentsById))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function profileSummary(Comment $comment): array
    {
        $resource = $comment->commentable instanceof Resource
            ? $comment->commentable
            : null;

        return [
            'id' => $comment->getKey(),
            'body' => $comment->body,
            'createdAt' => $comment->created_at?->toIso8601String(),
            'parentId' => $comment->parent_id,
            'replyTo' => $comment->parent?->author?->name,
            'resource' => $resource
                ? FrontendResourceSerializer::summary($resource)
                : null,
        ];
    }

    /**
     * @param  Collection<int, Collection<int, Comment>>  $repliesByRootId
     * @param  Collection<int, Comment>  $commentsById
     * @return array<string, mixed>
     */
    private static function rootComment(
        Comment $comment,
        Collection $repliesByRootId,
        Collection $commentsById,
    ): array {
        $replies = $repliesByRootId
            ->get($comment->getKey(), collect())
            ->map(fn (Comment $reply): array => self::floorReply($reply, $commentsById))
            ->values()
            ->all();

        return [
            'id' => $comment->getKey(),
            'body' => $comment->body,
            'createdAt' => $comment->created_at?->toIso8601String(),
            'parentId' => $comment->parent_id,
            'replyTo' => $comment->parent_id
                ? $commentsById->get($comment->parent_id)?->author?->name
                : null,
            'author' => [
                'id' => $comment->author->getKey(),
                'name' => $comment->author->name,
                'avatar' => $comment->author->avatar,
            ],
            'likeCount' => $comment->liked_by_users_count ?? 0,
            'likedByCurrentUser' => (bool) ($comment->is_liked_by_current_user ?? false),
            'replyCount' => count($replies),
            'replies' => $replies,
        ];
    }

    /**
     * @param  Collection<int, Comment>  $commentsById
     * @return array<string, mixed>
     */
    private static function floorReply(Comment $comment, Collection $commentsById): array
    {
        return [
            'id' => $comment->getKey(),
            'body' => $comment->body,
            'createdAt' => $comment->created_at?->toIso8601String(),
            'parentId' => $comment->parent_id,
            'replyTo' => $comment->parent_id
                ? $commentsById->get($comment->parent_id)?->author?->name
                : null,
            'author' => [
                'id' => $comment->author->getKey(),
                'name' => $comment->author->name,
                'avatar' => $comment->author->avatar,
            ],
            'likeCount' => $comment->liked_by_users_count ?? 0,
            'likedByCurrentUser' => (bool) ($comment->is_liked_by_current_user ?? false),
            'replyCount' => 0,
            'replies' => [],
        ];
    }
}
