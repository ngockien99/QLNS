<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRequest extends FormRequest
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
            'name' => 'required',
            'email' => 'required|email:rfc,dns|unique:users,email,' .$this->id,
            'password' => 'required||min:8|max:32',
            'avatar' => 'nullable|mimes:jpeg,jpg,png',
            'address' => 'required',
            'phone' => ['required','regex:/^(0[3|5|7|8|9])[0-9]{8}+$/', 'unique:users,phone,' .$this->id],
            'cccd' => 'required',
            'mst' => 'required',
            'gender' => 'required',
            'work_status' => 'required',
            'marital_status' => 'required',
            'start_work' => 'required|date_format:Y-m-d',
            'end_work' => 'nullable|date_format:Y-m-d',
            'manager_id' => 'required',
            'role' => 'required',
            'level_id' => 'required',
            'department_id' => 'required',
            'position_id' => 'required',
            'specialize_id' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Bạn chưa nhập tên tài khoản',
            'email.required' => 'Bạn chưa nhập Email',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Bạn chưa nhập mật khẩu',
            'password.min' => 'Độ dài mật khẩu từ 8-32 kí tự',
            'password.max' => 'Độ dài mật khẩu từ 8-32 kí tự',
            'avatar.mimes' => 'Ảnh chưa đúng định dạng',
            'address.required' => 'Bạn chưa nhập địa chỉ',
            'phone.required' => 'Bạn chưa nhập số điện thoại',
            'phone.regex' => 'Số điện thoại chưa đúng định dạng',
            'phone.unique' => 'Số điện thoại đã tồn tại',
            'cccd.required' => 'Bạn chưa nhập căn cước công dân',
            'mst.required' => 'Bạn chưa nhập mã số thuế',
            'gender.required' => 'Bạn chưa chọn giới tính',
            'work_status.required' => 'Bạn chưa chọn tình trạng làm việc',
            'marital_status.required' => 'Bạn chưa chọn tình trạng hôn nhân',
            'start_work.required' => 'Bạn chưa nhập ngày bắt đầu làm việc',
            'start_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'end_work.date_format' => 'Định dạng ngày phải là Năm-Tháng-Ngày',
            'manager_id.required' => "Bạn chưa chọn người quản lý",
            'role.required' => "Bạn chưa chọn quyền cho nhân viên",
            'level_id.required' => "Bạn chưa chọn cấp bậc",
            'department_id.required' => "Bạn chưa chọn phòng ban",
            'position_id.required' => "Bạn chưa chọn chức vụ",
            'specialize_id.required' => "Bạn chưa chọn chuyên môn"
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
