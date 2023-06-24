<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\DepartmentRequest;
use Throwable;

class DepartmentController extends Controller
{
    public function listDepartment(Request $request) {
        $key_search = $request->keyword;
        $type = $request->type;
        $manager = $request->manager;
        $department = DB::table('department')
        ->when(isset($type), function ($query) use ($type) {
            return $query->where('status', 'like', "%$type%");
        })
        ->when(isset($manager), function ($query) use ($manager) {
            return $query->where('head_of_department_id', 'like', "%$manager%");
        })
        ->where(function ($query) use($key_search) {
            $query->where('department.name', 'like' , "%$key_search%");
            $query->orWhere('department.description', 'like' , "%$key_search%");
        })
        ->where('status', $request->status)
        ->paginate(10,['*'],'page', $request->page);

        return $this->responseSuccess($department);
    }

    public function deleteDepartment(Request $request) {
        try {
            $department = Department::findOrFail($request->id);
            $user = User::where('department_id', $department->id)->first();
            if (!$user) {
                $department->delete();
                return $this->responseSuccess(['success' => 'Xóa thành công']);
            } else {
                return $this->responseError('Có bản ghi liên kết với bảng user');
            }
        } catch (Throwable $e) {
            Log::info($e);
            return $this->responseError('Lỗi hệ thống');
        }
    } 

    public function createDepartment(DepartmentRequest $request) {
        $validated = $request->validated();

        $user = User::find($request->head_of_department_id);
        $manager = '';
        if ($user) {
            $manager = $user->id;
        } else {
            return $this->responseError('Không tồn tại trưởng phòng này');
        }

        $data = [
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'head_of_department_id' => $manager
        ];
        
        $department = Department::create($data);
        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function detailDepartment(Request $request) {
        $department = Department::findOrFail($request->id);
        return $this->responseSuccess($department);
    }

    public function updateDepartment(DepartmentRequest $request) {
        $validated = $request->validated();

        $user = User::find($request->head_of_department_id);
        $manager = '';
        if ($user) {
            $manager = $user->id;
        } else {
            return $this->responseError('Không tồn tại trưởng phòng này');
        }

        $data = [
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'head_of_department_id' => $manager
        ];
        try {
            $department = Department::where('id', $request->id)->update($data);
            return $this->responseSuccess(['success' => 'Cập nhật phòng ban thành công']);
        } catch(\Exception $e) {
            Log::info($e);
            return $this->responseError('Có lỗi xảy ra');
        }
    }
}
