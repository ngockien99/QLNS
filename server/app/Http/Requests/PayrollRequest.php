<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PayrollRequest extends FormRequest
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
            'bonus_money' => 'required|numeric',
            'user_id' => 'required|numeric'
        ];
    }

    public function messages()
    {
        return [
            'bonus_money.required' => 'Bạn chưa nhập số tiền thưởng',
            'bonus_money.numeric' => 'Số tiền chưa đúng định dạng',
            'user_id.required' => 'Bạn chưa chọn nhân viên',
            'user_id.numeric' => 'Mã nhân viên chưa đúng định dạng'
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
