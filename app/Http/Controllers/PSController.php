<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Rayon;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PSController extends Controller
{
    /**
     * Monitoring Presensi & Keaktifan Siswa Rayon Bimbingan
     */
    public function monitoringRayon(Request $request)
    {
        $user = Auth::user();
        $rayonIds = $user->rayons->pluck('id');

        $query = Student::whereIn('rayon_id', $rayonIds)
            ->with(['rayon', 'eskuls', 'attendances.schedule.eskul']);

        if ($request->filled('search')) {
            $s = $request->get('search');
            $query->where('name', 'like', "%{$s}%")->orWhere('nis', 'like', "%{$s}%");
        }

        $students = $query->paginate(20)->withQueryString();
        $rayons = $user->rayons;

        return Inertia::render('PS/Rayon', compact('students', 'rayons'));
    }

    /**
     * Daftar & Riwayat Pengajuan Dispensasi / Izin Siswa Rayon
     */
    public function dispensasiIndex()
    {
        $user = Auth::user();
        $rayonIds = $user->rayons->pluck('id');

        $students = Student::whereIn('rayon_id', $rayonIds)->get();
        $schedules = Schedule::with('eskul')->orderBy('activity_date', 'desc')->take(20)->get();

        $dispensasiList = Attendance::whereIn('student_id', $students->pluck('id'))
            ->whereIn('status', ['DISPEN', 'IZIN', 'SAKIT'])
            ->with(['student.rayon', 'schedule.eskul', 'dispensasiBy'])
            ->latest('id')
            ->paginate(15);

        return Inertia::render('PS/Dispensasi', compact('dispensasiList', 'students', 'schedules'));
    }

    /**
     * Input Dispensasi / Izin Siswa oleh Pembimbing Siswa
     */
    public function dispensasiStore(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'schedule_id' => 'required|exists:schedules,id',
            'status' => 'required|in:DISPEN,IZIN,SAKIT',
            'notes' => 'required|string|max:255',
        ]);

        Attendance::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'schedule_id' => $validated['schedule_id'],
            ],
            [
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'dispensasi_by' => Auth::id(),
                'recorded_by' => Auth::id(),
            ]
        );

        return back()->with('success', 'Dispensasi / Surat Izin siswa berhasil dicatat.');
    }

    /**
     * Laporan Rekapitulasi Rayon
     */
    public function laporanRayon()
    {
        $user = Auth::user();
        $rayons = Rayon::where('ps_id', $user->id)
            ->with(['students.attendances', 'students.eskuls'])
            ->get();

        return Inertia::render('PS/Laporan', compact('rayons'));
    }
}
