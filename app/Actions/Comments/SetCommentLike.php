<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use App\Models\User;

class SetCommentLike
{
    public function handle(Comment $comment, User $user, bool $liked): void
    {
        if ($liked) {
            $comment->likedByUsers()->syncWithoutDetaching([$user->getKey()]);

            return;
        }

        $comment->likedByUsers()->detach($user->getKey());
    }
}
