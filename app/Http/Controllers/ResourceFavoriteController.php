<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\RedirectResponse;

class ResourceFavoriteController extends Controller
{
    public function __invoke(Resource $resource): RedirectResponse
    {
        $user = request()->user();

        abort_unless($user !== null, 403);

        $isFavorited = $resource->favoritedByUsers()
            ->whereKey($user->getKey())
            ->exists();

        if ($isFavorited) {
            $resource->favoritedByUsers()->detach($user->getKey());
        } else {
            $resource->favoritedByUsers()->attach($user->getKey());
        }

        return back();
    }
}
