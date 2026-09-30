<?php

namespace App\Imports;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;

class UsersImport implements ToModel, WithHeadingRow, SkipsOnError
{
    use Importable, SkipsErrors;

    private $roleMap;
    private $importedCount = 0;
    private $skippedCount = 0;

    public function __construct()
    {
        $this->roleMap = Role::pluck('id', 'name')->toArray();
    }

    /**
     * Expected Excel columns: nama (or name), email, role, password (optional)
     */
    public function model(array $row)
    {
        $name = trim($row['nama'] ?? $row['name'] ?? '');
        $email = strtolower(trim($row['email'] ?? ''));
        $roleName = trim($row['role'] ?? $row['jabatan'] ?? '');
        $password = trim($row['password'] ?? 'password123');

        if (empty($name) || empty($email)) {
            $this->skippedCount++;
            return null;
        }

        // Skip if email already exists
        if (User::where('email', $email)->exists()) {
            $this->skippedCount++;
            return null;
        }

        // Find role by name (case-insensitive partial match)
        $roleId = 3; // Default to Instruktur
        foreach ($this->roleMap as $rName => $rId) {
            if (strtolower(trim($rName)) === strtolower($roleName)) {
                $roleId = $rId;
                break;
            }
        }
        // Partial match fallback
        if ($roleId === 3 && $roleName) {
            foreach ($this->roleMap as $rName => $rId) {
                if (str_contains(strtolower($rName), strtolower($roleName)) ||
                    str_contains(strtolower($roleName), strtolower($rName))) {
                    $roleId = $rId;
                    break;
                }
            }
        }

        $this->importedCount++;

        return new User([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $roleId,
        ]);
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }
}
