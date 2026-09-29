<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SanggaMember extends Model
{
    public $timestamps = false;
    protected $table = 'sangga_members';

    protected $fillable = [
        'sangga_id',
        'student_id',
    ];

    public function sangga(): BelongsTo
    {
        return $this->belongsTo(Sangga::class, 'sangga_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
