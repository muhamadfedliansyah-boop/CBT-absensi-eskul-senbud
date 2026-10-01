<?php

namespace App\Exports;

use App\Models\Schedule;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SchedulesExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    private $eskulId;

    public function __construct($eskulId = null)
    {
        $this->eskulId = $eskulId;
    }

    public function collection(): Enumerable
    {
        $query = Schedule::with(['eskul.instruktur', 'attendances']);

        if ($this->eskulId) {
            $query->where('eskul_id', $this->eskulId);
        }

        return $query->orderBy('activity_date', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Ekstrakurikuler / Senbud',
            'Tipe Kegiatan',
            'Instruktur Pengampu',
            'Tanggal Kegiatan (YYYY-MM-DD)',
            'Jam Mulai',
            'Jam Selesai',
            'Ruangan / Lokasi',
            'Topik / Materi Pembelajaran',
            'Total Hadir',
            'Total Siswa Terdaftar Presensi',
            'Status Presensi',
        ];
    }

    public function map($schedule): array
    {
        static $counter = 0;
        $counter++;

        $totalAtt = $schedule->attendances ? $schedule->attendances->count() : 0;
        $hadirCount = $schedule->attendances ? $schedule->attendances->where('status', 'HADIR')->count() : 0;
        $status = $totalAtt > 0 ? "SUDAH DIABSEN ({$hadirCount}/{$totalAtt} Hadir)" : "BELUM DIABSEN";

        $startTime = $schedule->start_time ? substr($schedule->start_time, 0, 5) : '15:00';
        $endTime = $schedule->end_time ? substr($schedule->end_time, 0, 5) : '17:00';

        return [
            $counter,
            $schedule->eskul->name ?? '-',
            $schedule->eskul->type ?? 'ESKUL',
            $schedule->eskul->instruktur->name ?? 'Belum Ditugaskan',
            $schedule->activity_date,
            $startTime,
            $endTime,
            $schedule->location ?: 'Ruang Reguler',
            $schedule->material_text ?: '-',
            $hadirCount,
            $totalAtt,
            $status,
        ];
    }

    public function title(): string
    {
        return 'Jadwal Pertemuan Eskul';
    }

    public function styles(Worksheet $sheet): ?array
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFFFFFFF'],
                    'size' => 11,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF0077B6'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}
