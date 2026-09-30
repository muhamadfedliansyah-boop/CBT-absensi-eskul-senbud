<?php

namespace App\Imports;

use App\Models\Eskul;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;

class EskulsImport implements ToModel, WithHeadingRow, SkipsOnError
{
    use Importable, SkipsErrors;

    private $importedCount = 0;
    private $skippedCount = 0;

    /**
     * Expected Excel columns: nama (or name), tipe (or type), instruktur (or instruktur_email)
     */
    public function model(array $row)
    {
        $name = trim($row['nama'] ?? $row['name'] ?? '');
        $type = strtoupper(trim($row['tipe'] ?? $row['type'] ?? 'ESKUL'));
        $instrukturRef = trim($row['instruktur'] ?? $row['instruktur_email'] ?? $row['email_instruktur'] ?? '');

        if (empty($name)) {
            $this->skippedCount++;
            return null;
        }

        // Normalize type
        if (!in_array($type, ['ESKUL', 'SENBUD', 'PRAMUKA'])) {
            $type = 'ESKUL';
        }

        // Find instruktur by email or name
        $instrukturId = null;
        if (!empty($instrukturRef)) {
            $user = User::where('email', $instrukturRef)->first();
            if (!$user) {
                $user = User::where('name', 'like', "%{$instrukturRef}%")->first();
            }
            if ($user) {
                $instrukturId = $user->id;
            }
        }

        // Default to first instruktur if not found
        if (!$instrukturId) {
            $instrukturId = User::whereHas('role', fn($q) => $q->where('name', 'like', '%instruktur%'))->value('id') ?? 1;
        }

        $this->importedCount++;

        return new Eskul([
            'name' => $name,
            'type' => $type,
            'instruktur_id' => $instrukturId,
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
