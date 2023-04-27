<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timekeeping extends Model
{
    use HasFactory;

    protected $table = 'timekeeping';

    protected $fillable = [
        'date',
        'checkin',
        'checkout',
        'late',
        'work_day',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
