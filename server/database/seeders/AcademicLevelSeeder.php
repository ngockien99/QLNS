<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AcademicLevel;

class AcademicLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicLevel = new AcademicLevel();
        $academicLevel->name = 'Thuỷ Lợi';
        $academicLevel->specialized = 'Đang trong quá trình học tập, đi thực tập làm quen môi trường công ty,...';
        $academicLevel->rank = 3;
        $academicLevel->save();
    }
}
