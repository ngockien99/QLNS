<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashBoardController extends Controller
{
    public function showDashboard() {
        $month = Carbon::now()->subMonth()->format('Y-m');
        $timeSheet = Timekeeping::where('date', 'like', "%$month%")->get();

        $totalLate = [];
        foreach($timeSheet as $time) {
            $findUser = array_search($time->user_id, array_column($totalLate , 'user_id'));
            
            if ($totalLate == [] || $findUser === false) {
                $info = array(
                    'user_id' => $time->user_id,
                    'late' => $time->late
                );
                array_push($totalLate, $info);
            } else {
                $totalLate[$findUser]['late'] += $time->late;
            }
        }
        
        $keys = array_column($totalLate, 'late');
        array_multisort($keys, SORT_DESC, $totalLate);

        array_slice($totalLate,0,10);

        $userLate = [];
        foreach ($totalLate as $late) {
            $user = User::findOrfail($late['user_id']);
            $depart = Department::findOrfail($user->department_id);
            
            $data = [
                'user_id' => $user->id,
                'avatar' => $user->avatar ? config('app.linkFile') . '/uploads/user/' . $user->avatar : "",
                'name' => $user->name,
                'departmant' => $depart->name,
                'late' => $late['late']
            ];
            array_push($userLate, $data);
        }

        $data = [
            'user_late' => $userLate,
            'count_user' => $this->countUser(),
            'percent_department' => $this->countDepartment()
        ];

        return $this->responseSuccess($data);

    }

    public function countUser() {
        $userProbation = User::where('work_status', config('constants.work_status.probation'))->count();
        $userDoing = User::where('work_status', config('constants.work_status.doing'))->count();
        $userEnd = User::where('work_status', config('constants.work_status.end'))->count();
        $totalUser = User::all()->count();
        return [
            'probation' => $userProbation,
            'doing' => $userDoing,
            'end' => $userEnd,
            'total' => $totalUser
        ];
    }

    public function countDepartment() {
        $department = Department::all();
        $user = User::count();

        $countUserDepart = [];
        foreach ($department as $depart) {
            $userDepart = User::where('department_id', $depart->id)->count();
            $info = [
                'name' => $depart->name,
                'total' => $userDepart,
                'percent' => ($userDepart / $user) * 100
            ];

            array_push($countUserDepart, $info);
        }

        return $countUserDepart;
    }
}
