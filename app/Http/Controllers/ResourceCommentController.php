<?php

namespace App\Http\Controllers;

use App\Actions\Comments\CreateComment;
use App\Http\Requests\StoreResourceCommentRequest;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;

class ResourceCommentController extends Controller
{
    public function store(
        StoreResourceCommentRequest $request,
        Resource $resource,
        CreateComment $createComment,
    ): RedirectResponse {
        $createComment->forCommentable(
            $request->user(),
            $resource,
            $request->string('body')->toString(),
        );

        return back();
    }
}
