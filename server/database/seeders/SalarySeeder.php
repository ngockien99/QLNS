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
        $sa->salary_basic = 1;
        $sa->salary_factor = 1;
        $sa->allowance_money = 1;
        $sa->insurance_premium_salary = 1;
        $sa->save();
    }
}
