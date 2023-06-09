<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = 'Admin';
        $user->email = 'dungshinichi99@gmail.com';
        $user->password = Hash::make('12345678');
        $user->address = "Hà Nội";
        $user->cccd = "0123455";
        $user->mst = "012345";
        $user->manager_id = 1;
        $user->role = 2;
        $user->level_id = 2;   // Inter
        $user->academic_level_id = 1;
        $user->department_id = 1;  // NVCT
        $user->position_id = 1;  // HB1
        $user->specialize_id = 1; // Other
        $user->salary_id = 1;
        $user->save();
    }
}
