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
        $date = $request->date;
        $rd = DB::table('reward_discipline')
        ->when(isset($type), function ($query) use ($type) {
            return $query->where('type', 'like', "%$type%");
        })
        ->when(isset($date), function ($query) use ($date) {
            return $query->where('date', 'like', "%$date%");
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
