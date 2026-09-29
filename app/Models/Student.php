<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public $timestamps = false;
    protected $fillable = ['nis', 'name', 'rayon_id'];

    public function rayon()
    {
        return $this->belongsTo(Rayon::class, 'rayon_id');
    }

    public function eskuls()
    {
        return $this->belongsToMany(Eskul::class, 'student_eskuls', 'student_id', 'eskul_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function sanggas()
    {
        return $this->belongsToMany(Sangga::class, 'sangga_members', 'student_id', 'sangga_id');
    }
}
