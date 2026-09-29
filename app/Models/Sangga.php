<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sangga extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'eskul_id', 'pic_student_id'];

    public function eskul()
    {
        return $this->belongsTo(Eskul::class, 'eskul_id');
    }

    public function picStudent()
    {
        return $this->belongsTo(Student::class, 'pic_student_id');
    }

    public function members()
    {
        return $this->belongsToMany(Student::class, 'sangga_members', 'sangga_id', 'student_id');
    }

    public function scheduleRooms()
    {
        return $this->hasMany(SanggaScheduleRoom::class, 'sangga_id');
    }
}
