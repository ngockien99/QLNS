<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Salary;

class SalarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sa = new Salary();
        $sa->salary_basic = 5000000;
        $sa->salary_factor = 9000000;
        $sa->allowance_money = 1000000;
        $sa->insurance_premium_salary = 500000;
        $sa->save();
    }
}
