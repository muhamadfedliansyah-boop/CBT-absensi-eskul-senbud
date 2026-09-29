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

        Schema::create('schedules', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->integer('eskul_id');
            $table->foreign('eskul_id')->references('id')->on('eskuls');
            $table->date('activity_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location', 100);
            $table->text('material_text')->nullable();
            $table->string('photo_url', 255)->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
