<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use App\Models\User;
use App\Support\SanitizedHtml;
use Illuminate\Database\Eloquent\Model;

class CreateComment
{
    /**
     * @param  Model  $commentable  A model exposing a morphMany comments() relation.
     */
    public function forCommentable(User $author, Model $commentable, string $body): Comment
    {
        /** @var Comment $comment */
        $comment = $commentable->comments()->create([
            'user_id' => $author->getKey(),
            'body' => SanitizedHtml::cleanComment($body) ?? '',
        ]);

        return $comment;
    }

    public function asReply(User $author, Comment $parent, string $body): Comment
    {
        $parent->loadMissing('commentable');

        /** @var Comment $comment */
        $comment = $parent->commentable->comments()->create([
            'user_id' => $author->getKey(),
            'parent_id' => $parent->getKey(),
            'root_id' => $parent->root_id ?? $parent->getKey(),
            'body' => SanitizedHtml::cleanComment($body) ?? '',
        ]);

        return $comment;
    }
}
