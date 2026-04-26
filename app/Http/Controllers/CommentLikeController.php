<?php

namespace App\Http\Controllers;

use App\Actions\Comments\SetCommentLike;
use App\Http\Requests\SetCommentLikeRequest;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;

class CommentLikeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        SetCommentLikeRequest $request,
        Comment $comment,
        SetCommentLike $setCommentLike,
    ): RedirectResponse {
        $setCommentLike->handle(
            $comment,
            $request->user(),
            $request->boolean('liked'),
        );

        return back();
    }
}
