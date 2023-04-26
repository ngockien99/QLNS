<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $level = new Level();
        $level->name = 'Intership';
        // $level->description = 'Đang trong quá trình học tập, đi thực tập làm quen môi trường công ty,...';
        $level->salary_factor = 3.5;
        $level->save();

        $level = new Level();
        $level->name = 'Fresher';
        // $level->description = 'Mới ra trường chưa có kinh nghiệm hoặc dưới 1 năm kinh nghiệm,...';
        $level->salary_factor = 4;
        $level->save();

        $level = new Level();
        $level->name = 'Junior';
        // $level->description = 'Có từ < 2 năm kinh nghiệm,...';
        $level->salary_factor = 5;
        $level->save();
    }
}
