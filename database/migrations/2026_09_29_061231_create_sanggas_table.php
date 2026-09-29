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

        Schema::create('sanggas', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->string('name', 100);
            $table->integer('eskul_id');
            $table->foreign('eskul_id')->references('id')->on('eskuls');
            $table->integer('pic_student_id');
            $table->foreign('pic_student_id')->references('id')->on('students');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sanggas');
    }
};
