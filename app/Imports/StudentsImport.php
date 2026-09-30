<?php

namespace App\Imports;

use App\Models\Eskul;
use App\Models\Rayon;
use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    use Importable, SkipsErrors;

    private $importedCount = 0;
    private $skippedCount = 0;

    /**
     * Map each row to a Student model.
     * Supports columns: nis, nama/name/nama_lengkap, rayon, eskul/ekstrakurikuler, senbud/seni_budaya
     */
    public function model(array $row)
    {
        // Normalize keys
        $cleanRow = [];
        foreach ($row as $key => $val) {
            $cleanKey = strtolower(trim(preg_replace('/[^a-zA-Z0-9_]/', '_', (string)$key)));
            $cleanRow[$cleanKey] = trim((string)$val);
        }

        $nis = $cleanRow['nis'] ?? '';
        $name = $cleanRow['nama'] ?? $cleanRow['name'] ?? $cleanRow['nama_siswa'] ?? $cleanRow['nama_lengkap'] ?? '';
        $rayonName = $cleanRow['rayon'] ?? $cleanRow['rombel_rayon'] ?? '';
        $eskulName = $cleanRow['eskul'] ?? $cleanRow['ekstrakurikuler'] ?? $cleanRow['pilihan_ekstrakurikuler'] ?? $cleanRow['pilihan_eskul'] ?? '';
        $senbudName = $cleanRow['senbud'] ?? $cleanRow['seni_budaya'] ?? $cleanRow['pilihan_seni_budaya'] ?? '';
        $produktifName = $cleanRow['produktif'] ?? $cleanRow['eskul_produktif'] ?? $cleanRow['pilihan_eskul_produktif'] ?? $cleanRow['pilihan_ekstrakurikuler_produktif'] ?? '';

        if (empty($nis) || empty($name)) {
            $this->skippedCount++;
            return null;
        }

        // Rayon resolution (find or create)
        $rayonId = null;
        if (!empty($rayonName)) {
            $rayon = Rayon::whereRaw('LOWER(name) = ?', [strtolower($rayonName)])->first();
            if (!$rayon) {
                // Find ps user or default
                $psUser = \App\Models\User::where('role_id', 4)->first();
                $rayon = Rayon::create([
                    'name' => $rayonName,
                    'ps_id' => $psUser ? $psUser->id : 1,
                ]);
            }
            $rayonId = $rayon->id;
        } else {
            $firstRayon = Rayon::first();
            if (!$firstRayon) {
                $psUser = \App\Models\User::where('role_id', 4)->first();
                $firstRayon = Rayon::create([
                    'name' => 'Rayon Umum',
                    'ps_id' => $psUser ? $psUser->id : 1,
                ]);
            }
            $rayonId = $firstRayon->id;
        }

        // Check if student already exists by NIS -> update or skip
        $student = Student::where('nis', $nis)->first();
        if ($student) {
            $student->update([
                'name' => $name,
                'rayon_id' => $rayonId,
            ]);
        } else {
            $student = Student::create([
                'nis' => $nis,
                'name' => $name,
                'rayon_id' => $rayonId,
            ]);
        }

        // Attach Eskul (Ekstrakurikuler)
        $eskulIdsToSync = [];
        if (!empty($eskulName)) {
            $eskul = Eskul::whereIn('type', ['ESKUL', 'PRAMUKA'])
                ->where(function ($q) use ($eskulName) {
                    $q->whereRaw('LOWER(name) = ?', [strtolower($eskulName)])
                      ->orWhere('name', 'like', "%{$eskulName}%");
                })->first();

            if (!$eskul) {
                $instruktur = \App\Models\User::where('role_id', 3)->first();
                $eskul = Eskul::create([
                    'name' => $eskulName,
                    'type' => str_contains(strtolower($eskulName), 'pramuka') ? 'PRAMUKA' : 'ESKUL',
                    'instruktur_id' => $instruktur ? $instruktur->id : 1,
                ]);
            }
            $eskulIdsToSync[] = $eskul->id;
        }

        // Attach Senbud (Seni Budaya)
        if (!empty($senbudName)) {
            $senbud = Eskul::where('type', 'SENBUD')
                ->where(function ($q) use ($senbudName) {
                    $q->whereRaw('LOWER(name) = ?', [strtolower($senbudName)])
                      ->orWhere('name', 'like', "%{$senbudName}%");
                })->first();

            if (!$senbud) {
                $instruktur = \App\Models\User::where('role_id', 3)->first();
                $senbud = Eskul::create([
                    'name' => $senbudName,
                    'type' => 'SENBUD',
                    'instruktur_id' => $instruktur ? $instruktur->id : 1,
                ]);
            }
            $eskulIdsToSync[] = $senbud->id;
        }

        // Attach Produktif (Ekstrakurikuler Produktif)
        if (!empty($produktifName)) {
            $produktif = Eskul::where('type', 'PRODUKTIF')
                ->where(function ($q) use ($produktifName) {
                    $q->whereRaw('LOWER(name) = ?', [strtolower($produktifName)])
                      ->orWhere('name', 'like', "%{$produktifName}%");
                })->first();

            if (!$produktif) {
                $instruktur = \App\Models\User::where('role_id', 3)->first();
                $produktif = Eskul::create([
                    'name' => $produktifName,
                    'type' => 'PRODUKTIF',
                    'instruktur_id' => $instruktur ? $instruktur->id : 1,
                ]);
            }
            $eskulIdsToSync[] = $produktif->id;
        }

        if (!empty($eskulIdsToSync)) {
            $student->eskuls()->syncWithoutDetaching($eskulIdsToSync);
        }

        $this->importedCount++;
        return null; // Return null because we created/updated directly with relations
    }

    public function rules(): array
    {
        return [
            'nis' => 'required',
            '*.nis' => 'required',
        ];
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
