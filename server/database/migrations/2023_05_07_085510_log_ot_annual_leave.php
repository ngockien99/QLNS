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
        Schema::create('log_request', function (Blueprint $table) {
            $table->id();

            $table->string('day_create'); // ngày tạo request
            $table->integer('type'); // nghỉ phép hay OT
            $table->string('date'); // ngày áp dụng
            $table->integer('manager_id'); // người quản lý
            $table->integer('status')->default(0); // trạng thái

            // Nghi phép
            $table->string('reason')->nullable(); // lý do
            $table->double('time_leave')->nullable(); // Thời gian nghỉ (nửa ngày hoặc 1)
            $table->integer('check_paid'); // check xem nghỉ có lương hay không lương
            // OT
            $table->string('title')->nullable(); // tiêu đề
            $table->integer('time_ot_start')->nullable(); // thời gian bắt đầu ot
            $table->integer('time_ot_end')->nullable(); // thời gian kết thúc ot
            
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
        //
    }
};
