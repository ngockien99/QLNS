<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RewardDisciplineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules() : array
    {
        return [
            'type' => 'required',
            'date' => 'required|date_format:Y-m-d',
            'money' => 'required|numeric',
            'reason' => 'required',
            'user_id' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'type.required' => 'Bạn chưa nhập type',
            'date.required' => 'Bạn chưa chọn ngày',
            'date.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'money.required' => 'Bạn chưa nhập số tiền',
            'money.numeric' => 'Tiền phải là dạng số',
            'reason.required' => "Bạn chưa nhập lý do",
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
