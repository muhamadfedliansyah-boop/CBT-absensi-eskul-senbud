<?php

namespace App\Imports;

use App\Models\Eskul;
use App\Models\Schedule;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class SchedulesImport implements ToModel, WithHeadingRow, SkipsOnError
{
    use Importable, SkipsErrors;

    private $importedCount = 0;
    private $skippedCount = 0;

    /**
     * Expected Excel columns:
     * - eskul / nama_eskul / nama_kegiatan
     * - tanggal / tanggal_kegiatan / activity_date
     * - jam_mulai / start_time
     * - jam_selesai / end_time
     * - ruangan / lokasi / location
     * - materi / topik / material_text
     */
    public function model(array $row)
    {
        $eskulRef = trim($row['nama_ekstrakurikuler_senbud'] ?? $row['nama_eskul'] ?? $row['eskul'] ?? $row['nama_kegiatan'] ?? $row['nama'] ?? '');
        $rawDate = $row['tanggal_kegiatan_yyyymmdd'] ?? $row['tanggal_kegiatan'] ?? $row['tanggal'] ?? $row['activity_date'] ?? $row['date'] ?? null;
        $rawStart = $row['jam_mulai'] ?? $row['start_time'] ?? '15:00';
        $rawEnd = $row['jam_selesai'] ?? $row['end_time'] ?? '17:00';
        $location = trim($row['ruangan_lokasi'] ?? $row['ruangan'] ?? $row['lokasi'] ?? $row['location'] ?? $row['room_number'] ?? 'Ruang Reguler');
        $materialText = trim($row['topik_materi_pembelajaran'] ?? $row['topik_materi'] ?? $row['materi'] ?? $row['topik'] ?? $row['material_text'] ?? '');

        if (empty($eskulRef) || empty($rawDate)) {
            $this->skippedCount++;
            return null;
        }

        // 1. Resolve Eskul
        $eskul = Eskul::where('name', $eskulRef)->first();
        if (!$eskul) {
            $eskul = Eskul::where('name', 'like', "%{$eskulRef}%")->first();
        }

        if (!$eskul) {
            $this->skippedCount++;
            return null;
        }

        // 2. Parse Date
        $activityDate = null;
        try {
            if (is_numeric($rawDate)) {
                $activityDate = Carbon::instance(ExcelDate::excelToDateTimeObject($rawDate))->format('Y-m-d');
            } else {
                $rawDateStr = trim((string)$rawDate);
                // Try different common date formats
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $rawDateStr)) {
                    $activityDate = $rawDateStr;
                } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $rawDateStr)) {
                    $activityDate = Carbon::createFromFormat('d/m/Y', $rawDateStr)->format('Y-m-d');
                } elseif (preg_match('/^\d{2}-\d{2}-\d{4}$/', $rawDateStr)) {
                    $activityDate = Carbon::createFromFormat('d-m-Y', $rawDateStr)->format('Y-m-d');
                } else {
                    $activityDate = Carbon::parse($rawDateStr)->format('Y-m-d');
                }
            }
        } catch (\Exception $e) {
            $this->skippedCount++;
            return null;
        }

        // 3. Parse Times
        $startTime = '15:00';
        $endTime = '17:00';

        try {
            if (is_numeric($rawStart)) {
                $startTime = Carbon::instance(ExcelDate::excelToDateTimeObject($rawStart))->format('H:i');
            } else {
                $startTime = date('H:i', strtotime((string)$rawStart)) ?: '15:00';
            }

            if (is_numeric($rawEnd)) {
                $endTime = Carbon::instance(ExcelDate::excelToDateTimeObject($rawEnd))->format('H:i');
            } else {
                $endTime = date('H:i', strtotime((string)$rawEnd)) ?: '17:00';
            }
        } catch (\Exception $e) {
            $startTime = '15:00';
            $endTime = '17:00';
        }

        $this->importedCount++;

        return new Schedule([
            'eskul_id' => $eskul->id,
            'activity_date' => $activityDate,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'location' => $location ?: 'Ruang Reguler',
            'material_text' => $materialText ?: null,
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
