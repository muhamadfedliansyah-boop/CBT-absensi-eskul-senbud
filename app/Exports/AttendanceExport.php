<?php

namespace App\Exports;

use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Schedule;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    private $eskulId;
    private $scheduleId;

    public function __construct($eskulId = null, $scheduleId = null)
    {
        $this->eskulId = $eskulId;
        $this->scheduleId = $scheduleId;
    }

    public function collection(): Enumerable
    {
        $query = Attendance::with(['student.rayon', 'schedule.eskul', 'recordedBy']);

        if ($this->scheduleId) {
            $query->where('schedule_id', $this->scheduleId);
        } elseif ($this->eskulId) {
            $scheduleIds = Schedule::where('eskul_id', $this->eskulId)->pluck('id');
            $query->whereIn('schedule_id', $scheduleIds);
        }

        return $query->orderBy('schedule_id')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Rayon',
            'Eskul / Senbud',
            'Tanggal Kegiatan',
            'Waktu',
            'Lokasi',
            'Status Kehadiran',
            'Keterangan',
            'Dicatat Oleh',
        ];
    }

    public function map($attendance): array
    {
        static $counter = 0;
        $counter++;

        return [
            $counter,
            $attendance->student->nis ?? '-',
            $attendance->student->name ?? '-',
            $attendance->student->rayon->name ?? '-',
            $attendance->schedule->eskul->name ?? '-',
            $attendance->schedule ? date('d/m/Y', strtotime($attendance->schedule->activity_date)) : '-',
            $attendance->schedule ? substr($attendance->schedule->start_time, 0, 5) . ' - ' . substr($attendance->schedule->end_time, 0, 5) : '-',
            $attendance->schedule->location ?? '-',
            $attendance->status,
            $attendance->notes ?? '-',
            $attendance->recordedBy->name ?? '-',
        ];
    }

    public function title(): string
    {
        if ($this->eskulId) {
            $eskul = Eskul::find($this->eskulId);
            return $eskul ? substr($eskul->name, 0, 31) : 'Rekap Absensi';
        }
        return 'Rekap Absensi';
    }

    public function styles(Worksheet $sheet): ?array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 11],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '0077B6'],
                ],
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            ],
        ];
    }
}
