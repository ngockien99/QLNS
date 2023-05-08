<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Payroll;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\PayrollRequest;
use App\Models\Timekeeping;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function listPayroll(Request $request) {
        $key_search = $request->search;
        $user = DB::table('payroll')
        ->where(function ($query) use($key_search) {
            $query->where('payroll.month_pay', 'like' , "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        return $this->responseSuccess($user);
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

        $firstMonth = Carbon::now()->subMonth()->firstOfMonth()->format('Y-m-d');
        $lastMonth = Carbon::now()->subMonth()->lastOfMonth()->format('Y-m-d');

        $month = Carbon::now()->subMonth()->format('Y-m');

        // check xem bảng công đã tồn tại hay chưa
        $checkPayroll = Payroll::where('month_pay', $month)->where('user_id', $request->user_id)->first();
        if ($checkPayroll) {
            return $this->responseError('Bảng công của nhân viên đã tồn tại');
        }

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

        $totalMoney = (($salary->salary_basic + $salary->salary_factor + $salary->allowance_money + $request->bonus_money - $salary->insurance_premium_salary) * $totalWorkDayUser) / $totalDayWork;
        
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
}
