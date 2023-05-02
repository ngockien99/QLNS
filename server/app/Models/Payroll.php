<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $table = 'payroll';

    protected $fillable = [
        'month_pay',
        'bonus_money',
        'total_working_days_standard',
        'total_working_days',
        'total_money_actual_receive',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
