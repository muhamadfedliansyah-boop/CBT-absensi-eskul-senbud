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

        Schema::create('sangga_members', function (Blueprint $table) {
            $table->integer('sangga_id');
            $table->foreign('sangga_id')->references('id')->on('sanggas');
            $table->integer('student_id');
            $table->foreign('student_id')->references('id')->on('students');
            $table->primary(['sangga_id', 'student_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sangga_members');
    }
};
