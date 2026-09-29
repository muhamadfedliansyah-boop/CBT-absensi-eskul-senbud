<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SanggaScheduleRoom extends Model
{
    public $timestamps = false;
    protected $fillable = ['schedule_id', 'sangga_id', 'room_name'];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function sangga()
    {
        return $this->belongsTo(Sangga::class, 'sangga_id');
    }
}
