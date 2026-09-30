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
                ->with(['students', 'schedules' => fn($q) => $q->orderBy('activity_date', 'asc')])
                ->get();
            $mySchedules = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))
                ->with('eskul')
                ->orderBy('activity_date', 'desc')
                ->take(10)
                ->get();
            
            $totalStudentsInEskul = $myEskuls->reduce(function ($carry, $eskul) {
                return $carry + ($eskul->students ? $eskul->students->count() : 0);
            }, 0);

            $allScheduleIds = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))->pluck('id');
            $totalPresensi = Attendance::whereIn('schedule_id', $allScheduleIds)->count();
            $hadirCount = Attendance::whereIn('schedule_id', $allScheduleIds)->where('status', 'HADIR')->count();
            $avgAttendance = $totalPresensi > 0 ? round(($hadirCount / $totalPresensi) * 100, 1) : 0;

            return Inertia::render('Dashboard/Instruktur', [
                'myEskuls' => $myEskuls,
                'mySchedules' => $mySchedules,
                'totalEskulsCount' => $myEskuls->count(),
                'totalStudentsCount' => $totalStudentsInEskul,
                'averageAttendance' => $avgAttendance,
                'sessionsThisWeek' => count($allScheduleIds) . ' Sesi',
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
