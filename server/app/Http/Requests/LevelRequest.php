<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LevelRequest extends FormRequest
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
            'name' => 'required|unique:level,name,' .$this->id,
            'description' => 'required',
            'salary_factor' => 'required|numeric'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Bạn chưa nhập tên chuyên môn',
            'name.unique' => 'Tên chuyên môn đã tồn tại',
            'description.required' => 'Bạn chưa nhập mô tả chuyên môn',
            'salary_factor.required' => 'Bạn chưa nhập hệ số lương',
            'salary_factor.numeric' => 'Hệ số lương phải là số'
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
