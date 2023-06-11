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
        Schema::create('timekeeping', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->time('checkin', $precision = 0)->nullable();
            $table->time('checkout', $precision = 0)->nullable();
            $table->integer('late')->nullable();
            $table->double('work_day')->nullable();
            $table->unsignedInteger('request_id')->nullable();
            $table->double('approve_work_day')->nullable();

            $table->foreignId('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timekeeping');
    }
};
