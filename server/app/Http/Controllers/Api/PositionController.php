<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\PositionRequest;
use Throwable;

class PositionController extends Controller
{
    public function listPosition(Request $request) {
        $key_search = $request->search;
        $position = DB::table('position')
        ->where(function ($query) use($key_search) {
            $query->where('position.name', 'like' , "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        return $this->responseSuccess($position);
    }

    public function deletePosition(Request $request) {
        try {
            $position = Position::findOrFail($request->id);
            $user = User::where('position_id', $position->id)->first();
            if (!$user) {
                $position->delete();
                return $this->responseSuccess(['success' => 'Xóa thành công']);
            } else {
                return $this->responseError('Có bản ghi liên kết với bảng user');
            }
        } catch (Throwable $e) {
            Log::info($e);
            return $this->responseError('Lỗi hệ thống');
        }
    } 

    public function createPosition(PositionRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];
        
        $position = Position::create($data);
        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function updatePosition(PositionRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];
        try {
            $position = Position::where('id', $request->id)->update($data);
            return $this->responseSuccess(['success' => 'Cập nhật tên chức vụ thành công']);
        } catch(\Exception $e) {
            Log::info($e);
            return $this->responseError('Có lỗi xảy ra');
        }
    }
}
