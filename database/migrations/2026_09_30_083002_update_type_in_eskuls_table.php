<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('eskuls', function (Blueprint $table) {
            $table->string('type', 50)->default('ESKUL')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eskuls', function (Blueprint $table) {
            $table->enum('type', ['ESKUL', 'SENBUD', 'PRAMUKA'])->change();
        });
    }
};
