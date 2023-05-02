<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            PositionSeeder::class,
            SpecializeSeeder::class,
            LevelSeeder::class,
            AcademicLevelSeeder::class,
            SalarySeeder::class,
            UserSeeder::class,
            PayrollSeeder::class,
        ]);
    }
}
