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

        Schema::create('attendances', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->integer('schedule_id');
            $table->foreign('schedule_id')->references('id')->on('schedules');
            $table->integer('student_id');
            $table->foreign('student_id')->references('id')->on('students');
            $table->enum('status', ["HADIR","SAKIT","IZIN","ALPA","DISPEN"]);
            $table->integer('recorded_by');
            $table->foreign('recorded_by')->references('id')->on('users');
            $table->integer('dispensasi_by')->nullable();
            $table->foreign('dispensasi_by')->references('id')->on('users');
            $table->text('notes')->nullable();
            $table->unique(['schedule_id', 'student_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
