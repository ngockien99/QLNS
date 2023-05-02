<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Payroll;

class PayrollSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pay = new Payroll();
        $pay->month_pay = '11/2021';
        $pay->bonus_money = 1;
        $pay->total_working_days_standard = 1;
        $pay->total_working_days = 1;
        $pay->total_money_actual_receive = 1;
        $pay->user_id = 1;
        $pay->save();
    }
}
