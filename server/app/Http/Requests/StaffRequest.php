<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StaffRequest extends FormRequest
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
            'old_password' => 'required',
            'new_password'=>'required|min:8|max:32',
            'retype_password' => 'required|same:new_password'
        ];
    }

    public function messages()
    {
        return [
            'old_password.required' => 'Bạn chưa nhập mật khẩu cũ',
            'new_password.required'=>'Bạn chưa nhập mật khẩu mới',
            'new_password.min'=>'Mật khẩu từ 8 đến 32 ký tự',
            'new_password.max'=>'Mật khẩu từ 8 đến 32 ký tự',
            'retype_password.required' => 'Bạn chưa nhập lại mật khẩu',
            'retype_password.same' => 'Mật khẩu nhập lại chưa khớp'
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
