<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eskul extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'type', 'instruktur_id'];

    public function instruktur()
    {
        return $this->belongsTo(User::class, 'instruktur_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_eskuls', 'eskul_id', 'student_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'eskul_id');
    }

    public function sanggas()
    {
        return $this->hasMany(Sangga::class, 'eskul_id');
    }
}
