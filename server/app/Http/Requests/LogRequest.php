<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LogRequest extends FormRequest
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
        $rules = [
            'type' => 'required|numeric',
            'date' => 'required|date_format:Y-m-d',
        ];

        if ($this->type === 1) {
            $rules['reason'] = 'required';
            $rules['time_leave'] = 'required';
        }

        if ($this->type === 1) {
            $rules['title'] = 'required';
            $rules['time_ot_start'] = 'required|date_format:H:i';
            $rules['time_ot_end'] = 'required|date_format:H:i';
        }
        return $rules;
    }

    public function messages()
    {
        return [
            'date.required' => 'Bạn chưa chọn ngày nghỉ',
            'date.date_format' => 'Ngày nghỉ định dạng sai',
            'type.required' => 'Bạn chưa chọn kiểu request',
            'type.numeric' => 'Kiểu phải là dạng số',
            'reason.required' => 'Bạn chưa nhập lý do nghỉ phép',
            'time_leave.required' => 'Bạn chưa chọn thời gian nghỉ (sáng hoặc chiều)',
            'title.required' => 'Bạn chưa nhập tiêu đề OT',
            'time_ot_start.required' => 'Bạn chưa chọn thời gian bắt đầu OT',
            'time_ot_start.date_format' => 'Định dạng giờ sai',
            'time_ot_end.required' => 'Bạn chưa chọn thời gian kết thúc OT',
            'time_ot_end.date_format' => 'Định dạng giờ sai',
            

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
