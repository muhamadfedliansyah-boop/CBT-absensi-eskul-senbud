<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstrukturController;
use App\Http\Controllers\PSController;
use App\Http\Controllers\PublicPortalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - SIBAS (Sistem absensi)
|--------------------------------------------------------------------------
|
| 1. Public Routes: Portal siswa & informasi terbuka tanpa login
| 2. Auth Routes: Login & Logout petugas / staf
| 3. Protected Dashboard: Berdasarkan Hak Akses Role (Admin, Instruktur, PS)
|
*/

// ==========================================
// 1. PUBLIC ROUTES (Siswa & Pengunjung)
// ==========================================
Route::get('/', [PublicPortalController::class, 'index'])->name('home');
Route::get('/api/cek-presensi', [PublicPortalController::class, 'cekPresensi'])->name('api.cek-presensi');
Route::get('/api/eskul/{id}', [PublicPortalController::class, 'getEskulDetail'])->name('api.eskul-detail');

// ==========================================
// 2. AUTHENTICATION ROUTES (Petugas & Staf)
// ==========================================
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login.post');

    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware(['throttle:5,1', 'only.instruktur.register'])
        ->name('register.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// ==========================================
// 3. PROTECTED ROUTES (Dashboard Staf)
// ==========================================
Route::middleware('auth')->group(function () {
    
    // Unified Dashboard Entry Point
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ------------------------------------------
    // A. Role: ADMIN / KOORDINATOR KESISWAAN
    // ------------------------------------------
    Route::middleware('role:admin,koordinator')->prefix('admin')->name('admin.')->group(function () {
        // Master Data Ekstrakurikuler & Senbud
        Route::get('/eskul', [AdminController::class, 'eskulIndex'])->name('eskul.index');
        Route::post('/eskul', [AdminController::class, 'eskulStore'])->name('eskul.store');
        Route::put('/eskul/{eskul}', [AdminController::class, 'eskulUpdate'])->name('eskul.update');
        Route::delete('/eskul/{eskul}', [AdminController::class, 'eskulDestroy'])->name('eskul.destroy');

        // Master Data Siswa
        Route::get('/students', [AdminController::class, 'studentIndex'])->name('students.index');
        Route::post('/students', [AdminController::class, 'studentStore'])->name('students.store');
        Route::put('/students/{student}', [AdminController::class, 'studentUpdate'])->name('students.update');
        Route::delete('/students/{student}', [AdminController::class, 'studentDestroy'])->name('students.destroy');

        // Master Data Rayon
        Route::get('/rayons', [AdminController::class, 'rayonIndex'])->name('rayons.index');
        Route::post('/rayons', [AdminController::class, 'rayonStore'])->name('rayons.store');
        Route::put('/rayons/{rayon}', [AdminController::class, 'rayonUpdate'])->name('rayons.update');
        Route::delete('/rayons/{rayon}', [AdminController::class, 'rayonDestroy'])->name('rayons.destroy');

        // Master Data Pengguna & Instruktur
        Route::get('/users', [AdminController::class, 'userIndex'])->name('users.index');
        Route::post('/users', [AdminController::class, 'userStore'])->name('users.store');
        Route::put('/users/{user}', [AdminController::class, 'userUpdate'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'userDestroy'])->name('users.destroy');

        // Kelola Jadwal Global & Alokasi Ruangan
        Route::get('/schedules', [AdminController::class, 'scheduleIndex'])->name('schedules.index');
        Route::post('/schedules', [AdminController::class, 'scheduleStore'])->name('schedules.store');
        Route::put('/schedules/{schedule}', [AdminController::class, 'scheduleUpdate'])->name('schedules.update');
        Route::delete('/schedules/{schedule}', [AdminController::class, 'scheduleDestroy'])->name('schedules.destroy');

        // Rekapitulasi & Laporan Presensi Lengkap
        Route::get('/rekapitulasi', [AdminController::class, 'rekapitulasiIndex'])->name('rekap.index');

        // ===== IMPORT DATA DARI EXCEL =====
        Route::post('/import/students', [AdminController::class, 'importStudents'])->name('import.students');
        Route::post('/import/users', [AdminController::class, 'importUsers'])->name('import.users');
        Route::post('/import/eskuls', [AdminController::class, 'importEskuls'])->name('import.eskuls');
        Route::post('/import/schedules', [AdminController::class, 'importSchedules'])->name('import.schedules');

        // ===== EXPORT LAPORAN KE EXCEL =====
        Route::get('/export/attendance', [AdminController::class, 'exportAttendance'])->name('export.attendance');
        Route::get('/export/students', [AdminController::class, 'exportStudents'])->name('export.students');
        Route::get('/export/schedules', [AdminController::class, 'exportSchedules'])->name('export.schedules');

        // ===== SINKRONISASI GOOGLE SPREADSHEET (GFORM) =====
        Route::post('/sync/google-sheet', [AdminController::class, 'syncGoogleSheet'])->name('sync.google-sheet');

        // ===== GALERI FOTO KEGIATAN =====
        Route::get('/galeri', [AdminController::class, 'galeriIndex'])->name('galeri.index');
        Route::get('/galeri/{schedule_id}', [AdminController::class, 'galeriDetail'])->name('galeri.detail');

        // ===== DETEKSI JADWAL BENTROK =====
        Route::get('/clash-detection', [AdminController::class, 'clashDetection'])->name('clash.index');
    });

    // ------------------------------------------
    // B. Role: INSTRUKTUR / PEMBINA ESKUL
    // ------------------------------------------
    Route::middleware('role:instruktur,pembina,admin')->prefix('instruktur')->name('instruktur.')->group(function () {
        // Daftar Eskul yang diampu
        Route::get('/my-eskul', [InstrukturController::class, 'myEskul'])->name('eskul');

        // Input & Rekam Presensi Siswa per Pertemuan
        Route::get('/presensi/{schedule_id}', [InstrukturController::class, 'presensiIndex'])->name('presensi.input');
        Route::post('/presensi/{schedule_id}', [InstrukturController::class, 'presensiStore'])->name('presensi.store');

        // Galeri & Library Foto Dokumentasi Kegiatan Instruktur
        Route::get('/galeri', [InstrukturController::class, 'galeriIndex'])->name('galeri');

        // Rekapitulasi Presensi & Persentase Kehadiran
        Route::get('/rekap', [InstrukturController::class, 'rekapIndex'])->name('rekap');

        // Unggah Materi Pertemuan & Foto Kegiatan
        Route::get('/jadwal/materi/{schedule_id}', [InstrukturController::class, 'materiEdit'])->name('materi.edit');
        Route::post('/jadwal/materi/{schedule_id}', [InstrukturController::class, 'materiUpdate'])->name('materi.update');

        // Kelola Pembagian Ruangan Sangga
        Route::get('/sangga/{eskul_id}', [InstrukturController::class, 'sanggaIndex'])->name('sangga');
        Route::post('/sangga/{eskul_id}', [InstrukturController::class, 'sanggaStore'])->name('sangga.store');
        Route::post('/sangga/room/{schedule_id}', [InstrukturController::class, 'sanggaRoomStore'])->name('sangga.room.store');
    });

    // ------------------------------------------
    // C. Role: PEMBIMBING SISWA (PS) / GURU / LABORAN
    // ------------------------------------------
    Route::middleware('role:ps,pembimbing,guru,laboran,admin')->prefix('ps')->name('ps.')->group(function () {
        // Pantau Kehadiran Siswa Rayon Bimbingan
        Route::get('/monitoring-rayon', [PSController::class, 'monitoringRayon'])->name('rayon.monitoring');
        Route::get('/rayon', [PSController::class, 'monitoringRayon'])->name('rayon.index');

        // Input & Validasi Dispensasi / Izin Siswa
        Route::get('/dispensasi', [PSController::class, 'dispensasiIndex'])->name('dispensasi.index');
        Route::post('/dispensasi', [PSController::class, 'dispensasiStore'])->name('dispensasi.store');

        // Laporan Keaktifan Siswa Rayon
        Route::get('/laporan', [PSController::class, 'laporanRayon'])->name('laporan.index');
    });

});

// ===== 4. WEBHOOK GOOGLE FORM / SPREADSHEET (APPS SCRIPT) =====
Route::post('/api/gform/webhook', [AdminController::class, 'gformWebhook']);
