<?php

namespace App\Http\Controllers;

use App\Exports\AttendanceExport;
use App\Exports\SchedulesExport;
use App\Exports\StudentsExport;
use App\Imports\EskulsImport;
use App\Imports\SchedulesImport;
use App\Imports\StudentsImport;
use App\Imports\UsersImport;
use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Rayon;
use App\Models\Role;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentEskul;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends Controller
{
    // =========================================================
    // 1. MANAJEMEN EKSTRAKURIKULER & SENBUD
    // =========================================================
    public function eskulIndex()
    {
        $eskuls = Eskul::with('instruktur')->withCount('students')->get();
        $instructors = User::whereHas('role', fn($q) => $q->whereRaw('LOWER(name) LIKE ?', ['%instruktur%']))->orderBy('name')->get();
        return Inertia::render('Admin/Eskul/Index', compact('eskuls', 'instructors'));
    }

    public function eskulStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:ESKUL,SENBUD,PRODUKTIF,PRAMUKA',
            'instruktur_id' => 'required|exists:users,id',
        ]);

        $instructor = User::findOrFail($validated['instruktur_id']);
        if (!$instructor->isInstruktur()) {
            return back()->withErrors(['instruktur_id' => 'Pengguna yang dipilih harus memiliki akun dengan role Instruktur.']);
        }

        Eskul::create($validated);
        Cache::forget('admin_eskuls_all');
        Cache::forget('student_clash_count');
        return back()->with('success', 'Ekstrakurikuler berhasil ditambahkan.');
    }

    public function eskulUpdate(Request $request, Eskul $eskul)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:ESKUL,SENBUD,PRODUKTIF,PRAMUKA',
            'instruktur_id' => 'required|exists:users,id',
        ]);

        $instructor = User::findOrFail($validated['instruktur_id']);
        if (!$instructor->isInstruktur()) {
            return back()->withErrors(['instruktur_id' => 'Pengguna yang dipilih harus memiliki akun dengan role Instruktur.']);
        }

        $eskul->update($validated);
        Cache::forget('admin_eskuls_all');
        Cache::forget('student_clash_count');
        return back()->with('success', 'Data ekstrakurikuler berhasil diperbarui.');
    }

    public function eskulDestroy(Eskul $eskul)
    {
        $eskul->delete();
        Cache::forget('admin_eskuls_all');
        Cache::forget('student_clash_count');
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
        $rayons = Cache::remember('admin_rayons_all', 60, fn() => Rayon::all());
        $eskuls = Cache::remember('admin_eskuls_all', 60, fn() => Eskul::all());

        // Detect students with clashing eskul dates (cached for fast pagination & filtering)
        $clashCount = Cache::remember('student_clash_count', 60, function () {
            $multiEskulStudents = Student::has('eskuls', '>=', 2)->with('eskuls.schedules:id,eskul_id,activity_date')->get();
            $clashStudentIds = [];
            foreach ($multiEskulStudents as $s) {
                $dates = [];
                $hasClash = false;
                foreach ($s->eskuls as $e) {
                    foreach ($e->schedules as $sch) {
                        $d = $sch->activity_date;
                        if (in_array($d, $dates)) {
                            $clashStudentIds[] = $s->id;
                            $hasClash = true;
                            break;
                        }
                        $dates[] = $d;
                    }
                    if ($hasClash) break;
                }
            }
            return count(array_unique($clashStudentIds));
        });

        $gformSpreadsheetUrl = Cache::get('gform_spreadsheet_url', '');

        return Inertia::render('Admin/Students/Index', compact('students', 'rayons', 'eskuls', 'clashCount', 'gformSpreadsheetUrl'));
    }

    public function studentStore(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:students,nis',
            'name' => 'required|string|max:150',
            'rayon_id' => 'required|exists:rayons,id',
            'eskul_ids' => 'required|array|min:2',
            'eskul_ids.*' => 'exists:eskuls,id',
        ], [
            'eskul_ids.required' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
            'eskul_ids.min' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
        ]);

        // Validate that student chooses at least 1 ESKUL/PRAMUKA and at least 1 SENBUD
        $selectedEskuls = Eskul::whereIn('id', $validated['eskul_ids'])->get();
        $hasEskul = $selectedEskuls->contains(fn($e) => in_array($e->type, ['ESKUL', 'PRAMUKA']));
        $hasSenbud = $selectedEskuls->contains(fn($e) => $e->type === 'SENBUD');

        if (!$hasEskul || !$hasSenbud) {
            return back()->withErrors([
                'eskul_ids' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
            ]);
        }

        $student = Student::create([
            'nis' => $validated['nis'],
            'name' => $validated['name'],
            'rayon_id' => $validated['rayon_id'],
        ]);

        $student->eskuls()->sync($validated['eskul_ids']);

        return back()->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function studentUpdate(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:students,nis,' . $student->id,
            'name' => 'required|string|max:150',
            'rayon_id' => 'required|exists:rayons,id',
            'eskul_ids' => 'required|array|min:2',
            'eskul_ids.*' => 'exists:eskuls,id',
        ], [
            'eskul_ids.required' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
            'eskul_ids.min' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
        ]);

        // Validate that student chooses at least 1 ESKUL/PRAMUKA and at least 1 SENBUD
        $selectedEskuls = Eskul::whereIn('id', $validated['eskul_ids'])->get();
        $hasEskul = $selectedEskuls->contains(fn($e) => in_array($e->type, ['ESKUL', 'PRAMUKA']));
        $hasSenbud = $selectedEskuls->contains(fn($e) => $e->type === 'SENBUD');

        if (!$hasEskul || !$hasSenbud) {
            return back()->withErrors([
                'eskul_ids' => 'Setiap siswa wajib memilih minimal 1 kegiatan Ekstrakurikuler dan 1 kegiatan Seni Budaya.',
            ]);
        }

        $student->update([
            'nis' => $validated['nis'],
            'name' => $validated['name'],
            'rayon_id' => $validated['rayon_id'],
        ]);

        $student->eskuls()->sync($validated['eskul_ids']);

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
        $schedules = Schedule::with(['eskul.instruktur', 'attendances', 'sanggaRooms.sangga'])
            ->orderBy('activity_date', 'desc')
            ->get();
        $eskuls = Eskul::with(['instruktur'])->withCount('students')->get();
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
        return back()->with('success', 'Jadwal kegiatan berhasil ditambahkan. Instruktur pengampu kini dapat mulai mengabsenkan siswa pada sesi tersebut.');
    }

    public function scheduleUpdate(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'eskul_id' => 'required|exists:eskuls,id',
            'activity_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:100',
            'material_text' => 'nullable|string',
        ]);

        $schedule->update($validated);
        return back()->with('success', 'Jadwal kegiatan berhasil diperbarui.');
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
        $eskuls = Eskul::with('instruktur')->withCount('students')->get();
        $totalPresensi = Attendance::count();
        $hadirCount = Attendance::where('status', 'HADIR')->count();
        $globalAttendance = $totalPresensi > 0 ? round(($hadirCount / $totalPresensi) * 100, 1) : 0;

        return Inertia::render('Admin/Rekap/Index', compact('eskuls', 'totalPresensi', 'hadirCount', 'globalAttendance'));
    }

    // =========================================================
    // 7. IMPORT DATA DARI EXCEL
    // =========================================================
    public function importStudents(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        $import = new StudentsImport();
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();

        return back()->with('success', "Import selesai: {$imported} siswa berhasil ditambahkan" . ($skipped > 0 ? ", {$skipped} data dilewati (duplikat/invalid)." : '.'));
    }

    public function importUsers(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        $import = new UsersImport();
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();

        return back()->with('success', "Import selesai: {$imported} pengguna berhasil ditambahkan" . ($skipped > 0 ? ", {$skipped} data dilewati." : '.'));
    }

    public function importEskuls(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        $import = new EskulsImport();
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();

        return back()->with('success', "Import selesai: {$imported} eskul berhasil ditambahkan" . ($skipped > 0 ? ", {$skipped} data dilewati." : '.'));
    }

    public function importSchedules(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        $import = new SchedulesImport();
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();

        return back()->with('success', "Import selesai: {$imported} sesi jadwal berhasil ditambahkan" . ($skipped > 0 ? ", {$skipped} data dilewati (nama eskul tidak ditemukan / format tanggal tidak valid)." : '.'));
    }

    // =========================================================
    // 8. EXPORT LAPORAN ABSENSI & JADWAL KE EXCEL
    // =========================================================
    public function exportSchedules(Request $request)
    {
        $eskulId = $request->get('eskul_id');
        $filename = 'Jadwal_Pertemuan_Eskul_SIBAS_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(new SchedulesExport($eskulId), $filename);
    }

    public function exportAttendance(Request $request)
    {
        $eskulId = $request->get('eskul_id');
        $scheduleId = $request->get('schedule_id');

        $filename = 'Rekap_Absensi_SIBAS_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(new AttendanceExport($eskulId, $scheduleId), $filename);
    }

    public function exportStudents(Request $request)
    {
        $rayonId = $request->get('rayon_id');
        $filename = 'Data_Siswa_Eskul_SIBAS_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(new StudentsExport($rayonId), $filename);
    }

    // =========================================================
    // 8.1 SINKRONISASI GOOGLE SPREADSHEET (GFORM RESPONSES)
    // =========================================================
    public function syncGoogleSheet(Request $request)
    {
        $request->validate([
            'sheet_url' => 'required|url',
        ], [
            'sheet_url.required' => 'Link Google Spreadsheet wajib diisi.',
            'sheet_url.url' => 'Format URL Google Spreadsheet tidak valid.',
        ]);

        $url = trim($request->input('sheet_url'));

        // Extract spreadsheet ID and GID
        if (!preg_match('/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $url, $matches)) {
            return back()->withErrors(['sheet_url' => 'URL Google Spreadsheet tidak valid. Pastikan link memiliki format: https://docs.google.com/spreadsheets/d/...']);
        }

        $sheetId = $matches[1];
        $gid = '0';
        if (preg_match('/[#&?]gid=([0-9]+)/', $url, $gidMatches)) {
            $gid = $gidMatches[1];
        }

        // Construct CSV export URL
        $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";

        try {
            $response = Http::withoutVerifying()
                ->timeout(25)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                ])
                ->get($csvUrl);

            if (!$response->successful()) {
                return back()->withErrors(['sheet_url' => 'Gagal mengakses Google Spreadsheet (HTTP ' . $response->status() . '). Pastikan akses spreadsheet diatur ke "Siapa saja yang memiliki link" (Public) atau sudah dipublikasikan ke web.']);
            }

            $csvData = $response->body();
            if (empty(trim($csvData)) || str_contains($csvData, '<!DOCTYPE html>') || str_contains($csvData, '<html')) {
                return back()->withErrors(['sheet_url' => 'Google Spreadsheet memerlukan izin akses. Silakan buka Google Spreadsheet > Bagikan > Ubah Akses Umum ke "Siapa saja yang memiliki link" (Pelihat), lalu coba sinkronkan kembali.']);
            }

            // Cache the URL for future ease
            Cache::forever('gform_spreadsheet_url', $url);

            // Parse CSV lines
            $lines = explode("\n", str_replace("\r", "", $csvData));
            if (count($lines) < 2) {
                return back()->with('info', 'Spreadsheet tidak memiliki baris data.');
            }

            // Parse header row
            $headerRow = str_getcsv(array_shift($lines));
            $columnIndices = [];
            foreach ($headerRow as $idx => $colName) {
                $cleaned = strtolower(trim((string)$colName));
                if (str_contains($cleaned, 'nis')) {
                    $columnIndices['nis'] = $idx;
                } elseif (str_contains($cleaned, 'nama')) {
                    $columnIndices['nama'] = $idx;
                } elseif (str_contains($cleaned, 'rayon') || str_contains($cleaned, 'rombel')) {
                    $columnIndices['rayon'] = $idx;
                } elseif (str_contains($cleaned, 'ekstrakurikuler') || (str_contains($cleaned, 'eskul') && !str_contains($cleaned, 'seni'))) {
                    $columnIndices['eskul'] = $idx;
                } elseif (str_contains($cleaned, 'seni') || str_contains($cleaned, 'senbud') || str_contains($cleaned, 'budaya')) {
                    $columnIndices['senbud'] = $idx;
                }
            }

            $imported = 0;
            $updated = 0;
            $complete = 0;

            foreach ($lines as $line) {
                if (empty(trim($line))) continue;
                $row = str_getcsv($line);

                $nis = isset($columnIndices['nis']) ? trim($row[$columnIndices['nis']] ?? '') : '';
                $name = isset($columnIndices['nama']) ? trim($row[$columnIndices['nama']] ?? '') : '';
                $rayonName = isset($columnIndices['rayon']) ? trim($row[$columnIndices['rayon']] ?? '') : '';
                $eskulName = isset($columnIndices['eskul']) ? trim($row[$columnIndices['eskul']] ?? '') : '';
                $senbudName = isset($columnIndices['senbud']) ? trim($row[$columnIndices['senbud']] ?? '') : '';

                if (empty($nis) || empty($name)) continue;

                // Rayon resolution
                $rayon = null;
                if (!empty($rayonName)) {
                    $rayon = Rayon::whereRaw('LOWER(name) = ?', [strtolower($rayonName)])->first();
                    if (!$rayon) {
                        $psUser = User::where('role_id', 4)->first();
                        $rayon = Rayon::create([
                            'name' => $rayonName,
                            'ps_id' => $psUser ? $psUser->id : 1,
                        ]);
                    }
                } else {
                    $rayon = Rayon::first();
                    if (!$rayon) {
                        $rayon = Rayon::create(['name' => 'Rayon Umum', 'ps_id' => 1]);
                    }
                }

                // Student
                $student = Student::where('nis', $nis)->first();
                if ($student) {
                    $student->update([
                        'name' => $name,
                        'rayon_id' => $rayon ? $rayon->id : $student->rayon_id,
                    ]);
                    $updated++;
                } else {
                    $student = Student::create([
                        'nis' => $nis,
                        'name' => $name,
                        'rayon_id' => $rayon ? $rayon->id : 1,
                    ]);
                    $imported++;
                }

                $eskulIds = [];
                // Eskul (Ekstrakurikuler)
                if (!empty($eskulName)) {
                    $eskul = Eskul::where('type', '!=', 'SENBUD')
                        ->where(function ($q) use ($eskulName) {
                            $q->whereRaw('LOWER(name) = ?', [strtolower($eskulName)])
                              ->orWhere('name', 'like', "%{$eskulName}%");
                        })->first();

                    if (!$eskul) {
                        $instruktur = User::where('role_id', 3)->first();
                        $eskul = Eskul::create([
                            'name' => $eskulName,
                            'type' => str_contains(strtolower($eskulName), 'pramuka') ? 'PRAMUKA' : 'ESKUL',
                            'instruktur_id' => $instruktur ? $instruktur->id : 1,
                        ]);
                    }
                    $eskulIds[] = $eskul->id;
                }

                // Senbud (Seni Budaya)
                if (!empty($senbudName)) {
                    $senbud = Eskul::where('type', 'SENBUD')
                        ->where(function ($q) use ($senbudName) {
                            $q->whereRaw('LOWER(name) = ?', [strtolower($senbudName)])
                              ->orWhere('name', 'like', "%{$senbudName}%");
                        })->first();

                    if (!$senbud) {
                        $instruktur = User::where('role_id', 3)->first();
                        $senbud = Eskul::create([
                            'name' => $senbudName,
                            'type' => 'SENBUD',
                            'instruktur_id' => $instruktur ? $instruktur->id : 1,
                        ]);
                    }
                    $eskulIds[] = $senbud->id;
                }

                if (!empty($eskulIds)) {
                    $student->eskuls()->syncWithoutDetaching($eskulIds);
                }

                // Check completeness
                $stEskuls = $student->eskuls()->get();
                $hasE = $stEskuls->contains(fn($e) => in_array($e->type, ['ESKUL', 'PRAMUKA']));
                $hasS = $stEskuls->contains(fn($e) => $e->type === 'SENBUD');
                if ($hasE && $hasS) {
                    $complete++;
                }
            }

            $totalProcessed = $imported + $updated;
            return back()->with('success', "Sinkronisasi Google Spreadsheet berhasil! {$totalProcessed} siswa diproses ({$imported} baru, {$updated} diperbarui). {$complete} siswa telah lengkap memilih 1 Eskul & 1 Seni Budaya.");
        } catch (\Exception $e) {
            return back()->withErrors(['sheet_url' => 'Terjadi kesalahan saat sinkronisasi: ' . $e->getMessage()]);
        }
    }

    public function gformWebhook(Request $request)
    {
        $nis = trim($request->input('nis', ''));
        $name = trim($request->input('name', $request->input('nama', '')));
        $rayonName = trim($request->input('rayon', ''));
        $eskulName = trim($request->input('eskul', $request->input('ekstrakurikuler', '')));
        $senbudName = trim($request->input('senbud', $request->input('seni_budaya', '')));

        if (empty($nis) || empty($name)) {
            return response()->json(['status' => 'error', 'message' => 'NIS dan Nama Siswa wajib diisi'], 422);
        }

        $rayon = null;
        if (!empty($rayonName)) {
            $rayon = Rayon::whereRaw('LOWER(name) = ?', [strtolower($rayonName)])->first();
            if (!$rayon) {
                $psUser = User::where('role_id', 4)->first();
                $rayon = Rayon::create([
                    'name' => $rayonName,
                    'ps_id' => $psUser ? $psUser->id : 1,
                ]);
            }
        } else {
            $rayon = Rayon::first();
        }

        $student = Student::where('nis', $nis)->first();
        if ($student) {
            $student->update(['name' => $name, 'rayon_id' => $rayon ? $rayon->id : $student->rayon_id]);
        } else {
            $student = Student::create(['nis' => $nis, 'name' => $name, 'rayon_id' => $rayon ? $rayon->id : 1]);
        }

        $eskulIds = [];
        if (!empty($eskulName)) {
            $eskul = Eskul::where('type', '!=', 'SENBUD')
                ->where(function ($q) use ($eskulName) {
                    $q->whereRaw('LOWER(name) = ?', [strtolower($eskulName)])
                      ->orWhere('name', 'like', "%{$eskulName}%");
                })->first();
            if (!$eskul) {
                $instruktur = User::where('role_id', 3)->first();
                $eskul = Eskul::create([
                    'name' => $eskulName,
                    'type' => str_contains(strtolower($eskulName), 'pramuka') ? 'PRAMUKA' : 'ESKUL',
                    'instruktur_id' => $instruktur ? $instruktur->id : 1,
                ]);
            }
            $eskulIds[] = $eskul->id;
        }

        if (!empty($senbudName)) {
            $senbud = Eskul::where('type', 'SENBUD')
                ->where(function ($q) use ($senbudName) {
                    $q->whereRaw('LOWER(name) = ?', [strtolower($senbudName)])
                      ->orWhere('name', 'like', "%{$senbudName}%");
                })->first();
            if (!$senbud) {
                $instruktur = User::where('role_id', 3)->first();
                $senbud = Eskul::create([
                    'name' => $senbudName,
                    'type' => 'SENBUD',
                    'instruktur_id' => $instruktur ? $instruktur->id : 1,
                ]);
            }
            $eskulIds[] = $senbud->id;
        }

        if (!empty($eskulIds)) {
            $student->eskuls()->syncWithoutDetaching($eskulIds);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Data siswa {$student->name} (NIS: {$student->nis}) berhasil disinkronkan ke SIBAS.",
            'student_id' => $student->id,
        ]);
    }

    // =========================================================
    // 9. GALERI FOTO KEGIATAN (Card View)
    // =========================================================
    public function galeriIndex()
    {
        $schedules = Schedule::with(['eskul.instruktur', 'attendances'])
            ->whereNotNull('photo_url')
            ->orderBy('activity_date', 'desc')
            ->paginate(12);

        // Enrich each schedule with attendance summary
        $schedules->getCollection()->transform(function ($schedule) {
            $total = $schedule->attendances->count();
            $hadir = $schedule->attendances->where('status', 'HADIR')->count();
            $tidakHadir = $total - $hadir;

            $schedule->attendance_summary = [
                'total' => $total,
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
                'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
            ];

            return $schedule;
        });

        return Inertia::render('Admin/Galeri/Index', compact('schedules'));
    }

    public function galeriDetail($schedule_id)
    {
        $schedule = Schedule::with([
            'eskul.instruktur',
            'attendances.student.rayon',
            'sanggaRooms.sangga',
        ])->findOrFail($schedule_id);

        $attendances = $schedule->attendances;
        $total = $attendances->count();
        $hadir = $attendances->where('status', 'HADIR')->count();

        $summary = [
            'total' => $total,
            'hadir' => $hadir,
            'sakit' => $attendances->where('status', 'SAKIT')->count(),
            'izin' => $attendances->where('status', 'IZIN')->count(),
            'alpa' => $attendances->where('status', 'ALPA')->count(),
            'dispen' => $attendances->where('status', 'DISPEN')->count(),
            'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
        ];

        return Inertia::render('Admin/Galeri/Detail', compact('schedule', 'summary'));
    }

    // =========================================================
    // 10. DETEKSI JADWAL SISWA BERTABRAKAN
    // =========================================================
    public function clashDetection()
    {
        // Find students enrolled in multiple eskuls that have schedules on the same date
        $clashes = [];

        // Get all students with their eskuls and schedules
        $students = Student::with(['eskuls.schedules'])->get();

        foreach ($students as $student) {
            if ($student->eskuls->count() < 2) continue;

            $dateMap = []; // date => [eskul names]
            foreach ($student->eskuls as $eskul) {
                foreach ($eskul->schedules as $schedule) {
                    $date = $schedule->activity_date;
                    if (!isset($dateMap[$date])) {
                        $dateMap[$date] = [];
                    }
                    $dateMap[$date][] = [
                        'eskul_name' => $eskul->name,
                        'time' => substr($schedule->start_time, 0, 5) . ' - ' . substr($schedule->end_time, 0, 5),
                        'location' => $schedule->location,
                    ];
                }
            }

            // Find dates with more than 1 eskul
            foreach ($dateMap as $date => $eskulList) {
                if (count($eskulList) > 1) {
                    $clashes[] = [
                        'student_id' => $student->id,
                        'student_name' => $student->name,
                        'student_nis' => $student->nis,
                        'rayon' => $student->rayon ? $student->rayon->name : '-',
                        'date' => Carbon::parse($date)->translatedFormat('d F Y'),
                        'raw_date' => $date,
                        'conflicting_eskuls' => $eskulList,
                    ];
                }
            }
        }

        $totalClashes = count($clashes);
        $uniqueStudents = collect($clashes)->pluck('student_id')->unique()->count();

        return Inertia::render('Admin/Clash/Index', compact('clashes', 'totalClashes', 'uniqueStudents'));
    }
}
