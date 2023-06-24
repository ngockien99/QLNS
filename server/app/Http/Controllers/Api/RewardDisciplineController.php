<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RewardDisciplineRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\RewardDiscipline;
use App\Models\User;
use Illuminate\Http\Request;

class RewardDisciplineController extends Controller
{
    public function listRewardDiscipline(Request $request) {
        $type = $request->type;
        $date = [$request->start_date, $request->end_date];
        $keyword = $request->keyword;
        $user_id = $request->user;
        $rd = DB::table('reward_discipline')
        ->when(isset($keyword), function ($query) use ($keyword) {
            return $query->where('reason', 'like', "%$keyword%");
        })
        ->when(isset($type), function ($query) use ($type) {
            return $query->where('type', 'like', "%$type%");
        })
        ->when(isset($request->start_date), function ($query) use ($date) {
            return $query->whereBetween('date', [$date[0],$date[1]]);
        })
        ->when(isset($user_id), function ($query) use ($user_id) {
            return $query->where('user_id', 'like', "%$user_id%");
        })
        ->paginate(10,['*'],'page', $request->page);

        if ($rd) {
            $rd->getCollection()->transform(function ($value) {
                $user = User::findOrFail($value->user_id);
                $value->user_name = $user->name;
                return $value;
            });
        }
        return $this->responseSuccess($rd);
    }

    public function createRewardDiscipline(RewardDisciplineRequest $request) {
        $validated = $request->validated();

        $data = [
            'type' => $request->type,
            'date' => $request->date,
            'money' => $request->money,
            'reason' => $request->reason,
            'user_id' => $request->user_id
        ];

        $rd = RewardDiscipline::create($data);

        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function updateRewardDiscipline(RewardDisciplineRequest $request) {
        $validated = $request->validated();

        $data = [
            'type' => $request->type,
            'date' => $request->date,
            'money' => $request->money,
            'reason' => $request->reason,
            'user_id' => $request->user_id
        ];

        $rd = RewardDiscipline::findOrFail($request->id);

        $rd->update($data);

        return $this->responseSuccess(['success' => 'Sửa thành công']);
    }

    public function deleteRewardDiscipline(Request $request) {
        $rd = RewardDiscipline::findOrFail($request->id);
        $rd->delete();
        return $this->responseSuccess('Xóa thành công');
    } 
}
