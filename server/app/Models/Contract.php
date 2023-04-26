<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $table = 'contract';

    protected $fillable = [
        'type_of_contract',
        'start_work',
        'end_work',
        'file',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
