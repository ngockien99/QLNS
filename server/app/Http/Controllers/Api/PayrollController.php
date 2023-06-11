<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Payroll;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\PayrollRequest;
use App\Models\LogRequestModel;
use App\Models\RewardDiscipline;
use App\Models\Timekeeping;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function listPayroll(Request $request) {
        $key_search = $request->search;
        $payroll = DB::table('payroll')
        ->where(function ($query) use($key_search) {
            $query->where('payroll.month_pay', 'like' , "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        $payroll->getCollection()->transform(function ($value) {
            $pay = Payroll::findOrFail($value->id);
            $user = User::where('id', $value->user_id)->first();
            $salary = Salary::where('id', $user->salary_id)->first();
            
            $data = [
                'payroll' => $pay,
                'user' => $user,
                'salary' => $salary
            ];
            return $data;
        });

        return $this->responseSuccess($payroll);
    }
    
    public function detailPayroll(Request $request) {
        $payroll = Payroll::findOrFail($request->id);
        $user = User::where('id', $payroll->user_id)->first();
        $salary = Salary::where('id', $user->salary_id)->first();
        
        $data = [
            'payroll' => $payroll,
            'user' => $user,
            'salary' => $salary
        ];
        return $this->responseSuccess($data);
    }

    public function deletePayroll(Request $request) {
        $payroll = Payroll::findOrFail($request->id);
        $payroll->delete();
        return $this->responseSuccess('Xóa thành công');
    }

    public function createPayroll(PayrollRequest $request) {
        $user = User::findOrFail($request->user_id);
        $salary = Salary::where('id', $user->salary_id)->first();

        $firstMonth = Carbon::now()->subMonth()->firstOfMonth()->format('Y-m-d');
        $lastMonth = Carbon::now()->subMonth()->lastOfMonth()->format('Y-m-d');

        $month = Carbon::now()->subMonth()->format('Y-m');

        // check xem bảng công đã tồn tại hay chưa
        $checkPayroll = Payroll::where('month_pay', $month)->where('user_id', $request->user_id)->first();
        if ($checkPayroll) {
            return $this->responseError('Bảng công của nhân viên đã tồn tại');
        }

        // Tổng ngày chấm công
        $totalDayWork = Carbon::parse($firstMonth)->diffInDaysFiltered(function (Carbon $date){
            return $date->isWeekday();
        }, $lastMonth);

        // Tổng số ngày công nghỉ có phép
        $leaves = LogRequestModel::where('type', config('constants.log_request.type.leave'))->where('date', 'like', "%$month%")->get();
        $leave_paid = 0;
        $leave_unpaid = 0;
        foreach ($leaves as $leave) {
            if ($leave->check_paid == config('constants.log_request.check_paid.paid')) {
                $leave_paid = $leave_paid + $this->calculateDayLeave($leave->time_leave);
            }
            if ($leave->check_paid == config('constants.log_request.check_paid.unpaid')) {
                $leave_unpaid = $leave_unpaid + $this->calculateDayLeave($leave->time_leave);
            }
        }

        // Tính tiền OT

        $OTs = LogRequestModel::where('type', config('constants.log_request.type.OT'))->where('date', 'like', "%$month%")->get();
        $countOt = 0;
        foreach ($OTs as $OT) {
            $countOt = $countOt + Carbon::parse($OT->time_ot_end)->diffInMinutes(Carbon::parse($OT->time_ot_start));
        }
        $otMoney = round(((($salary->salary_basic + $salary->salary_factor + $salary->allowance_money) / (480 * $totalDayWork)) * $countOt), 2) * 1.5;
        
        // tính công ngày mình chấm công
        $timeSheet = Timekeeping::where('date', 'like', "%$month%")->where('user_id', $request->user_id)->get();
        $totalWorkDayUser = 0;
        foreach($timeSheet as $time) {
            $totalWorkDayUser += $time->work_day;
        }

        // Tính tiền khen thưởng kỉ luật
        $reward = RewardDiscipline::where('date', 'like', "%$month%")->where('type', config('constants.rewardDiscipline.reward'))->where('user_id', $request->user_id)->sum('money');

        // Tính tiền khen thưởng kỉ luật
        $discipline = RewardDiscipline::where('date', 'like', "%$month%")->where('type', config('constants.rewardDiscipline.discipline'))->where('user_id', $request->user_id)->sum('money');
        

        // Tính toán tổng số tiền chưa trừ
        $totalMoney = round(((($salary->salary_basic + $salary->salary_factor + $salary->allowance_money + $request->bonus_money + $otMoney + $reward + $discipline) * $totalWorkDayUser) / $totalDayWork), 2);
        
        // // Tính toán trừ thuế
        $tax = 0;
        if ($totalMoney > 11000000) {
            $tax = ($totalMoney-11000000) * 0.05;
        }
        
        $realMoneyReceived = $totalMoney - $salary->insurance_premium_salary - $tax;

        $exportFile = [
            'gross' => $salary->salary_basic + $salary->salary_factor + $salary->allowance_money,
            'salary_basic' => $salary->salary_basic,
            'salary_factor' => $salary->salary_factor,
            'allowance_money' => $salary->allowance_money,
            'total_working_days_standard' => $totalDayWork,
            'total_working_days' => $totalWorkDayUser,
            'leave_paid' => $leave_paid,
            'leave_unpaid' => $leave_unpaid,
            'bonus_money' => $request->bonus_money,
            'reward' => $reward,
            'discipline' => $discipline,
            'ot' => $otMoney,
            'total_money' => $totalMoney,
            'insurance_premium_salary' => $salary->insurance_premium_salary,
            'tax' => $tax,
            'real_money_received' => $realMoneyReceived,
        ];

        $data = [
            'month_pay' => $month,
            'bonus_money' => $request->bonus_money,
            'total_working_days_standard' => $totalDayWork,
            'total_working_days' => $totalWorkDayUser,
            'tax' => $tax,
            'total_money_actual_receive' => $totalMoney,
            'user_id' => $user->id,
            'info_payroll' => $exportFile
        ];
        $payroll = Payroll::create($data);

        return $this->responseSuccess('Thêm bảng lương thành công');
    }

    public function updatePayroll(PayrollRequest $request) {

        $firstMonth = Carbon::now()->subMonth()->firstOfMonth()->format('Y-m-d');
        $lastMonth = Carbon::now()->subMonth()->lastOfMonth()->format('Y-m-d');

        $month = Carbon::now()->subMonth()->format('Y-m');


        $totalDayWork = Carbon::parse($firstMonth)->diffInDaysFiltered(function (Carbon $date){
            return $date->isWeekday();
        }, $lastMonth);

        $user = User::findOrFail($request->user_id);
        $salary = Salary::where('id', $user->salary_id)->first();
        $timeSheet = Timekeeping::where('date', 'like', "%$month%")->where('user_id', $request->user_id)->get();

        $totalWorkDayUser = 0;
        foreach($timeSheet as $time) {
            $totalWorkDayUser += $time->work_day;
        }

        $totalMoney = ($salary->salary_basic + $salary->salary_factor + $salary->allowance_money + $request->bonus_money - $salary->insurance_premium_salary) * $totalWorkDayUser;
        
        // Tính toán trừ thuế
        $tax = 0;
        if ($totalMoney > 11000000) {
            $tax = ($totalMoney-11000000) * 0.05;
            $totalMoney = $totalMoney - $tax;
        }

        $data = [
            'month_pay' => $month,
            'bonus_money' => $request->bonus_money,
            'total_working_days_standard' => $totalDayWork,
            'total_working_days' => $totalWorkDayUser,
            'tax' => $tax,
            'total_money_actual_receive' => $totalMoney,
            'user_id' => $user->id
        ];
        $payroll = Payroll::where('month_pay', $month)->where('user_id', $request->user_id)->first()->update($data);
        return $this->responseSuccess('Cập nhật bảng lương thành công');
    }

    public function calculateDayLeave($day) {
        Log::info($day);
        if ($day == config('constants.log_request.time_leave.morning') || $day == config('constants.log_request.time_leave.afternoon')) {
            return 0.5;
        } else if ($day == config('constants.log_request.time_leave.allday')) {
            return 1;
        } else {
            return $this->responseError('Truyền không đúng định dạng');
        }
    }
}
