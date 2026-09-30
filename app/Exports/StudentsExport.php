<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentsExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    private $rayonId;

    public function __construct($rayonId = null)
    {
        $this->rayonId = $rayonId;
    }

    public function collection(): Enumerable
    {
        $query = Student::with(['rayon', 'eskuls']);

        if ($this->rayonId) {
            $query->where('rayon_id', $this->rayonId);
        }

        return $query->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Lengkap Siswa',
            'Rayon',
            'Pilihan Ekstrakurikuler (Wajib 1)',
            'Pilihan Seni Budaya (Wajib 1)',
            'Pilihan Eskul Produktif (Opsional)',
            'Status Kelengkapan',
        ];
    }

    public function map($student): array
    {
        static $counter = 0;
        $counter++;

        $eskuls = $student->eskuls->filter(fn($e) => in_array($e->type, ['ESKUL', 'PRAMUKA']))->pluck('name')->implode(', ');
        $senbuds = $student->eskuls->filter(fn($e) => $e->type === 'SENBUD')->pluck('name')->implode(', ');
        $produktifs = $student->eskuls->filter(fn($e) => $e->type === 'PRODUKTIF')->pluck('name')->implode(', ');

        $hasEskul = $student->eskuls->contains(fn($e) => in_array($e->type, ['ESKUL', 'PRAMUKA']));
        $hasSenbud = $student->eskuls->contains(fn($e) => $e->type === 'SENBUD');

        $status = ($hasEskul && $hasSenbud) ? 'LENGKAP' : 'BELUM LENGKAP';

        return [
            $counter,
            $student->nis ?? '-',
            $student->name ?? '-',
            $student->rayon->name ?? '-',
            $eskuls ?: '-',
            $senbuds ?: '-',
            $produktifs ?: '-',
            $status,
        ];
    }

    public function title(): string
    {
        return 'Data Siswa & Pilihan Eskul';
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
