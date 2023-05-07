<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogRequest extends Model
{
    use HasFactory;
    public $table = "log_request";
    protected $fillable = [
        'day_create',
        'type',
        'date',
        'manager_id',
        'status',
        'reason',
        'time_leave',
        'title',
        'time_ot_start',
        'time_ot_end',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
