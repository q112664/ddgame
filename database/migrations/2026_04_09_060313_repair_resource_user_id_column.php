<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('resources', 'user_id')) {
            Schema::table('resources', function (Blueprint $table) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->after('resource_category_id')
                    ->constrained('users')
                    ->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('resources', 'author_name')) {
            return;
        }

        $resources = DB::table('resources')
            ->select('id', 'author_name', 'user_id')
            ->whereNotNull('author_name')
            ->get();

        foreach ($resources as $resource) {
            if (! empty($resource->user_id)) {
                continue;
            }

            $emailSlug = Str::slug((string) $resource->author_name, '.');

            if (blank($emailSlug)) {
                $emailSlug = 'user.'.substr(md5((string) $resource->author_name), 0, 10);
            }

            $email = $emailSlug.'@resource.local';

            $user = DB::table('users')
                ->where('email', $email)
                ->first();

            if ($user === null) {
                $userId = DB::table('users')->insertGetId([
                    'name' => $resource->author_name,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $userId = $user->id;
            }

            DB::table('resources')
                ->where('id', $resource->id)
                ->update(['user_id' => $userId]);
        }
    }

    public function down(): void
    {
        //
    }
};
