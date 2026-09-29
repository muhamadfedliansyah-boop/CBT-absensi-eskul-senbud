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
            abort(403, 'Anda tidak memiliki akses ke jadwal eskul ini.');
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
            abort(403, 'Akses Ditolak.');
        }

        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.status' => 'required|in:HADIR,SAKIT,IZIN,ALPA,DISPEN',
            'attendance.*.notes' => 'nullable|string|max:255',
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

        return back()->with('success', 'Presensi siswa berhasil disimpan.');
    }

    /**
     * Edit materi pembelajaran & upload dokumentasi kegiatan
     */
    public function materiEdit($schedule_id)
    {
        $schedule = Schedule::with(['eskul', 'sanggaRooms.sangga'])->findOrFail($schedule_id);
        return Inertia::render('Instruktur/Materi', compact('schedule'));
    }

    /**
     * Update materi dan foto dokumentasi kegiatan
     */
    public function materiUpdate(Request $request, $schedule_id)
    {
        $schedule = Schedule::findOrFail($schedule_id);

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
        return Inertia::render('Instruktur/Sangga', compact('eskul'));
    }

    /**
     * Buat Sangga baru
     */
    public function sanggaStore(Request $request, $eskul_id)
    {
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
