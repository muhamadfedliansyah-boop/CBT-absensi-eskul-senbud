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

        Schema::create('sangga_schedule_rooms', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->integer('schedule_id');
            $table->foreign('schedule_id')->references('id')->on('schedules');
            $table->integer('sangga_id');
            $table->foreign('sangga_id')->references('id')->on('sanggas');
            $table->string('room_name', 100);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sangga_schedule_rooms');
    }
};
