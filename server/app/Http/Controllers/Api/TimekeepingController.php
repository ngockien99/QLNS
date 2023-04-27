<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Models\Timekeeping;
use Carbon\Carbon;

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
        $endCheck = new Carbon('17:00:00');

        //Giờ nghỉ trưa quy định
        $startLunchBreak = new Carbon('12:00:00');
        $endLunchBreak = new Carbon('13:00:00');

        $today = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $findToday = Timekeeping::where('user_id', $user->id)->where('date', $today)->first();

        if (!$findToday->checkout) {
            $totalLate = '';

            $lateMorning = Carbon::parse($findToday->checkin)->diffInMinutes($startCheck);
            $lateAfternoon = $endCheck->diffInMinutes(Carbon::parse(Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s')));
            
            if ($lateMorning > 0 && $lateAfternoon > 0) {
                $totalLate = $lateMorning + $lateAfternoon;
            } else {

            }

            $data = [
                'checkout' => Carbon::now('Asia/Ho_Chi_Minh'),
                'late' => $totalLate,
                'work_day' => (480 - $totalLate) / 480
            ];
            $checkout = Timekeeping::where('user_id', $user->id)->where('date', $today)->update($data);
            return $this->responseSuccess($checkout);
        } else {
            return $this->responseSuccess(['success' => 'Bạn đã checkout rồi']);
        }
    }
}
