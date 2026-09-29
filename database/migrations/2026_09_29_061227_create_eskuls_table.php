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

        Schema::create('eskuls', function (Blueprint $table) {
            $table->integer('id')->primary()->autoIncrement();
            $table->string('name', 100);
            $table->enum('type', ["ESKUL","SENBUD","PRAMUKA"]);
            $table->integer('instruktur_id');
            $table->foreign('instruktur_id')->references('id')->on('users');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eskuls');
    }
};
