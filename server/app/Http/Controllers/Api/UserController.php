<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Timekeeping;
use App\Models\Salary;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Throwable;

class UserController extends Controller
{
    // function __construct() {
    //     $user = JWTAuth::toUser(JWTAuth::getToken());
    //     if (!($user->role_admin & 16)) {
    //         $this->responseError();
    //     }
    // }

    public function listUser(Request $request) {
        $key_search = $request->search;
        $user = DB::table('users')
        ->where(function ($query) use($key_search) {
            $query->where('users.email', 'like' , "%$key_search%")
                  ->orWhere('users.name', 'like' , "%$key_search%")
                  ->orWhere('users.address', 'like' , "%$key_search%");
        })
        ->where('users.role', 'like', 2)
        ->paginate(10,['*'],'page', $request->page);

        if ($user) {
            $user->getCollection()->transform(function ($value) {
                $value->avatar = $value->avatar ? config('app.linkFile') . '/uploads/user/' . $value->avatar : "";
                return $value;
            });
        }

        return $this->responseSuccess($user);
    } 

    public function updateRole(UserRequest $request) {
        $validated = $request->validated();

        $user = User::findOrFail($request->id);
        $fileOld = User::find($request->id)->avatar;
        $fileNameToStore = '';
        if($request->hasFile('file')){
            $filenameWithExt = $request->file('file')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            $path = $request->file('file')->move('uploads/user/', $fileNameToStore);
            if ($fileOld) {
                File::delete(public_path("uploads/user/".$fileOld));
            }
        }

        if ($request->academic_name && $request->academic_specialized && $request->academic_rank) {
            $academic = AcademicLevel::findOrFail($user->academic_level_id)->update([
                'name' => $request->academic_name,
                'specialized' => $request->academic_specialized,
                'rank' => $request->academic_rank
            ]);
        } else {
            return $this->responseError('Bạn chưa nhập đủ thông tin trường đại học của nhân viên');
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $fileNameToStore,
            'address' => $request->address,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'work_status' => $request->work_status,
            'marital_status' => $request->marital_status,
            'start_work' => $request->start_work,
            'end_work' => $request->end_work,
            'salary_basic' => $request->salary_basic,
            'salary_factor' => $request->salary_factor,
            'manager_id' => $request->manager_id,
            'role' => $request->role,
            'level_id' => $request->level_id,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'specialize_id' => $request->specialize_id,
            'academic_level_id' => $user->academic_level_id
        ];

        $user = $user->update($data);
        return $this->responseSuccess(['success' => 'Cập nhật nhân viên thành công']);
    }

    public function createUser(UserRequest $request) {
        $validated = $request->validated();

        $fileNameToStore = '';
        if($request->hasFile('file')){
            $filenameWithExt = $request->file('file')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            $path = $request->file('file')->move('uploads/user/', $fileNameToStore);
        }

        $academic = '';
        if ($request->academic_name && $request->academic_specialize && $request->academic_rank) {
            $academic = AcademicLevel::create([
                'name' => $request->academic_name,
                'specialized' => $request->academic_specialize,
                'rank' => $request->academic_rank
            ]);
        } else {
            return $this->responseError('Bạn chưa nhập đủ thông tin trường đại học của nhân viên');
        }

        if ($request->salary_basic && $request->salary_factor && $request->allowance_money && $request->insurance_premium_salary) {
            $salary = Salary::create([
                'salary_basic' => $request->salary_basic,
                'salary_factor' => $request->salary_factor,
                'allowance_money' => $request->allowance_money,
                'insurance_premium_salary' => $request->insurance_premium_salary
            ]);
        } else {
            return $this->responseError('Bạn chưa nhập đủ thông tin lương của nhân viên');
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $fileNameToStore,
            'address' => $request->address,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'work_status' => $request->work_status,
            'marital_status' => $request->marital_status,
            'start_work' => $request->start_work,
            'end_work' => $request->end_work,
            'manager_id' => $request->manager_id,
            'role' => $request->role,
            'level_id' => $request->level_id,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'specialize_id' => $request->specialize_id,
            'academic_level_id' => $academic->id,
            'salary_id' => $salary->id
        ];

        $user = User::create($data);
        return $this->responseSuccess(['success' => 'Thêm nhân viên thành công']);
    }

    public function detailUser(Request $request) {
        $user = User::findOrFail($request->id);
        $user->file = config('app.linkFile') . '/uploads/user/' . $user->avatar;
        $data = [
            "user" => $user,
            "academic" => AcademicLevel::where('id', $user->academic_level_id)->first(),
            "salary" => Salary::where('id', $user->salary_id)->first(),
        ];
        return $this->responseSuccess($data);
    }

    public function deleteUser(Request $request) {
        $user = User::find($request->id);
        if ($user->avatar) {
            File::delete(public_path("uploads/user/".$user->image));
        }
        $timeSheet = Timekeeping::where('user_id', $user->id)->first();
        $salary = Salary::where('user_id', $user->id)->first();

        if (!$timeSheet && !$salary) {
            $user->delete();
            return $this->responseSuccess('Xóa nhân viên thành công');
        } else {
            return $this->responseError('Có bản ghi liên kết với bảng khóa ngoại');
        }
    }
}
