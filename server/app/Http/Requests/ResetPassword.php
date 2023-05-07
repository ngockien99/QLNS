<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ResetPassword extends FormRequest
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
                'new_password'=>'required|min:8|max:32',
                'confirm_password' => 'required|same:new_password',
        ];
    }

    public function messages()
    {
        return [
            'new_password.required' => 'Bạn chưa nhập mật khẩu',
            'new_password.max' => 'Mật khẩu phải có ít hơn 32 kí tự',
            'new_password.min' => 'Mật khẩu phải có nhiều hơn 8 kí tự',
            'confirm_password.same' => 'Mật khẩu nhập lại chưa khớp'
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
