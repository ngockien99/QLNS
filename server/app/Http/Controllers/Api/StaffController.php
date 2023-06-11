<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StaffRequest;
use App\Http\Requests\LogRequest;
use App\Http\Requests\LogUpdateRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Department;
use App\Models\Level;
use App\Models\Salary;
use App\Models\Timekeeping;
use App\Models\LogRequestModel;
use App\Models\Position;
use App\Models\Specialize;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Notifications\NotifiManager;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class StaffController extends Controller
{
    public function detailStaff(Request $request) {
        $getUser = $this->getUser($request);
        if ($getUser) {
            $user = User::findOrFail($getUser->id);
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
        \DB::transaction(function() use ($request, &$logRequest, &$data){
            $getUser = $this->getUser($request);
            $user = User::findOrFail($getUser->id);
            $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
            $period = CarbonPeriod::create($request->date[0], $request->date[1]);

            $data = [];
            if ($request->type === config('constants.log_request.type.leave')) {
                foreach ($period as $key => $date) {
                    $log = LogRequestModel::where('date', $date->format('Y-m-d'))->where('time_leave', $request->time_leave)->first();
                    if ($log) {
                        continue;
                    }
                    $params = [
                        "day_create" => $today,
                        "type" => $request->type,
                        "date" => $date->format('Y-m-d'),
                        "manager_id" => $user->manager_id,
                        "user_id" => $user->id
                    ];
                
                    // check xem ngày phép có lớn hơn ngày tạo nghỉ không
                    $dayLeave = $this->calculateDayLeave($request->time_leave);
                    if ($user->annual_leave >= $dayLeave && $user->work_status === config('constants.work_status.doing')) {
                        $params["check_paid"] = config('constants.log_request.check_paid.paid');
                        $user->update(['annual_leave' => $user->annual_leave - $dayLeave]);
                    } else {
                        $params["check_paid"] = config('constants.log_request.check_paid.unpaid');
                    }

                    $params["time_leave"] = $request->time_leave;
                    $params["reason"] = $request->reason;

                    array_push($data, $params);
                }
                $logRequest = LogRequestModel::insert($data);
            }

            if ($request->type === config('constants.log_request.type.OT')) {

                $data["day_create"] = $today;
                $data["type"] = $request->type;
                $data["date"] = new Carbon($request->date[0]);
                $data["manager_id"] = $user->manager_id;
                $data["user_id"] = $user->id;
                $data["title"] = $request->title;
                $data["time_ot_start"] = $request->time_ot_start;
                $data["time_ot_end"] = $request->time_ot_end;
                $log = LogRequestModel::where('date', new Carbon($request->date[0]))->first();

                if ($log) {
                    $data = [];
                } else {
                    $logRequest = LogRequestModel::create($data);
                }
            }

            $manager = User::findOrFail($user->manager_id);

            $manager->notify(new NotifiManager($manager));
        });

        if (count($data)) {
            return $this->responseSuccess(['success' => 'Tạo request thành công']);
        } else {
            return $this->responseError('Ngày nghỉ (OT) đã tồn tại');
        }
    }

    public function updateRequest(LogUpdateRequest $request) {
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

            $user->update(['annual_leave' => $user->annual_leave + $this->calculateDayLeave($logRequest->time_leave)]);

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

            $this->updateTimeKeeping($logRequest);

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

    public function updateTimeKeeping($request) {
        $logRequest = $request;
        $timekeeping = Timekeeping::where('date', $logRequest->date)->first();
        
        if ($timekeeping) {

            // Giờ check quy đinh
            $startCheck = new Carbon('08:00:00');
            $endCheck = new Carbon('17:00:00');
            if ($logRequest->time_leave == config('constants.log_request.time_leave.morning')) {
                $startCheck = new Carbon('13:00:00');
                $endCheck = new Carbon('17:00:00');
                $totalLate = $this->leaveMorning($timekeeping, $startCheck, $endCheck);
                
                $data = [
                    'request_id' => $logRequest->id,
                    'work_day' => round(((480 - ($totalLate + 240)) / 480), 2)
                ];

                if ($logRequest->check_paid == config('constants.log_request.check_paid.paid')) {
                    $data['approve_work_day'] = round(((480 - $totalLate) / 480), 2);
                }
                if ($logRequest->check_paid == config('constants.log_request.check_paid.unpaid')) {
                    $data['approve_work_day'] = round(((480 - ($totalLate + 240)) / 480), 2);
                }

                $timekeeping->update($data);

            } else if ($logRequest->time_leave == config('constants.log_request.time_leave.afternoon')) {
                $startCheck = new Carbon('08:00:00');
                $endCheck = new Carbon('12:00:00');
                $totalLate = $this->leaveAfternoon($timekeeping, $startCheck, $endCheck);

                $data = [
                    'request_id' => $logRequest->id,
                    'work_day' => round(((480 - ($totalLate + 240)) / 480), 2)
                ];

                if ($logRequest->check_paid == config('constants.log_request.check_paid.paid')) {
                    $data['approve_work_day'] = round(((480 - $totalLate) / 480), 2);
                }
                if ($logRequest->check_paid == config('constants.log_request.check_paid.unpaid')) {
                    $data['approve_work_day'] = round(((480 - ($totalLate + 240)) / 480), 2);
                }

                $timekeeping->update($data);

            } else if ($logRequest->time_leave === config('constants.log_request.time_leave.allday')) {
                $data = [
                    'request_id' => $logRequest->id,
                    'work_day' => 0,
                ];

                if ($logRequest->check_paid == config('constants.log_request.check_paid.paid')) {
                    $data['approve_work_day'] = 1;
                }
                if ($logRequest->check_paid == config('constants.log_request.check_paid.unpaid')) {
                    $data['approve_work_day'] = 0;
                }

                $timekeeping->update($data);
            }
            
        }
    }

    public function leaveMorning($findToday, $startCheck, $endCheck) {
        $totalLate = '';
        $checkin = Carbon::parse($findToday->checkin);
        $checkout = Carbon::parse($findToday->checkout);

        // Tính toán giờ đi muộn
        $lateMorning = 0;
        if ($checkin <= $startCheck) {
            $lateMorning = 0;
        }
        if ($checkin > $startCheck) {
            $lateMorning = $checkin->diffInMinutes($startCheck);
        }

        // Tính toán giờ đi về sớm
        $lateAfternoon = 0;
        if ($checkout >= $endCheck) {
            $lateAfternoon = 0;
        }
        if ($checkout < $endCheck) {
            $lateAfternoon = $endCheck->diffInMinutes($checkout);
        }
        if ($checkout < $startCheck) {
            $lateAfternoon = 240;
        }
        
        $totalLate = $lateMorning + $lateAfternoon;

        return $totalLate;
    }

    public function leaveAfternoon ($findToday, $startCheck, $endCheck) {
        $totalLate = '';
        $checkin = Carbon::parse($findToday->checkin);
        $checkout = Carbon::parse($findToday->checkout);

        // Tính toán giờ đi muộn
        $lateMorning = 0;
        if ($checkin <= $startCheck) {
            $lateMorning = 0;
        }
        if ($checkin > $startCheck) {
            $lateMorning = $checkin->diffInMinutes($startCheck);
        }

        // Tính toán giờ đi về sớm
        $lateAfternoon = 0;
        if ($checkout >= $endCheck) {
            $lateAfternoon = 0;
        }
        if ($checkout < $endCheck) {
            $lateAfternoon = $endCheck->diffInMinutes($checkout);
        }
        if ($checkout < $startCheck) {
            $lateAfternoon = 240;
        }
        
        $totalLate = $lateMorning + $lateAfternoon;

        return $totalLate;
    }
}
