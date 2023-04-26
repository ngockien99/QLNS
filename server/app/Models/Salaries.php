<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salaries extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'salaries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'salary_basic',
        'salary_factor',
        'allowance_money',
        'bonus_money',
        'insurance_premium_salary',
        'month_pay',
        'total_working_days',
        'total_working_days_standard',
        'total_money_actual_receive',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
