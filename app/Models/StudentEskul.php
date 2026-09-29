<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentEskul extends Model
{
    public $timestamps = false;
    protected $table = 'student_eskuls';

    protected $fillable = [
        'student_id',
        'eskul_id',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function eskul(): BelongsTo
    {
        return $this->belongsTo(Eskul::class, 'eskul_id');
    }
}
