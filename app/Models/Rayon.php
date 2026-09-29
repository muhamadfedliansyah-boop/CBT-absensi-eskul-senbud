<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rayon extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'ps_id'];

    public function pembimbingSiswa()
    {
        return $this->belongsTo(User::class, 'ps_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'rayon_id');
    }
}
