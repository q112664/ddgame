<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('resources', 'tags')) {
            return;
        }

        $resources = DB::table('resources')
            ->select('id', 'tags')
            ->get();

        foreach ($resources as $resource) {
            $tags = json_decode((string) $resource->tags, true);

            if (! is_array($tags)) {
                continue;
            }

            foreach ($tags as $tagName) {
                if (! is_string($tagName) || blank($tagName)) {
                    continue;
                }

                $slug = Str::slug($tagName);

                if (blank($slug)) {
                    $slug = 'tag-'.substr(md5($tagName), 0, 10);
                }

                DB::table('tags')->updateOrInsert(
                    ['slug' => $slug],
                    [
                        'name' => $tagName,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );

                $tag = DB::table('tags')
                    ->where('slug', $slug)
                    ->first();

                if ($tag === null) {
                    continue;
                }

                DB::table('resource_tag')->updateOrInsert(
                    [
                        'resource_id' => $resource->id,
                        'tag_id' => $tag->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }
        }

        Schema::table('resources', function ($table): void {
            $table->dropColumn('tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function ($table): void {
            $table->json('tags')->nullable()->after('user_id');
        });

        $resourceIds = DB::table('resources')->pluck('id');

        foreach ($resourceIds as $resourceId) {
            $tags = DB::table('resource_tag')
                ->join('tags', 'resource_tag.tag_id', '=', 'tags.id')
                ->where('resource_tag.resource_id', $resourceId)
                ->orderBy('tags.name')
                ->pluck('tags.name')
                ->all();

            DB::table('resources')
                ->where('id', $resourceId)
                ->update(['tags' => json_encode($tags, JSON_UNESCAPED_UNICODE)]);
        }
    }
};
