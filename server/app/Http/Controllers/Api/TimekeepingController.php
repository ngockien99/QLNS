<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Models\Timekeeping;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class TimekeepingController extends Controller
{
    public function checkin() {
        $user = JWTAuth::user();
        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $findToday = Timekeeping::where('user_id', $user->id)->where('date', $today)->first();

        if (!$findToday) {
            $data = [
                'date' => $today,
                'checkin' => Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s'),
                'user_id' => $user->id
            ];
            $checkin = Timekeeping::create($data);
            return $this->responseSuccess($checkin);
        } else {
            return $this->responseSuccess(['success' => 'Bạn đã checkin rồi']);
        }
    }

    public function checkout() {
        $user = JWTAuth::user();

        // Giờ check quy đinh
        $startCheck = new Carbon('08:00:00');
        $endCheck = new Carbon('23:59:59');

        //Giờ nghỉ trưa quy định
        $lunchBreak = 60;
        $startLunchBreak = new Carbon('12:00:00');
        $endLunchBreak = new Carbon('13:00:00');

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');

        
        $findToday = Timekeeping::where('user_id', $user->id)->where('date', $today)->first();

        if (!$findToday->checkout) {
            $totalLate = '';

            // Tính toán giờ đi muộn sáng
            $lateMorning = 0;
            if (Carbon::parse($findToday->checkin) < $startLunchBreak && Carbon::parse($findToday->checkin) > $startCheck) {
                $lateMorning = Carbon::parse($findToday->checkin)->diffInMinutes($startCheck);
            } else if (Carbon::parse($findToday->checkin) >= $startLunchBreak) {
                $lateMorning = 240;
            } else if (Carbon::parse($findToday->checkin) > $endLunchBreak) {
                $lateMorning = Carbon::parse($findToday->checkin)->diffInMinutes($startCheck) - $lunchBreak;
            }

            // Tính toán giờ đi muộn chiều
            $lateAfternoon = 0;
            $timeNow = Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s');

            if ($timeNow > $endLunchBreak && $timeNow < $endCheck) {
                $lateAfternoon = $endCheck->diffInMinutes(Carbon::parse($timeNow));
            } else if ($timeNow >= $endCheck && $findToday->checkin <= $endCheck) {
                $lateAfternoon = 0;
            } else if ($timeNow >= $startLunchBreak && $timeNow <= $endLunchBreak || $findToday->checkin >= $endCheck && $timeNow >= $endCheck) {
                $lateAfternoon = 240;
            } else {
                $lateAfternoon = $endCheck->diffInMinutes($timeNow) - $lunchBreak;
            }
            
            $totalLate = $lateMorning + $lateAfternoon;

            $data = [
                'checkout' => $timeNow,
                'late' => $totalLate,
                'work_day' => round(((480 - $totalLate) / 480), 2)
            ];
            $checkout = Timekeeping::where('user_id', $user->id)->where('date', $today)->update($data);
            return $this->responseSuccess($checkout);
        } else {
            return $this->responseSuccess(['success' => 'Bạn đã checkout rồi']);
        }
    }

    public function getTimeSheet() {
        $user = JWTAuth::user();

        $firstMonth = Carbon::now()->firstOfMonth()->format('Y-m-d');
        $lastMonth = Carbon::now()->lastOfMonth()->format('Y-m-d');

        $period = CarbonPeriod::create($firstMonth, $lastMonth);
        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $dates = [];
        foreach ($period as $key => $date) {
            $timeSheet = Timekeeping::where('date', $date->format('Y-m-d'))->where('user_id', $user->id)->first();
            $abnormal = false;
            if ($timeSheet && ($timeSheet->checkin == null || $timeSheet->checkout == null || $timeSheet->work_day == 0)) {
                $abnormal = true;
            } else {
                $abnormal = false;
            }
            $dates[] = [
                'date' => $date->format('d-m-Y'),
                'checkin' => $timeSheet ? $timeSheet->checkin : '',
                'checkout' => $timeSheet ? $timeSheet->checkout : '',
                'late' => $timeSheet ? $timeSheet->late : '',
                'work_day' => $timeSheet ? $timeSheet->work_day : '',
                'abnormal' => $abnormal
            ];
        }
        return $this->responseSuccess($dates);
    }
}
