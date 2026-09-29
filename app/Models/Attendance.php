<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'schedule_id',
        'student_id',
        'status',
        'recorded_by',
        'dispensasi_by',
        'notes',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function dispensasiBy()
    {
        return $this->belongsTo(User::class, 'dispensasi_by');
    }
}
