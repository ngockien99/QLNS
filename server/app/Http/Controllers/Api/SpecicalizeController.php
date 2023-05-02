<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Specialize;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\SpecializeRequest;
use Throwable;

class SpecicalizeController extends Controller
{
    public function listSpecialize(Request $request) {
        $key_search = $request->search;
        $specialize = DB::table('specialize')
        ->where(function ($query) use($key_search) {
            $query->where('specialize.name', 'like' , "%$key_search%");
        })
        ->paginate(10,['*'],'page', $request->page);

        return $this->responseSuccess($specialize);
    }

    public function deleteSpecialize(Request $request) {
        try {
            $specialize = Specialize::findOrFail($request->id);
            $user = User::where('specialize_id', $specialize->id)->first();
            if (!$user) {
                $specialize->delete();
                return $this->responseSuccess(['success' => 'Xóa thành công']);
            } else {
                return $this->responseError('Có bản ghi liên kết với bảng user');
            }
        } catch (Throwable $e) {
            Log::info($e);
            return $this->responseError('Lỗi hệ thống');
        }
    } 

    public function createSpecialize(SpecializeRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];
        
        $specialize = Specialize::create($data);
        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function updateSpecialize(SpecializeRequest $request) {
        $validated = $request->validated();

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];
        try {
            $specialize = Specialize::where('id', $request->id)->update($data);
            return $this->responseSuccess(['success' => 'Cập nhật tên chuyên môn thành công']);
        } catch(\Exception $e) {
            Log::info($e);
            return $this->responseError('Có lỗi xảy ra');
        }
    }
}
