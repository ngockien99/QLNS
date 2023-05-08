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

        $data = [
            "day_create" => $today,
            "type" => $request->type,
            "date" => $request->date,
            "manager_id" => $user->manager_id,
            "user_id" => $user->id
        ];

        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->annual_leave >= $request->time_leave && $user->work_status === config('constants.work_status.doing')) {
                $data["check_paid"] = config('constants.log_request.check_paid.paid');
            } else {
                $data["check_paid"] = config('constants.log_request.check_paid.unpaid');
            }

            if ($request->time_leave === config('constants.log_request.time_leave.morning') || $request->time_leave === config('constants.log_request.time_leave.afternoon')) {
                $data["time_leave"] = 0.5;
            } else if ($request->time_leave === config('constants.log_request.time_leave.allday')) {
                $data["time_leave"] = 1;
            } else {
                return $this->responseError('Lỗi hệ thống');
            }
            $data["reason"] = $request->reason;
        }

        if ($request->type === config('constants.log_request.type.OT')) {
            $data["title"] = $request->title;
            $data["time_ot_start"] = $request->time_ot_start;
            $data["time_ot_end"] = $request->time_ot_end;
        }

        $logRequest = LogRequestModel::create($data);
        Log::info($logRequest->manager_id);

        $manager = User::findOrFail($logRequest->manager_id);

        $manager->notify(new NotifiManager($manager));

        if ($request->type === config('constants.log_request.type.leave')) {
            if ($user->annual_leave >= $request->time_leave && $user->work_status === config('constants.work_status.doing')) {
                $user->update(['annual_leave' => $user->annual_leave - $request->time_leave]);
            }
        }
        return $this->responseSuccess(['success' => 'Tạo request thành công']);

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

            $user->update(['annual_leave' => $user->annual_leave + $logRequest->time_leave]);

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
}
