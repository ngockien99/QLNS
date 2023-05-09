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
use App\Models\LogRequestModel;
use Carbon\Carbon;
use App\Notifications\NotifiManager;
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
            
            $month = Carbon::now()->format('Y-m');
            $logRequestPaid = LogRequestModel::where('user_id', $user->id)
            ->where('day_create', 'like', "%$month%")
            ->where('check_paid', config('constants.log_request.check_paid.paid'))
            ->where('status', config('constants.log_request.status.approve'))
            ->count();

            $leave = [
                "total_leave" => 12,
                "leave_used" =>  12 - $user->annual_leave,
                "leave_remaining" => $user->annual_leave,
                "leave_used_pay" =>  $logRequestPaid
            ];

            $data = [
                "user" => $user,
                "academic" => AcademicLevel::where('id', $user->academic_level_id)->first(),
                "salary" => Salary::where('id', $user->salary_id)->first(),
                "leave" => $leave,
                "checkin" => $findToday && $findToday->checkin ? true : false,
                "checkout" => $findToday && $findToday->checkout ? true : false,
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

    public function createRequest(LogRequest $request) {
        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');

        $data = [
            "day_create" => $today,
            "type" => $request->type,
            "date" => $request->date,
            "manager_id" => $user->manager_id,
            "user_id" => $user->id
        ];

        if ($request->type === config('constants.log_request.type.leave')) {
            // check xem ngày phép có lớn hơn ngày tạo nghỉ không
            if ($user->annual_leave >= $request->time_leave && $user->work_status === config('constants.work_status.doing')) {
                $data["check_paid"] = config('constants.log_request.check_paid.paid');
            } else {
                $data["check_paid"] = config('constants.log_request.check_paid.unpaid');
            }

            $data["time_leave"] = $request->time_leave;
            $data["reason"] = $request->reason;
        }

        if ($request->type === config('constants.log_request.type.OT')) {
            $data["title"] = $request->title;
            $data["time_ot_start"] = $request->time_ot_start;
            $data["time_ot_end"] = $request->time_ot_end;
        }

        $logRequest = LogRequestModel::create($data);

        $manager = User::findOrFail($logRequest->manager_id);

        // $manager->notify(new NotifiManager($manager));

        $dayLeave = $this->calculateDayLeave($request->time_leave);
        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->annual_leave >= $dayLeave && $user->work_status === config('constants.work_status.doing')) {
                $user->update(['annual_leave' => $user->annual_leave - $dayLeave]);
            }
        }
        return $this->responseSuccess(['success' => 'Tạo request thành công']);

    }

    public function updateRequest(LogRequest $request) {
        $logLeaveOt = LogRequestModel::findOrFail($request->id);

        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');

        $data = [
            "date" => $request->date,
        ];

        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->annual_leave >= $request->time_leave && $user->work_status === config('constants.work_status.doing')) {
                $data["check_paid"] = config('constants.log_request.check_paid.paid');
            } else {
                $data["check_paid"] = config('constants.log_request.check_paid.unpaid');
            }

            $data["time_leave"] = $request->time_leave;
            $data["reason"] = $request->reason;
        }

        if ($request->type === config('constants.log_request.type.OT')) {
            $data["title"] = $request->title;
            $data["time_ot_start"] = $request->time_ot_start;
            $data["time_ot_end"] = $request->time_ot_end;
        }

        // cộng thêm số ngày tạo request
        $dayLeaveBefore = $this->calculateDayLeave($logLeaveOt->time_leave);
        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->work_status === config('constants.work_status.doing')) {
                $user->update(['annual_leave' => $user->annual_leave + $dayLeaveBefore]);
            }
        }

        $logLeaveOt->update($data);

        // trừ số ngày phép vừa sửa
        $dayLeaveAfter = $this->calculateDayLeave($logLeaveOt->time_leave);
        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->annual_leave >= $dayLeaveAfter && $user->work_status === config('constants.work_status.doing')) {
                $user->update(['annual_leave' => $user->annual_leave - $dayLeaveAfter]);
            }
        }
        return $this->responseSuccess(['success' => 'Cập nhật request thành công']);
        
    }

    public function deleteRequest(Request $request) {
        $logLeaveOt = LogRequestModel::findOrFail($request->id);
        $user = User::findOrFail($logLeaveOt->user_id);

        // cộng thêm số ngày phép khi xoá request
        $dayLeave = $this->calculateDayLeave($logLeaveOt->time_leave);
        if ($logLeaveOt->status === config('constants.log_request.type.leave')) {
            if ($user->work_status === config('constants.work_status.doing')) {
                $user->update(['annual_leave' => $user->annual_leave + $dayLeave]);
            }
        }

        $logLeaveOt->delete();
        return $this->responseSuccess(['success' => 'Xoá request thành công']);

    }

    public function rejectLogRequest(Request $request) {
        $logRequest = LogRequestModel::findOrFail($request->id);
        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);
        if ($logRequest && $logRequest->manager_id === $user->id && $logRequest->status === config('constants.log_request.status.pending')) {
            $data = [
                'status' => config('constants.log_request.status.reject')
            ];

            $logRequest->update($data);

            $user->update(['annual_leave' => $user->annual_leave + $this->calculateDayLeave($logLeaveOt->time_leave)]);

            return $this->responseSuccess(['success' => 'Từ chối request thành công']);

        } else {
            return $this->responseError('Lỗi hệ thống');
        }
    }

    public function approveLogRequest(Request $request) {
        $logRequest = LogRequestModel::findOrFail($request->id);
        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);
        if ($logRequest && $logRequest->manager_id === $user->id && $logRequest->status === config('constants.log_request.status.pending')) {
            $data = [
                'status' => config('constants.log_request.status.approve')
            ];

            $logRequest->update($data);
            return $this->responseSuccess(['success' => 'Chấp nhận request thành công']);

        } else {
            return $this->responseError('Lỗi hệ thống');
        }
    }

    public function listRequest(Request $request) {
        $month = Carbon::now()->format('Y-m');
        $getUser = $this->getUser($request);
        $user = User::findOrFail($getUser->id);
        $logRequestMe = LogRequestModel::where('user_id', $user->id)
            ->where('day_create', 'like', "%$month%")
            ->get();
        $logRequestLower = LogRequestModel::where('manager_id', $user->id)
            ->where('day_create', 'like', "%$month%")
            ->where('status', config('constants.log_request.status.pending'))
            ->get();

        $data = [
            'my_request' => $logRequestMe,
            'people_request' => $logRequestLower
        ];

        return $this->responseSuccess($data);
    }

    public function getUser($request) {
        $token = $request->bearerToken();
        $getUser = JWTAuth::toUser(JWTAuth::setToken($token)->getPayload());

        return $getUser;
    }

    public function calculateDayLeave($day) {
        if ($day == config('constants.log_request.time_leave.morning') || $day == config('constants.log_request.time_leave.afternoon')) {
            return 0.5;
        } else if ($day == config('constants.log_request.time_leave.allday')) {
            return 1;
        } else {
            return $this->responseError('Truyền không đúng định dạng');
        }
    }
}
