<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Level;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LevelRequest;
use Throwable;

class LevelController extends Controller
{
    public function listLevel(Request $request) {
        $key_search = $request->search;
        $level = DB::table('level')
        ->where(function ($query) use($key_search) {
            $query->where('level.name', 'like' , "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        return $this->responseSuccess($level);
    }

    public function deleteLevel(Request $request) {
        try {
            $level = Level::findOrFail($request->id);
            $user = User::where('specialize_id', $level->id)->first();
            if (!$user) {
                $level->delete();
                return $this->responseSuccess(['success' => 'Xóa thành công']);
            } else {
                return $this->responseError('Có bản ghi liên kết với bảng user');
            }
        } catch (Throwable $e) {
            Log::info($e);
            return $this->responseError('Lỗi hệ thống');
        }
    } 

    public function createLevel(LevelRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'salary_factor' => $request->salary_factor
        ];
        
        $level = Level::create($data);
        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function updateLevel(LevelRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'salary_factor' => $request->salary_factor
        ];
        try {
            $level = Level::where('id', $request->id)->update($data);
            return $this->responseSuccess(['success' => 'Cập nhật hệ số lương thành công']);
        } catch(\Exception $e) {
            Log::info($e);
            return $this->responseError('Có lỗi xảy ra');
        }
    }
}
