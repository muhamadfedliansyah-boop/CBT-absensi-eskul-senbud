<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Rayon;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Admin / Administrator Kesiswaan Overview
        if ($user->isAdmin()) {
            $totalStudents = Student::count();
            $totalEskuls = Eskul::count();
            $totalSchedules = Schedule::count();
            $totalUsers = User::count();
            $recentAttendances = Attendance::with(['student.rayon', 'schedule.eskul'])->latest('id')->take(10)->get();
            $totalPresensi = Attendance::count();
            $hadirCount = Attendance::where('status', 'HADIR')->count();
            $avgRate = $totalPresensi > 0 ? round(($hadirCount / $totalPresensi) * 100, 1) : 0;

            return Inertia::render('Dashboard/Admin', [
                'totalStudents' => $totalStudents,
                'totalEskuls' => $totalEskuls,
                'totalSchedules' => $totalSchedules,
                'totalUsers' => $totalUsers,
                'recentAttendances' => $recentAttendances,
                'totalGroups' => $totalEskuls,
                'incompleteData' => 0,
                'clashWarnings' => 0,
                'unrecordedSessions' => 0,
                'averageAttendanceRate' => $avgRate,
                'completionRate' => $totalSchedules > 0 ? 100 : 0,
                'totalPhotos' => Schedule::whereNotNull('photo_url')->count(),
            ]);
        }

        // 2. Instruktur Eskul & Senbud Overview
        if ($user->isInstruktur()) {
            $myEskuls = Eskul::where('instruktur_id', $user->id)
                ->with(['students.rayon', 'schedules' => fn($q) => $q->orderBy('activity_date', 'asc')->with('attendances')])
                ->get();
            
            $mySchedules = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))
                ->with(['eskul', 'attendances'])
                ->orderBy('activity_date', 'desc')
                ->take(10)
                ->get();
            
            $totalStudentsInEskul = $myEskuls->reduce(function ($carry, $eskul) {
                return $carry + ($eskul->students ? $eskul->students->count() : 0);
            }, 0);

            $allScheduleIds = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))->pluck('id');
            $totalPresensi = Attendance::whereIn('schedule_id', $allScheduleIds)->count();
            $hadirCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'HADIR')->count();
            $sakitCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'SAKIT')->count();
            $izinCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'IZIN')->count();
            $alpaCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'ALPA')->count();
            $dispenCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'DISPEN')->count();
            
            $avgAttendance = $totalPresensi > 0 ? round(($hadirCount / $totalPresensi) * 100, 1) : 0;
            $totalPhotos = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))->whereNotNull('photo_url')->count();

            // Progress kehadiran & dokumentasi per eskul
            $eskulStats = $myEskuls->map(function ($eskul) {
                $schIds = $eskul->schedules->pluck('id');
                $totalAtt = Attendance::whereIn('schedule_id', $schIds)->count();
                $hadir = Attendance::whereIn('schedule_id', $schIds)->where('status', 'HADIR')->count();
                $rate = $totalAtt > 0 ? round(($hadir / $totalAtt) * 100, 1) : 0;
                $photoCount = $eskul->schedules->whereNotNull('photo_url')->count();
                return [
                    'id' => $eskul->id,
                    'name' => $eskul->name,
                    'type' => $eskul->type,
                    'students_count' => $eskul->students->count(),
                    'schedules_count' => $eskul->schedules->count(),
                    'attendance_rate' => $rate,
                    'photos_count' => $photoCount,
                ];
            });

            return Inertia::render('Dashboard/Instruktur', [
                'myEskuls' => $myEskuls,
                'mySchedules' => $mySchedules,
                'totalEskulsCount' => $myEskuls->count(),
                'totalStudentsCount' => $totalStudentsInEskul,
                'averageAttendance' => $avgAttendance,
                'sessionsThisWeek' => count($allScheduleIds) . ' Sesi',
                'totalPhotos' => $totalPhotos,
                'stats' => [
                    'hadir' => $hadirCount,
                    'sakit' => $sakitCount,
                    'izin' => $izinCount,
                    'alpa' => $alpaCount,
                    'dispen' => $dispenCount,
                    'total' => $totalPresensi,
                ],
                'eskulStats' => $eskulStats,
            ]);
        }

        // 3. Pembimbing Siswa (PS) / Guru / Laboran Overview
        if ($user->isPS()) {
            $myRayons = Rayon::where('ps_id', $user->id)->with('students')->get();
            $totalRayonStudents = $myRayons->reduce(function ($carry, $r) {
                return $carry + ($r->students ? $r->students->count() : 0);
            }, 0);

            return Inertia::render('Dashboard/PS', [
                'myRayons' => $myRayons,
                'totalStudents' => $totalRayonStudents,
                'attendanceRate' => 0,
                'zeroAlpaCount' => 0,
                'actionNeededCount' => 0,
            ]);
        }

        return Inertia::render('Dashboard/Index', compact('user'));
    }
}
