<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'avatar_path')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('avatar_path')->nullable()->after('avatar');
            });
        }

        if (Schema::hasColumn('users', 'avatar')) {
            DB::statement(
                "UPDATE users SET avatar_path = avatar WHERE avatar_path IS NULL AND avatar IS NOT NULL"
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'avatar_path')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->dropColumn('avatar_path');
            });
        }
    }
};
