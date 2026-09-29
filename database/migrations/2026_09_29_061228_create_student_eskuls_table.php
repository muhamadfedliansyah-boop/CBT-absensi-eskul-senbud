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
        Schema::disableForeignKeyConstraints();

        Schema::create('student_eskuls', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->integer('student_id');
            $table->foreign('student_id')->references('id')->on('students');
            $table->integer('eskul_id');
            $table->foreign('eskul_id')->references('id')->on('eskuls');
            $table->unique(['student_id', 'eskul_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_eskuls');
    }
};
