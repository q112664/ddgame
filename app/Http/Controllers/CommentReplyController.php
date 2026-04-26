<?php

namespace App\Http\Controllers;

use App\Actions\Comments\CreateComment;
use App\Http\Requests\StoreCommentReplyRequest;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;

class CommentReplyController extends Controller
{
    public function store(
        StoreCommentReplyRequest $request,
        Comment $comment,
        CreateComment $createComment,
    ): RedirectResponse {
        $createComment->asReply(
            $request->user(),
            $comment,
            $request->string('body')->toString(),
        );

        return back();
    }
}
