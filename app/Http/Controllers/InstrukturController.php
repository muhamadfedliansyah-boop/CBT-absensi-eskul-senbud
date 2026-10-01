<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Sangga;
use App\Models\SanggaScheduleRoom;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstrukturController extends Controller
{
    /**
     * Daftar Eskul yang diampu oleh instruktur yang sedang login
     */
    public function myEskul()
    {
        $userId = Auth::id();
        $myEskuls = Eskul::where('instruktur_id', $userId)
            ->with(['students.rayon', 'schedules' => fn($q) => $q->orderBy('activity_date', 'asc'), 'sanggas'])
            ->get();

        return Inertia::render('Instruktur/MyEskul', compact('myEskuls'));
    }

    /**
     * Form & Lembar Absensi Siswa pada suatu jadwal/pertemuan
     */
    public function presensiIndex($schedule_id)
    {
        $schedule = Schedule::with(['eskul.students.rayon', 'attendances.student'])->findOrFail($schedule_id);

        // Security check: ensure current user is instructor of this eskul or admin
        $user = Auth::user();
        if (!$user->isAdmin() && $schedule->eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengabsen siswa pada cabang eskul & seni budaya yang Anda ajar.');
        }

        $students = $schedule->eskul->students;
        $attendances = $schedule->attendances->keyBy('student_id');

        return Inertia::render('Instruktur/Presensi', compact('schedule', 'students', 'attendances'));
    }

    /**
     * Simpan / Rekam Presensi Siswa massal pada pertemuan
     */
    public function presensiStore(Request $request, $schedule_id)
    {
        $schedule = Schedule::with('eskul')->findOrFail($schedule_id);
        $user = Auth::user();

        if (!$user->isAdmin() && $schedule->eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengabsen siswa pada cabang eskul & seni budaya yang Anda ajar.');
        }

        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.status' => 'required|in:HADIR,SAKIT,IZIN,ALPA,DISPEN',
            'attendance.*.notes' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'material_text' => 'nullable|string',
            'location' => 'nullable|string|max:100',
        ]);

        foreach ($validated['attendance'] as $studentId => $data) {
            Attendance::updateOrCreate(
                [
                    'schedule_id' => $schedule->id,
                    'student_id' => $studentId,
                ],
                [
                    'status' => $data['status'],
                    'notes' => $data['notes'] ?? null,
                    'recorded_by' => $user->id,
                ]
            );
        }

        // Optional update of photo/material directly from presensi
        $scheduleUpdates = [];
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('dokumentasi_eskul', 'public');
            $scheduleUpdates['photo_url'] = '/storage/' . $path;
        }
        if ($request->filled('material_text')) {
            $scheduleUpdates['material_text'] = $request->input('material_text');
        }
        if ($request->filled('location')) {
            $scheduleUpdates['location'] = $request->input('location');
        }
        if (!empty($scheduleUpdates)) {
            $schedule->update($scheduleUpdates);
        }

        return back()->with('success', 'Presensi siswa dan dokumentasi berhasil disimpan.');
    }

    /**
     * Galeri / Library Foto Dokumentasi Kegiatan Instruktur
     */
    public function galeriIndex(Request $request)
    {
        $userId = Auth::id();
        $myEskuls = Eskul::where('instruktur_id', $userId)->get();
        $eskulIds = $myEskuls->pluck('id');

        $selectedEskulId = $request->input('eskul_id');
        if ($selectedEskulId && !$eskulIds->contains($selectedEskulId)) {
            $selectedEskulId = null;
        }

        $query = Schedule::whereIn('eskul_id', $eskulIds)
            ->with(['eskul', 'attendances'])
            ->orderBy('activity_date', 'desc');

        if ($selectedEskulId) {
            $query->where('eskul_id', $selectedEskulId);
        }

        $allSchedules = $query->get();
        $photosList = $allSchedules->whereNotNull('photo_url')->values();
        $pendingPhotos = $allSchedules->whereNull('photo_url')->values();

        return Inertia::render('Instruktur/Galeri', [
            'myEskuls' => $myEskuls,
            'selectedEskulId' => $selectedEskulId,
            'photosList' => $photosList,
            'pendingPhotos' => $pendingPhotos,
            'totalPhotos' => $photosList->count(),
            'totalPending' => $pendingPhotos->count(),
        ]);
    }

    /**
     * Rekapitulasi Presensi & Persentase Kehadiran Siswa
     */
    public function rekapIndex(Request $request)
    {
        $userId = Auth::id();
        $myEskuls = Eskul::where('instruktur_id', $userId)
            ->with(['students.rayon', 'schedules' => fn($q) => $q->orderBy('activity_date', 'asc')->with('attendances')])
            ->get();

        $selectedEskulId = $request->input('eskul_id', $myEskuls->first()?->id);
        $activeEskul = $myEskuls->firstWhere('id', $selectedEskulId) ?? $myEskuls->first();

        $rekapData = [];
        $eskulSchedules = collect();
        $summaryStats = [
            'total_students' => 0,
            'total_sessions' => 0,
            'total_presensi' => 0,
            'hadir' => 0,
            'sakit' => 0,
            'izin' => 0,
            'alpa' => 0,
            'dispen' => 0,
            'attendance_percentage' => 0,
        ];

        if ($activeEskul) {
            $eskulSchedules = $activeEskul->schedules;
            $students = $activeEskul->students;
            $totalSessions = $eskulSchedules->count();
            $summaryStats['total_students'] = $students->count();
            $summaryStats['total_sessions'] = $totalSessions;

            // Load all attendances for these schedules
            $scheduleIds = $eskulSchedules->pluck('id');
            $allAttendances = Attendance::whereIn('schedule_id', $scheduleIds)->get()->groupBy('student_id');

            foreach ($students as $student) {
                $studentAtts = $allAttendances->get($student->id, collect());
                $hadir = $studentAtts->where('status', 'HADIR')->count();
                $sakit = $studentAtts->where('status', 'SAKIT')->count();
                $izin = $studentAtts->where('status', 'IZIN')->count();
                $alpa = $studentAtts->where('status', 'ALPA')->count();
                $dispen = $studentAtts->where('status', 'DISPEN')->count();

                $totalRecorded = $studentAtts->count();
                $percentage = $totalSessions > 0 ? round(($hadir / $totalSessions) * 100, 1) : 0;

                // Per-session map
                $sessionStatuses = [];
                foreach ($eskulSchedules as $sch) {
                    $att = $studentAtts->firstWhere('schedule_id', $sch->id);
                    $sessionStatuses[$sch->id] = $att ? $att->status : '-';
                }

                $rekapData[] = [
                    'student_id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->name,
                    'rayon' => $student->rayon?->name ?? '-',
                    'hadir' => $hadir,
                    'sakit' => $sakit,
                    'izin' => $izin,
                    'alpa' => $alpa,
                    'dispen' => $dispen,
                    'total_recorded' => $totalRecorded,
                    'percentage' => $percentage,
                    'session_statuses' => $sessionStatuses,
                ];

                $summaryStats['hadir'] += $hadir;
                $summaryStats['sakit'] += $sakit;
                $summaryStats['izin'] += $izin;
                $summaryStats['alpa'] += $alpa;
                $summaryStats['dispen'] += $dispen;
            }

            $summaryStats['total_presensi'] = $summaryStats['hadir'] + $summaryStats['sakit'] + $summaryStats['izin'] + $summaryStats['alpa'] + $summaryStats['dispen'];
            $summaryStats['attendance_percentage'] = $summaryStats['total_presensi'] > 0 
                ? round(($summaryStats['hadir'] / $summaryStats['total_presensi']) * 100, 1) 
                : 0;
        }

        return Inertia::render('Instruktur/Rekap', [
            'myEskuls' => $myEskuls,
            'activeEskul' => $activeEskul,
            'schedules' => $eskulSchedules,
            'rekapData' => $rekapData,
            'summaryStats' => $summaryStats,
        ]);
    }

    /**
     * Edit materi pembelajaran & upload dokumentasi kegiatan
     */
    public function materiEdit($schedule_id)
    {
        $schedule = Schedule::with(['eskul', 'sanggaRooms.sangga'])->findOrFail($schedule_id);
        $user = Auth::user();
        if (!$user->isAdmin() && $schedule->eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengubah materi pada eskul yang Anda ajar.');
        }

        return Inertia::render('Instruktur/Materi', compact('schedule'));
    }

    /**
     * Update materi dan foto dokumentasi kegiatan
     */
    public function materiUpdate(Request $request, $schedule_id)
    {
        $schedule = Schedule::with('eskul')->findOrFail($schedule_id);
        $user = Auth::user();
        if (!$user->isAdmin() && $schedule->eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengubah materi pada eskul yang Anda ajar.');
        }

        $validated = $request->validate([
            'material_text' => 'nullable|string',
            'location' => 'nullable|string|max:100',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('dokumentasi_eskul', 'public');
            $validated['photo_url'] = '/storage/' . $path;
        }

        $schedule->update($validated);
        return back()->with('success', 'Materi dan informasi kegiatan berhasil diperbarui.');
    }

    /**
     * Manajemen Sangga & Alokasi Ruangan Kelas
     */
    public function sanggaIndex($eskul_id)
    {
        $eskul = Eskul::with(['sanggas.members.rayon', 'sanggas.picStudent', 'schedules'])->findOrFail($eskul_id);
        $user = Auth::user();
        if (!$user->isAdmin() && $eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengelola sangga pada eskul yang Anda ajar.');
        }

        return Inertia::render('Instruktur/Sangga', compact('eskul'));
    }

    /**
     * Buat Sangga baru
     */
    public function sanggaStore(Request $request, $eskul_id)
    {
        $eskul = Eskul::findOrFail($eskul_id);
        $user = Auth::user();
        if (!$user->isAdmin() && $eskul->instruktur_id !== $user->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengelola sangga pada eskul yang Anda ajar.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'pic_student_id' => 'required|exists:students,id',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:students,id',
        ]);

        $sangga = Sangga::create([
            'name' => $validated['name'],
            'eskul_id' => $eskul_id,
            'pic_student_id' => $validated['pic_student_id'],
        ]);

        if (!empty($validated['member_ids'])) {
            $sangga->members()->sync($validated['member_ids']);
        }

        return back()->with('success', 'Sangga berhasil dibentuk.');
    }

    /**
     * Alokasikan Ruang Kelas untuk Sangga pada suatu Jadwal
     */
    public function sanggaRoomStore(Request $request, $schedule_id)
    {
        $validated = $request->validate([
            'allocations' => 'required|array',
            'allocations.*.sangga_id' => 'required|exists:sanggas,id',
            'allocations.*.room_name' => 'required|string|max:100',
        ]);

        foreach ($validated['allocations'] as $item) {
            SanggaScheduleRoom::updateOrCreate(
                [
                    'schedule_id' => $schedule_id,
                    'sangga_id' => $item['sangga_id'],
                ],
                [
                    'room_name' => $item['room_name'],
                ]
            );
        }

        return back()->with('success', 'Alokasi ruangan sangga berhasil disimpan.');
    }
}
