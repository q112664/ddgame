<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Support\FrontendResourceSerializer;
use App\Support\ResourceViewRecorder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourcePageController extends Controller
{
    public function __construct(
        private ResourceViewRecorder $resourceViewRecorder,
    ) {}

    public function index(): Response
    {
        return Inertia::render('resources/index', [
            'resources' => FrontendResourceSerializer::summaries(
                Resource::query()
                    ->with(['categories', 'author', 'tags'])
                    ->latest('published_at')
                    ->get(),
            ),
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        return $this->renderSection($request, $slug);
    }

    public function downloads(Request $request, string $slug): Response
    {
        return $this->renderSection($request, $slug, 'downloads');
    }

    public function screenshots(Request $request, string $slug): Response
    {
        return $this->renderSection($request, $slug, 'screenshots');
    }

    public function discussion(Request $request, string $slug): Response
    {
        return $this->renderSection($request, $slug, 'discussion');
    }

    private function renderSection(
        Request $request,
        string $slug,
        string $section = 'details',
    ): Response {
        $resource = Resource::query()
            ->with(['categories', 'author', 'tags'])
            ->withCount('favoritedByUsers')
            ->when(
                $request->user(),
                fn ($query, $user) => $query->withExists([
                    'favoritedByUsers as is_favorited_by_current_user' => fn ($favoriteQuery) => $favoriteQuery->whereKey($user->getKey()),
                ]),
                fn ($query) => $query->selectRaw('false as is_favorited_by_current_user'),
            )
            ->where('slug', $slug)
            ->first();

        if ($resource !== null) {
            $this->resourceViewRecorder->record($request, $resource);
        }

        return Inertia::render('resources/show', [
            'resource' => $resource ? FrontendResourceSerializer::details($resource) : null,
            'slug' => $slug,
            'section' => $section,
        ]);
    }
}
