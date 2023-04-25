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
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();

            $table->double('salary_basic');  // Lương cơ bản
            $table->double('salary_factor'); // Hệ số lương
            $table->double('allowance_money')->default(0); // Tiền phụ cấp
            $table->double('bonus_money')->default(0);   // Tiền thưởng
            $table->double('insurance_premium_salary'); // Lương đóng bảo hiểm

            $table->string('month_pay'); // Tháng trả lương
            $table->integer('total_working_days_standard'); // Công chuẩn
            $table->integer('total_working_days'); // Tổng ngày tính công

            $table->double('total_money_actual_receive'); // Tiền thực nhận

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
        Schema::dropIfExists('salaries');
    }
};
