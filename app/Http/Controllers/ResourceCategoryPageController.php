<?php

namespace App\Http\Controllers;

use App\Models\ResourceCategory;
use App\Support\FrontendResourceSerializer;
use Inertia\Inertia;
use Inertia\Response;

class ResourceCategoryPageController extends Controller
{
    public function show(ResourceCategory $category): Response
    {
        $resources = $category->resources()
            ->with(['categories', 'author', 'tags'])
            ->latest('published_at')
            ->paginate(24)
            ->withQueryString()
            ->through(fn ($resource): array => FrontendResourceSerializer::summary($resource));

        return Inertia::render('categories/show', [
            'category' => [
                'name' => $category->name,
                'slug' => $category->slug,
                'color' => $category->color?->value ?? 'sky',
                'resourceCount' => $resources->total(),
            ],
            'resources' => $resources,
        ]);
    }
}
