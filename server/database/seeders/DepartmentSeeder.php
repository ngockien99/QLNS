<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use Illuminate\Support\Facades\Log;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dep = new Department();
        $dep->code = '111';
        $dep->name = '222';
        $dep->status = 1;
        $dep->description = 'ok';
        $dep->head_of_department_id = 1;
        $dep->save();
    }
}
