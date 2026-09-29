<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Rayon;
use App\Models\Role;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    // =========================================================
    // 1. MANAJEMEN EKSTRAKURIKULER & SENBUD
    // =========================================================
    public function eskulIndex()
    {
        $eskuls = Eskul::with(['instruktur', 'students', 'schedules'])->get();
        $instructors = User::whereHas('role', fn($q) => $q->where('name', 'like', '%instruktur%')->orWhere('name', 'like', '%pembina%'))->get();
        return Inertia::render('Admin/Eskul/Index', compact('eskuls', 'instructors'));
    }

    public function eskulStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:ESKUL,SENBUD,PRAMUKA',
            'instruktur_id' => 'required|exists:users,id',
        ]);

        Eskul::create($validated);
        return back()->with('success', 'Ekstrakurikuler berhasil ditambahkan.');
    }

    public function eskulUpdate(Request $request, Eskul $eskul)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:ESKUL,SENBUD,PRAMUKA',
            'instruktur_id' => 'required|exists:users,id',
        ]);

        $eskul->update($validated);
        return back()->with('success', 'Data ekstrakurikuler berhasil diperbarui.');
    }

    public function eskulDestroy(Eskul $eskul)
    {
        $eskul->delete();
        return back()->with('success', 'Ekstrakurikuler berhasil dihapus.');
    }

    // =========================================================
    // 2. MANAJEMEN SISWA
    // =========================================================
    public function studentIndex(Request $request)
    {
        $search = $request->get('search');
        $rayonId = $request->get('rayon_id');

        $query = Student::with(['rayon', 'eskuls']);
        if ($search) {
            $query->where('name', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%");
        }
        if ($rayonId) {
            $query->where('rayon_id', $rayonId);
        }

        $students = $query->paginate(20)->withQueryString();
        $rayons = Rayon::all();
        $eskuls = Eskul::all();

        return Inertia::render('Admin/Students/Index', compact('students', 'rayons', 'eskuls'));
    }

    public function studentStore(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:students,nis',
            'name' => 'required|string|max:150',
            'rayon_id' => 'required|exists:rayons,id',
            'eskul_ids' => 'nullable|array',
            'eskul_ids.*' => 'exists:eskuls,id',
        ]);

        $student = Student::create([
            'nis' => $validated['nis'],
            'name' => $validated['name'],
            'rayon_id' => $validated['rayon_id'],
        ]);

        if (!empty($validated['eskul_ids'])) {
            $student->eskuls()->sync($validated['eskul_ids']);
        }

        return back()->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function studentUpdate(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:students,nis,' . $student->id,
            'name' => 'required|string|max:150',
            'rayon_id' => 'required|exists:rayons,id',
            'eskul_ids' => 'nullable|array',
            'eskul_ids.*' => 'exists:eskuls,id',
        ]);

        $student->update([
            'nis' => $validated['nis'],
            'name' => $validated['name'],
            'rayon_id' => $validated['rayon_id'],
        ]);

        if (isset($validated['eskul_ids'])) {
            $student->eskuls()->sync($validated['eskul_ids']);
        }

        return back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function studentDestroy(Student $student)
    {
        $student->eskuls()->detach();
        $student->delete();
        return back()->with('success', 'Data siswa berhasil dihapus.');
    }

    // =========================================================
    // 3. MANAJEMEN RAYON
    // =========================================================
    public function rayonIndex()
    {
        $rayons = Rayon::with(['pembimbingSiswa', 'students'])->get();
        $psUsers = User::whereHas('role', fn($q) => $q->where('name', 'like', '%ps%')->orWhere('name', 'like', '%pembimbing%'))->get();
        return Inertia::render('Admin/Rayons/Index', compact('rayons', 'psUsers'));
    }

    public function rayonStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'ps_id' => 'required|exists:users,id',
        ]);

        Rayon::create($validated);
        return back()->with('success', 'Rayon berhasil ditambahkan.');
    }

    public function rayonUpdate(Request $request, Rayon $rayon)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'ps_id' => 'required|exists:users,id',
        ]);

        $rayon->update($validated);
        return back()->with('success', 'Data rayon berhasil diperbarui.');
    }

    public function rayonDestroy(Rayon $rayon)
    {
        $rayon->delete();
        return back()->with('success', 'Rayon berhasil dihapus.');
    }

    // =========================================================
    // 4. MANAJEMEN PENGGUNA / STAF & INSTRUKTUR
    // =========================================================
    public function userIndex()
    {
        $users = User::with('role')->paginate(15);
        $roles = Role::all();
        return Inertia::render('Admin/Users/Index', compact('users', 'roles'));
    }

    public function userStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function userUpdate(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'role_id' => 'required|exists:roles,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);
        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function userDestroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }
        $user->delete();
        return back()->with('success', 'Pengguna berhasil dihapus.');
    }

    // =========================================================
    // 5. MANAJEMEN JADWAL GLOBAL & RUANGAN
    // =========================================================
    public function scheduleIndex()
    {
        $schedules = Schedule::with(['eskul', 'sanggaRooms.sangga'])->orderBy('activity_date', 'desc')->paginate(20);
        $eskuls = Eskul::all();
        return Inertia::render('Admin/Schedules/Index', compact('schedules', 'eskuls'));
    }

    public function scheduleStore(Request $request)
    {
        $validated = $request->validate([
            'eskul_id' => 'required|exists:eskuls,id',
            'activity_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:100',
            'material_text' => 'nullable|string',
        ]);

        Schedule::create($validated);
        return back()->with('success', 'Jadwal kegiatan berhasil ditambahkan.');
    }

    public function scheduleDestroy(Schedule $schedule)
    {
        $schedule->sanggaRooms()->delete();
        $schedule->attendances()->delete();
        $schedule->delete();
        return back()->with('success', 'Jadwal berhasil dihapus.');
    }

    // =========================================================
    // 6. REKAPITULASI & LAPORAN PRESENSI LENGKAP
    // =========================================================
    public function rekapitulasiIndex()
    {
        $eskuls = Eskul::with(['schedules.attendances', 'students'])->get();
        $totalPresensi = Attendance::count();
        $hadirCount = Attendance::where('status', 'HADIR')->count();
        $globalAttendance = $totalPresensi > 0 ? round(($hadirCount / $totalPresensi) * 100, 1) : 0;

        return Inertia::render('Admin/Rekap/Index', compact('eskuls', 'totalPresensi', 'hadirCount', 'globalAttendance'));
    }
}
