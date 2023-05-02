<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class DepartmentRequest extends FormRequest
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
            'name' => 'required|unique:department,name,' .$this->id,
            'description' => 'required',
            'code' => 'required|unique:department,code,' .$this->id,
            'head_of_department_id' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Bạn chưa nhập tên phòng ban',
            'name.unique' => 'Tên phòng ban đã tồn tại',
            'code.required' => 'Bạn chưa nhập mã phòng ban',
            'code.unique' => 'Mã phòng ban đã tồn tại',
            'description.required' => 'Bạn chưa nhập mô tả',
            'head_of_department_id.required'  => 'Bạn chưa điền thông tin trưởng phòng'
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
