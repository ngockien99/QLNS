<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ContractRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules() : array
    {
        return [
            'type_of_contract' => 'required',
            'start_work' => 'required|date_format:Y-m-d',
            'end_work' => 'required|date_format:Y-m-d',
            'file' => 'mimes:pdf|max:100000',
            'user_id' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'type_of_contract.required' => 'Bạn chưa nhập tên loại hợp đồng',
            'start_work.required' => 'Bạn chưa chọn ngày bắt đầu hợp đồng',
            'start_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'end_work.required' => 'Bạn chưa chọn ngày kết thúc hợp đồng',
            'end_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'file.mimes' => "Định dạng tệp phải là pdf",
            'file.max' => "Dung lượng file vượt quá 10MB",
            'user_id.required' => 'Bạn chưa chọn người dùng'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->first();
        throw new HttpResponseException(response()->json([
            'errors' => $validator->errors(),
            'message' => $error,
            'status' => false,
        ], 200));
    }
}
