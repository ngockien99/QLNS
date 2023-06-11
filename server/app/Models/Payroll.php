<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $table = 'payroll';

    protected $casts = [
        'info_payroll' => 'array'
   ];

    protected $fillable = [
        'month_pay',
        'bonus_money',
        'total_working_days_standard',
        'total_working_days',
        'tax',
        'total_money_actual_receive',
        'user_id',
        'info_payroll'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
