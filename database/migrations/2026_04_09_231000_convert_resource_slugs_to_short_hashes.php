<?php

use App\Support\ResourceSlug;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('resources')
            ->orderBy('id')
            ->get(['id', 'slug'])
            ->each(function (object $resource): void {
                if (! ResourceSlug::shouldGenerate($resource->slug)) {
                    return;
                }

                DB::table('resources')
                    ->where('id', $resource->id)
                    ->update(['slug' => ResourceSlug::generateUnique()]);
            });
    }

    public function down(): void
    {
        DB::table('resources')
            ->orderBy('id')
            ->get(['id'])
            ->each(function (object $resource): void {
                DB::table('resources')
                    ->where('id', $resource->id)
                    ->update(['slug' => (string) $resource->id]);
            });
    }
};
