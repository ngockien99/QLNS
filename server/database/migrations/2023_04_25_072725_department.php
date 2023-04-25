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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10);
            $table->string('name', 255);
            $table->tinyInteger('status')->default(1); //Xác định xem có còn hoạt động hay không 1: hoạt động, 0: đã nghỉ
            $table->text('description')->nullable();
            $table->bigInteger('head_of_department_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
