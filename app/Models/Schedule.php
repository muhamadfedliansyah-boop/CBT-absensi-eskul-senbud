<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'eskul_id',
        'activity_date',
        'start_time',
        'end_time',
        'location',
        'material_text',
        'photo_url',
    ];

    public function eskul()
    {
        return $this->belongsTo(Eskul::class, 'eskul_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'schedule_id');
    }

    public function sanggaRooms()
    {
        return $this->hasMany(SanggaScheduleRoom::class, 'schedule_id');
    }
}
