<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateUserRequest extends FormRequest
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
            'name' => 'nullable',
            'email' => 'nullable|email:rfc,dns|unique:users,email,' .$this->id,
            'password' => 'nullable||min:8|max:32',
            'avatar' => 'nullable|mimes:jpeg,jpg,png',
            'address' => 'nullable',
            'phone' => ['nullable','regex:/^(0[3|5|7|8|9])[0-9]{8}+$/', 'unique:users,phone,' .$this->id],
            'gender' => 'nullable',
            'work_status' => 'nullable',
            'marital_status' => 'nullable',
            'start_work' => 'nullable|date_format:Y-m-d',
            'end_work' => 'nullable|date_format:Y-m-d',
            'manager_id' => 'nullable',
            'role' => 'nullable',
            'level_id' => 'nullable',
            'department_id' => 'nullable',
            'position_id' => 'nullable',
            'specialize_id' => 'nullable'
        ];
    }

    public function messages()
    {
        return [
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.min' => 'Độ dài mật khẩu từ 8-32 kí tự',
            'password.max' => 'Độ dài mật khẩu từ 8-32 kí tự',
            'avatar.mimes' => 'Ảnh chưa đúng định dạng',
            'phone.regex' => 'Số điện thoại chưa đúng định dạng',
            'phone.unique' => 'Số điện thoại đã tồn tại',
            'start_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'end_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày'
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
