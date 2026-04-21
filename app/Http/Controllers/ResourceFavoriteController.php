<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResourceFavoriteRequest;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;

class ResourceFavoriteController extends Controller
{
    public function __invoke(ResourceFavoriteRequest $request, Resource $resource): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user !== null, 403);

        if ($request->favorited()) {
            $resource->favoritedByUsers()->syncWithoutDetaching([$user->getKey()]);
        } else {
            $resource->favoritedByUsers()->detach($user->getKey());
        }

        $favoriteCount = $resource->favoritedByUsers()->count();

        $request->session()->flash('favoriteUpdate', [
            'resourceSlug' => $resource->slug,
            'favorited' => $request->favorited(),
            'favoriteCount' => $favoriteCount,
        ]);

        return back();
    }
}
