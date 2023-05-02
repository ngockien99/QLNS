<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Specialize;

class SpecializeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $spe = new Specialize();
        $spe->name = 'test';
        $spe->description = 'description';
        $spe->save();
    }
}
