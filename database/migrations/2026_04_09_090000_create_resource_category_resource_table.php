<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resource_category_resource', function (Blueprint $table): void {
            $table->foreignId('resource_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resource_category_id')->constrained('resource_categories')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['resource_id', 'resource_category_id']);
        });

        DB::table('resources')
            ->select('id', 'resource_category_id')
            ->whereNotNull('resource_category_id')
            ->orderBy('id')
            ->eachById(function (object $resource): void {
                DB::table('resource_category_resource')->updateOrInsert(
                    [
                        'resource_id' => $resource->id,
                        'resource_category_id' => $resource->resource_category_id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            });

        Schema::table('resources', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('resource_category_id');
        });
    }

    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table): void {
            $table->foreignId('resource_category_id')
                ->nullable()
                ->after('thumbnail_path')
                ->constrained('resource_categories')
                ->restrictOnDelete();
        });

        DB::table('resources')
            ->select('id')
            ->orderBy('id')
            ->eachById(function (object $resource): void {
                $resourceCategoryId = DB::table('resource_category_resource')
                    ->where('resource_id', $resource->id)
                    ->orderBy('resource_category_id')
                    ->value('resource_category_id');

                DB::table('resources')
                    ->where('id', $resource->id)
                    ->update(['resource_category_id' => $resourceCategoryId]);
            });

        Schema::dropIfExists('resource_category_resource');
    }
};
