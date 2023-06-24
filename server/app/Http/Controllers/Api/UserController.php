<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Timekeeping;
use App\Models\Salary;
use App\Models\LogRequestModel;
use App\Models\Department;
use App\Models\Level;
use App\Models\Position;
use App\Models\Specialize;
use App\Models\HistorySalary;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Throwable;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    // function __construct() {
    //     $user = JWTAuth::toUser(JWTAuth::getToken());
    //     if (!($user->role_admin & 16)) {
    //         $this->responseError();
    //     }
    // }

    public function listUser(Request $request) {
        $key_search = $request->keyword;
        $manager = $request->manager;
        $department_id = $request->department;
        $position_id = $request->position_id;
        $user = DB::table('users')
        ->when(isset($position_id), function ($query) use ($position_id) {
            return $query->where('position_id', 'like', "%$position_id%");
        })
        ->when(isset($department_id), function ($query) use ($department_id) {
            return $query->where('department_id', 'like', "%$department_id%");
        })
        ->when(isset($manager), function ($query) use ($manager) {
            return $query->where('manager_id', 'like', "%$manager%");
        })
        ->where(function ($query) use($key_search) {
            $query->where('users.email', 'like', "%$key_search%")
                  ->orWhere('users.name', 'like', "%$key_search%")
                  ->orWhere('users.address', 'like', "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        if ($user) {
            $user->getCollection()->transform(function ($value) {
                $value->avatar = $value->avatar ? config('app.linkFile') . '/uploads/user/' . $value->avatar : "";
                return $value;
            });
        }

        return $this->responseSuccess($user);
    }

    public function updateUser(UpdateUserRequest $request) {
        $validated = $request->validated();
        $data = $request->all();

        $user = User::findOrFail($request->id);
        $fileOld = User::find($request->id)->avatar;
        $fileNameToStore = '';
        if($request->hasFile('avatar')){
            $filenameWithExt = $request->file('avatar')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('avatar')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            $path = $request->file('avatar')->move('uploads/user/', $fileNameToStore);
            if ($fileOld) {
                File::delete(public_path("uploads/user/".$fileOld));
            }

            $data['avatar'] = $fileNameToStore;
        }


        $academic = AcademicLevel::findOrFail($user->academic_level_id);
        $academic->update([
            'name' => $request->academic_name ? $request->academic_name : $academic->name,
            'specialized' => $request->academic_specialized ? $request->academic_specialized : $academic->specialized,
            'rank' => $request->academic_rank ? $request->academic_rank : $academic->rank
        ]);

        $salary = Salary::findOrFail($user->salary_id);

        if ($request->salary_basic != $salary->salary_basic || $request->salary_factor != $salary->salary_factor || $request->allowance_money != $salary->allowance_money) {
            HistorySalary::create([
                'salary_before' => $salary->salary_basic + $salary->salary_factor + $salary->allowance_money,
                'salary_after' => $request->salary_basic + $request->salary_factor + $request->allowance_money,
                'date' => Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d'),
                'user_update' => $this->getUser($request)->id,
                'user_id' => $user->id
            ]);
        }

        Salary::findOrFail($user->salary_id)->update([
            'salary_basic' => $request->salary_basic,
            'salary_factor' => $request->salary_factor,
            'allowance_money' => $request->allowance_money,
            'insurance_premium_salary' => $request->insurance_premium_salary
        ]);


        $user = $user->update($data);
        return $this->responseSuccess(['success' => 'Cập nhật nhân viên thành công']);
    }

    public function createUser(UserRequest $request) {
        $validated = $request->validated();

        $fileNameToStore = '';
        if($request->hasFile('avatar')){
            $filenameWithExt = $request->file('avatar')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('avatar')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            $path = $request->file('avatar')->move('uploads/user/', $fileNameToStore);
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
            'password' => Hash::make(12345678),
            'avatar' => $fileNameToStore,
            'address' => $request->address,
            'phone' => $request->phone,
            'cccd' => $request->cccd,
            'mst' => $request->mst,
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
            'salary_id' => $salary->id,
            'date_of_birth' => $request->date_of_birth
        ];

        $user = User::create($data);
        return $this->responseSuccess(['success' => 'Thêm nhân viên thành công']);
    }

    public function detailUser(Request $request) {
        $user = User::findOrFail($request->id);
        if ($user->avatar) {
            $user->avatar = config('app.linkFile') . '/uploads/user/' . $user->avatar;
        }
        $user->manager_name = User::find($user->manager_id) ? User::find($user->manager_id)->name : null;

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $findToday = Timekeeping::where('user_id', $user->id)->where('date', $today)->first();

        $month = Carbon::now()->format('Y-m');
        $logRequestPaid = LogRequestModel::where('user_id', $user->id)
        ->where('day_create', 'like', "%$month%")
        ->where('check_paid', config('constants.log_request.check_paid.paid'))
        ->where('status', config('constants.log_request.status.approve'))
        ->count();

        $checkManager = User::where('manager_id', $user->id)->first();
        $leave = [
            "total_leave" => 12,
            "leave_used" =>  12 - $user->annual_leave,
            "leave_remaining" => $user->annual_leave,
            "leave_used_pay" =>  $logRequestPaid
        ];
        $data = [
            "user" => $user,
            "check_manager" => $checkManager ? true : false,
            "academic" => AcademicLevel::where('id', $user->academic_level_id)->first(),
            "salary" => Salary::where('id', $user->salary_id)->first(),
            "department" => Department::findOrFail($user->department_id),
            "level" => Level::findOrFail($user->level_id),
            "leave" => $leave,
            "checkin" => $findToday && $findToday->checkin ? true : false,
            "checkout" => $findToday && $findToday->checkout ? true : false,
            "manager" => $user->manager_name,
            "position" => Position::findOrFail($user->position_id),
            "specialize" => Specialize::findOrFail($user->specialize_id)
        ];
        return $this->responseSuccess($data);
    }

    public function deleteUser(Request $request) {
        $user = User::find($request->id);
        if ($user->avatar) {
            File::delete(public_path("uploads/user/".$user->image));
        }
        $timeSheet = Timekeeping::where('user_id', $user->id)->first();
        $salary = Salary::where('id', $user->salary_id)->first();

        if (!$timeSheet && !$salary) {
            $user->delete();
            return $this->responseSuccess('Xóa nhân viên thành công');
        } else {
            return $this->responseError('Có bản ghi liên kết với bảng khóa ngoại');
        }
    }

    public function getUser($request) {
        $token = $request->bearerToken();
        $getUser = JWTAuth::toUser(JWTAuth::setToken($token)->getPayload());

        return $getUser;
    }
}
