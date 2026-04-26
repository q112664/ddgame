<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Support\FrontendCommentSerializer;
use App\Support\FrontendEmojiSerializer;
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

    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $sort = $request->string('sort', 'latest')->toString();

        return Inertia::render('resources/index', [
            'resources' => Resource::query()
                ->with(['categories', 'author', 'tags'])
                ->when($category !== '', fn ($query) => $query->whereHas(
                    'categories',
                    fn ($categoryQuery) => $categoryQuery->where('slug', $category),
                ))
                ->when(
                    $sort === 'oldest',
                    fn ($query) => $query->oldest('published_at'),
                    fn ($query) => $query->latest($sort === 'views' ? 'view_count' : 'published_at'),
                )
                ->paginate(24)
                ->withQueryString()
                ->through(fn (Resource $resource): array => FrontendResourceSerializer::summary($resource)),
            'filters' => [
                'category' => $category,
                'sort' => in_array($sort, ['latest', 'oldest', 'views'], true) ? $sort : 'latest',
            ],
            'filterOptions' => [
                'categories' => ResourceCategory::query()
                    ->ordered()
                    ->get(['name', 'slug'])
                    ->map(fn (ResourceCategory $category): array => [
                        'label' => $category->name,
                        'value' => $category->slug,
                    ])
                    ->prepend(['label' => '全部', 'value' => ''])
                    ->values()
                    ->all(),
            ],
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
            ->withCount(['comments', 'favoritedByUsers'])
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

        $resourcePayload = $resource ? FrontendResourceSerializer::details($resource) : null;

        if ($resourcePayload !== null) {
            $resourcePayload['comments'] = $section === 'discussion'
                ? FrontendCommentSerializer::threadForResource($resource, $request->user())
                : [];
        }

        return Inertia::render('resources/show', [
            'resource' => $resourcePayload,
            'commentEmojiPacks' => $section === 'discussion'
                ? FrontendEmojiSerializer::packs()
                : [],
            'slug' => $slug,
            'section' => $section,
        ]);
    }
}
