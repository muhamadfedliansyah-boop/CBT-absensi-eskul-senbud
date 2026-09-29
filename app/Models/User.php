<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship to Role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Rayon managed as Pembimbing Siswa (PS)
     */
    public function rayons(): HasMany
    {
        return $this->hasMany(Rayon::class, 'ps_id');
    }

    /**
     * Eskul / Senbud instructed by this user
     */
    public function eskuls(): HasMany
    {
        return $this->hasMany(Eskul::class, 'instruktur_id');
    }

    /**
     * Attendances recorded by this user
     */
    public function recordedAttendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'recorded_by');
    }

    /**
     * Dispensasi granted by this PS user
     */
    public function dispensasiAttendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'dispensasi_by');
    }

    /**
     * Role checking helper
     * Supports single string, array, or comma-separated list of roles
     */
    public function hasRole(string|array $roles): bool
    {
        if (!$this->role) {
            return false;
        }

        $userRole = strtolower(trim($this->role->name));

        if (is_string($roles)) {
            $roles = explode(',', $roles);
        }

        foreach ($roles as $r) {
            $targetRole = strtolower(trim($r));
            if ($userRole === $targetRole || str_contains($userRole, $targetRole)) {
                return true;
            }
        }

        return false;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(['admin', 'koordinator']);
    }

    public function isInstruktur(): bool
    {
        return $this->hasRole(['instruktur', 'pembina']);
    }

    public function isPS(): bool
    {
        return $this->hasRole(['ps', 'pembimbing siswa']);
    }
}
