<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('commentable');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
            $table->foreignId('root_id')->nullable()->constrained('comments')->nullOnDelete();
            $table->text('body');
            $table->timestamps();

            $table->index(['commentable_type', 'commentable_id', 'parent_id', 'created_at'], 'comments_thread_index');
            $table->index(['root_id', 'created_at'], 'comments_root_index');
            $table->index(['user_id', 'created_at'], 'comments_user_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
