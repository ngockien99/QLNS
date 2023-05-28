<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RewardDiscipline;

class RewardDisciplineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rd = new RewardDiscipline();
        $rd->type = 0;
        $rd->date = '2023/05/20';
        $rd->money = 100000;
        $rd->reason = 'Thích thì thưởng';
        $rd->user_id = 1;
        $rd->save();

        $rd1 = new RewardDiscipline();
        $rd1->type = 1;
        $rd1->date = '2023/05/19';
        $rd1->money = 100000;
        $rd1->reason = 'Thích thì phạt';
        $rd1->user_id = 1;
        $rd1->save();
    }
}
