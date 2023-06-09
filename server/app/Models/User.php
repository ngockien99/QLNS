<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'address',
        'phone',
        'cccd',
        'mst',
        'date_of_birth',
        'gender',
        'work_status',
        'marital_status',
        'start_work',
        'end_work',
        'manager_id',
        'annual_leave',
        'role',
        'level_id',
        'academic_level_id',
        'department_id',
        'position_id',
        'specialize_id',
        'salary_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function academicLevel()
    {
        return $this->belongsTo(AcademicLevel::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function specialize()
    {
        return $this->belongsTo(Specialize::class);
    }

    public function salary()
    {
        return $this->belongsTo(Salary::class);
    }
    
    public function timekeeping()
    {
        return $this->hasMany(Timekeeping::class);
    }

    public function contract()
    {
        return $this->hasMany(Contract::class);
    }

    public function payroll()
    {
        return $this->hasMany(Payroll::class);
    }

    public function logRequest()
    {
        return $this->hasMany(LogRequest::class);
    }

    public function rewardDiscipline()
    {
        return $this->hasMany(RewardDiscipline::class);
    }
}
