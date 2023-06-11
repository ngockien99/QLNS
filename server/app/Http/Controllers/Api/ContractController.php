<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\ContractRequest;
use App\Http\Requests\ContractUpdateRequest;
use Illuminate\Support\Facades\File;
use Throwable;

class ContractController extends Controller
{
    public function listContract(Request $request) {
        $typeOfContract = $request->type_of_contract;
        $startEndWork = $request->start_end_work;
        $contract = DB::table('contract')
        ->when(isset($typeOfContract), function ($query) use ($typeOfContract) {
            return $query->where('type_of_contract', 'like', "%$typeOfContract%");
        })
        ->when(isset($startEndWork), function ($query) use ($startEndWork) {
            return $query->where('start_work', 'like', "%$startEndWork[0]%")->where('end_work', 'like', "%$startEndWork[1]%");
        })
        ->paginate(10,['*'],'page', $request->page);

        if ($contract) {
            $contract->getCollection()->transform(function ($value) {
                $value->file = config('app.linkFile') . '/uploads/contract/' . $value->file;
                return $value;
            });
        }

        return $this->responseSuccess($contract);
    }

    public function deleteContract(Request $request) {
        try {
            $contract = Contract::findOrFail($request->id);
            $user = User::where('contract_id', $contract->id)->first();
            if (!$user) {
                $contract->delete();
                return $this->responseSuccess(['success' => 'Xóa thành công']);
            } else {
                return $this->responseError('Có bản ghi liên kết với bảng user');
            }
        } catch (Throwable $e) {
            Log::info($e);
            return $this->responseError('Lỗi hệ thống');
        }
    } 

    public function createContract(ContractRequest $request) {
        $validated = $request->validated();

        $fileNameToStore = '';
        if($request->hasFile('file')){
            $filenameWithExt = $request->file('file')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore= $filename.'_'.time().'.'.$extension;
            $path = $request->file('file')->move('uploads/contract/', $fileNameToStore);
        }

        $data = [
            'type_of_contract' => $request->type_of_contract,
            'start_work' => $request->start_work,
            'end_work' => $request->end_work,
            'user_id' => $request->user_id,
            'file' => $fileNameToStore
        ];
        
        $contract = Contract::create($data);
        return $this->responseSuccess(['success' => 'Thêm thành công']);
    }

    public function updateContract(ContractUpdateRequest $request) {
        $validated = $request->validated();

        $fileOld = Contract::find($request->id)->file;
        if($request->hasFile('file')){
            $filenameWithExt = $request->file('file')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore= $filename.'_'.time().'.'.$extension;
            $path = $request->file('file')->move('uploads/contract/', $fileNameToStore);
            File::delete(public_path("uploads/contract/".$fileOld));
        }

        $data = [
            'type_of_contract' => $request->type_of_contract,
            'start_work' => $request->start_work,
            'end_work' => $request->end_work,
            'user_id' => $request->user_id,
            'file' => $fileNameToStore
        ];
        
        $contract = Contract::where('id', $request->id)->update($data);
        return $this->responseSuccess(['success' => 'Sửa thành công']);
    }

    public function detailContract(Request $request) {
        $contract = Contract::findOrFail($request->id);
        $contract->file = config('app.linkFile') . '/uploads/contract/' . $contract->file;
        return $this->responseSuccess($contract);
    }
}
