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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('date_of_birth')->nullable();
            $table->tinyInteger('gender')->default(1); //1: male, 2: female
            $table->tinyInteger('work_status')->default(1); //trạng thái: làm việc, đã nghỉ,...
            $table->tinyInteger('marital_status')->default(1); //tình trạng hôn nhân: 1: single
            $table->date('start_work')->nullable(); // ngày bắt đầu công việc
            $table->date('end_work')->nullable(); // ngày kết thúc công việc
            $table->bigInteger('manager_id'); // id người quản lý
            $table->double('annual_leave')->default(12);; // số ngày phép trong năm
            $table->integer('role');

            $table->foreignId('level_id');
            $table->foreign('level_id')->references('id')->on('level')->onDelete('cascade');

            $table->foreignId('salary_id');
            $table->foreign('salary_id')->references('id')->on('salary')->onDelete('cascade');

            $table->foreignId('academic_level_id');
            $table->foreign('academic_level_id')->references('id')->on('academic_level')->onDelete('cascade');

            $table->foreignId('department_id');
            $table->foreign('department_id')->references('id')->on('department')->onDelete('cascade');

            $table->foreignId('position_id');
            $table->foreign('position_id')->references('id')->on('position')->onDelete('cascade');

            $table->foreignId('specialize_id');
            $table->foreign('specialize_id')->references('id')->on('specialize')->onDelete('cascade');

            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
