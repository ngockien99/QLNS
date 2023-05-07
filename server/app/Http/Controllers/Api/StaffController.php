<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StaffRequest;
use App\Http\Requests\LogRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Salary;
use App\Models\Timekeeping;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;


class StaffController extends Controller
{
    public function detailStaff(Request $request) {
        $getUser = $this->getUser($request);
        if ($getUser) {
            $user = User::findOrFail($getUser->id);
            $user->file = config('app.linkFile') . '/uploads/user/' . $user->avatar;

            $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
            $findToday = Timekeeping::where('user_id', $user->id)->where('date', $today)->first();
            
            $data = [
                "user" => $user,
                "academic" => AcademicLevel::where('id', $user->academic_level_id)->first(),
                "salary" => Salary::where('id', $user->salary_id)->first(),
                "checkin" => $findToday->checkin ? true : false,
                "checkout" => $findToday->checkout ? true : false,
            ];
            return $this->responseSuccess($data);
        } else {
            return $this->responseError('Lỗi hệ thống');
        }
        
    } 

    public function updateStaff(StaffRequest $request) {
        $validated = $request->validated();

        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);

        $fileOld = User::find($getUser->id)->avatar;

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

        if (Hash::check($request->old_password, $user->password)) {
            $data = [
                'avatar' => $fileNameToStore,
                'password' => Hash::make($request->new_password),
            ];

            $user = $user->update($data);
            return $this->responseSuccess(['success' => 'Cập nhật thành công']);
        } else {
            return $this->responseError('Mật khẩu cũ không đúng');
        }
    }

    public function createLeave(LogRequest $request) {
        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
    }

    public function refuseLogRequest() {

    }

    public function acceptLogRequest() {
        
    }

    public function getUser($request) {
        $token = $request->bearerToken();
        $getUser = JWTAuth::toUser(JWTAuth::setToken($token)->getPayload());

        return $getUser;
    }
}
