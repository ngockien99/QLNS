<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RewardDiscipline extends Model
{
    use HasFactory;

    protected $table = 'reward_discipline';

    protected $fillable = [
        'type',
        'date',
        'money',
        'reason',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
