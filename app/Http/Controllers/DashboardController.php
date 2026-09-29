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

        // Admin Overview
        if ($user->isAdmin()) {
            $totalStudents = Student::count();
            $totalEskuls = Eskul::count();
            $totalSchedules = Schedule::count();
            $totalUsers = User::count();
            $recentAttendances = Attendance::with(['student', 'schedule.eskul'])->latest('id')->take(10)->get();

            return Inertia::render('Dashboard/Admin', compact('totalStudents', 'totalEskuls', 'totalSchedules', 'totalUsers', 'recentAttendances'));
        }

        // Instruktur Overview
        if ($user->isInstruktur()) {
            $myEskuls = Eskul::where('instruktur_id', $user->id)->with(['students', 'schedules'])->get();
            $mySchedules = Schedule::whereIn('eskul_id', $myEskuls->pluck('id'))->orderBy('activity_date', 'desc')->take(10)->get();

            return Inertia::render('Dashboard/Instruktur', compact('myEskuls', 'mySchedules'));
        }

        // PS Overview
        if ($user->isPS()) {
            $myRayons = Rayon::where('ps_id', $user->id)->with('students.attendances.schedule.eskul')->get();
            return Inertia::render('Dashboard/PS', compact('myRayons'));
        }

        return Inertia::render('Dashboard/Index', compact('user'));
    }
}
