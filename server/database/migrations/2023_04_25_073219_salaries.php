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
        Schema::create('salary', function (Blueprint $table) {
            $table->id();

            $table->integer('salary_basic');  // Lương cơ bản
            $table->integer('salary_factor'); // Hệ số lương
            $table->integer('allowance_money')->default(0); // Tiền phụ cấp
            $table->integer('insurance_premium_salary'); // Lương đóng bảo hiểm
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary');
    }
};
