import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function InstrukturDashboard({
    myEskuls = [],
    mySchedules = [],
    totalEskulsCount = 0,
    totalStudentsCount = 0,
    averageAttendance = 0,
    sessionsThisWeek = '0 Sesi',
    totalPhotos = 0,
    stats = { hadir: 0, sakit: 0, izin: 0, alpa: 0, dispen: 0, total: 0 },
    eskulStats = [],
}) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Instruktur';

    // Current live time
    const [timeStr, setTimeStr] = useState('15:21');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setTimeStr(`${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Get today's schedule or next upcoming
    const today = new Date().toISOString().split('T')[0];
    const todaySchedule = mySchedules.find(s => s.activity_date === today) || mySchedules[0];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Instruktur - SIBAS" />

            <div className="space-y-6">

                {/* 1. TOP BANNER WELCOME */}
                <div className="bg-gradient-to-r from-[#005b96] via-[#006ca7] to-[#004e7c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Background subtle radial glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-3 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-sky-100 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-sky-300 animate-ping"></span>
                            <span>SEMESTER GANJIL 2024/2025 • Panel Instruktur Eskul & Senbud</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Selamat Datang, {userName}
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                            Anda ditugaskan mengampu <strong className="text-white font-bold">{totalEskulsCount} cabang kegiatan</strong> dengan total <strong className="text-white font-bold">{totalStudentsCount} siswa</strong>. Pastikan pengisian presensi dan unggah dokumentasi kegiatan ke Lib Foto dilakukan tepat waktu.
                        </p>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {todaySchedule ? (
                                <Link
                                    href={`/instruktur/presensi/${todaySchedule.id}`}
                                    className="px-4 py-2 bg-white text-slate-900 hover:bg-sky-50 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
                                >
                                    <i className="bi bi-pencil-square text-sky-700"></i>
                                    <span>Presensi Sesi Hari Ini</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/instruktur/my-eskul"
                                    className="px-4 py-2 bg-white text-slate-900 hover:bg-sky-50 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
                                >
                                    <i className="bi bi-calendar3 text-sky-700"></i>
                                    <span>Lihat Jadwal & Sesi</span>
                                </Link>
                            )}
                            <Link
                                href="/instruktur/galeri"
                                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md"
                            >
                                <i className="bi bi-images text-purple-300"></i>
                                <span>Buka Lib Foto ({totalPhotos})</span>
                            </Link>
                            <Link
                                href="/instruktur/rekap"
                                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md"
                            >
                                <i className="bi bi-file-earmark-spreadsheet text-emerald-300"></i>
                                <span>Rekap Kehadiran</span>
                            </Link>
                        </div>
                    </div>

                    {/* Server Time Widget */}
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white shrink-0 relative z-10 flex items-center gap-4 shadow-inner">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                                Waktu Server Presensi
                            </div>
                            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5 font-mono">
                                {timeStr} <span className="text-xs font-bold text-sky-200">WIB</span>
                            </div>
                            <div className="text-[10px] text-sky-200 font-semibold mt-0.5">
                                Presensi Otomatis SIBAS
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                            <i className="bi bi-clock-history"></i>
                        </div>
                    </div>
                </div>

                {/* 2. FOUR METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Metric 1: Eskul Diampu */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                ESKUL DIAMPU
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-grid-3x3-gap-fill"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {totalEskulsCount} <span className="text-xs font-bold text-slate-400 font-sans">Unit Aktif</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-500 mt-2 truncate">
                                {myEskuls.map(e => e.name).join(', ') || 'Belum ada eskul diampu'}
                            </div>
                            <div className="text-[11px] font-bold text-sky-600 mt-1 flex items-center gap-1">
                                <i className="bi bi-patch-check-fill"></i>
                                <span>SK Instruktur Resmi</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 2: Total Murid Binaan */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                TOTAL MURID BINAAN
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-people-fill"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {totalStudentsCount} <span className="text-xs font-bold text-slate-400 font-sans">Siswa Terdaftar</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-500 mt-2 truncate">
                                {myEskuls.length > 0 ? myEskuls.map(e => `${e.students?.length || 0} ${e.name}`).join(' • ') : '0 Siswa'}
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Terdata di Database</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 3: Rata-Rata Kehadiran */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                RATA-RATA KEHADIRAN
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none flex items-baseline gap-2">
                                <span>{averageAttendance}%</span>
                                <span className="text-xs font-bold text-slate-400 font-mono">Hadir</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-600 mt-2">
                                ↗ Tingkat Kehadiran Keseluruhan
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                                <i className="bi bi-check2-all text-emerald-600"></i>
                                <span>Target Sekolah (≥ 80%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 4: Library Foto Kegiatan */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                LIB FOTO DOKUMENTASI
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-images"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {totalPhotos} <span className="text-xs font-bold text-slate-400 font-sans">Foto Terkirim</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-500 mt-2">
                                {sessionsThisWeek} Terjadwal
                            </div>
                            <div className="text-[11px] font-bold text-purple-700 mt-1 flex items-center gap-1">
                                <Link href="/instruktur/galeri" className="hover:underline flex items-center gap-1">
                                    <i className="bi bi-arrow-right-circle-fill"></i>
                                    <span>Buka Galeri Foto</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. ATTENDANCE BREAKDOWN STATS BAR */}
                {stats.total > 0 && (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                    Distribusi Presensi Sesi Saya ({stats.total} Total Rekaman)
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                    Persentase rincian status kehadiran seluruh siswa di bawah bimbingan Anda.
                                </p>
                            </div>
                            <Link href="/instruktur/rekap" className="text-xs font-bold text-[#0077b6] hover:underline flex items-center gap-1">
                                <span>Lihat Rekap Lengkap</span>
                                <i className="bi bi-chevron-right text-[10px]"></i>
                            </Link>
                        </div>

                        {/* Multi-segment progress bar */}
                        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                            <div
                                style={{ width: `${(stats.hadir / stats.total) * 100}%` }}
                                className="bg-emerald-500 hover:opacity-90 transition-all"
                                title={`Hadir: ${stats.hadir} (${Math.round((stats.hadir / stats.total) * 100)}%)`}
                            ></div>
                            <div
                                style={{ width: `${(stats.sakit / stats.total) * 100}%` }}
                                className="bg-sky-500 hover:opacity-90 transition-all"
                                title={`Sakit: ${stats.sakit}`}
                            ></div>
                            <div
                                style={{ width: `${(stats.izin / stats.total) * 100}%` }}
                                className="bg-amber-500 hover:opacity-90 transition-all"
                                title={`Izin: ${stats.izin}`}
                            ></div>
                            <div
                                style={{ width: `${(stats.dispen / stats.total) * 100}%` }}
                                className="bg-purple-500 hover:opacity-90 transition-all"
                                title={`Dispen: ${stats.dispen}`}
                            ></div>
                            <div
                                style={{ width: `${(stats.alpa / stats.total) * 100}%` }}
                                className="bg-rose-500 hover:opacity-90 transition-all"
                                title={`Alpa: ${stats.alpa}`}
                            ></div>
                        </div>

                        {/* Badges Legend */}
                        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="font-semibold text-slate-600">Hadir:</span>
                                <strong className="text-slate-900">{stats.hadir}</strong>
                                <span className="text-[11px] text-slate-400">({Math.round((stats.hadir / stats.total) * 100)}%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                                <span className="font-semibold text-slate-600">Sakit:</span>
                                <strong className="text-slate-900">{stats.sakit}</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                <span className="font-semibold text-slate-600">Izin:</span>
                                <strong className="text-slate-900">{stats.izin}</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                <span className="font-semibold text-slate-600">Dispen:</span>
                                <strong className="text-slate-900">{stats.dispen}</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                <span className="font-semibold text-slate-600">Alpa:</span>
                                <strong className="text-slate-900">{stats.alpa}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. ESKUL & KLUB YANG DIAMPU */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Eskul & Seni Budaya yang Anda Ajar</h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Cabang kegiatan resmi yang ditugaskan kepada akun Anda oleh Administrator Kesiswaan.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400 font-semibold">Total Unit:</span>
                            <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold rounded-full">
                                {myEskuls.length} Kegiatan
                            </span>
                        </div>
                    </div>

                    {myEskuls.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-3">
                            <div className="w-14 h-14 bg-sky-50 text-sky-700 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                <i className="bi bi-mortarboard"></i>
                            </div>
                            <h4 className="text-base font-black text-slate-900">Belum Ada Ekstrakurikuler yang Ditugaskan</h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Akun Anda belum ditetapkan oleh Administrator Kesiswaan sebagai pengampu cabang eskul atau seni budaya. Silakan hubungi bagian Admin untuk menetapkan Anda sebagai instruktur pada cabang kegiatan terkait di menu <strong>Ekstrakurikuler</strong>.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myEskuls.map((eskul, idx) => {
                                const studentCount = eskul.students?.length || 0;
                                const latestSchedule = eskul.schedules?.[0];
                                const scheduleCount = eskul.schedules?.length || 0;
                                const stat = eskulStats.find(s => s.id === eskul.id);
                                const rate = stat?.attendance_rate ?? 0;
                                const photosCount = stat?.photos_count ?? 0;

                                return (
                                    <div key={eskul.id || idx} className="bg-white rounded-3xl p-6 border-t-4 border-t-[#0077b6] border border-slate-200/80 shadow-xs space-y-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-2xl shrink-0">
                                                    <i className={eskul.type === 'SENBUD' ? 'bi bi-palette-fill' : eskul.type === 'PRAMUKA' ? 'bi bi-compass-fill' : 'bi bi-award-fill'}></i>
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-md uppercase">
                                                            {eskul.type}
                                                        </span>
                                                        {latestSchedule && (
                                                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                                                                <i className="bi bi-calendar3"></i> {latestSchedule.activity_date}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-lg font-black text-slate-900 mt-1">
                                                        {eskul.name}
                                                    </h4>
                                                    <p className="text-xs font-semibold text-slate-400">
                                                        {studentCount} Siswa Aktif Terdaftar • {scheduleCount} Pertemuan
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Rate badge */}
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-black text-emerald-600 font-mono leading-none">
                                                    {rate}%
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                    Kehadiran
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attendance Progress bar for this eskul */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                                                <span>Tingkat Kehadiran Siswa</span>
                                                <span className="font-bold text-slate-700">{rate}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-[#0077b6] h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, rate)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Status / Jadwal Sesi */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                                            <div className="w-16 h-14 rounded-xl bg-gradient-to-tr from-sky-800 to-sky-600 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                                                <i className="bi bi-clock-history text-lg"></i>
                                                <span className="text-[9px] font-black uppercase mt-0.5">Sesi</span>
                                            </div>
                                            <div className="overflow-hidden flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                                                        {latestSchedule ? `Pertemuan: ${latestSchedule.activity_date}` : 'Belum Ada Jadwal'}
                                                    </div>
                                                    {photosCount > 0 && (
                                                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <i className="bi bi-image"></i> {photosCount} Foto
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="font-extrabold text-xs text-slate-900 truncate mt-0.5">
                                                    {latestSchedule ? `${latestSchedule.start_time || ''} - ${latestSchedule.end_time || ''} (${latestSchedule.room_number || latestSchedule.location || 'Ruang Standar'})` : 'Jadwal belum ditambahkan Admin'}
                                                </div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {latestSchedule?.material_text || 'Materi pembelajaran belum diisi'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {latestSchedule ? (
                                                <Link
                                                    href={`/instruktur/presensi/${latestSchedule.id}`}
                                                    className="flex-1 py-2.5 px-4 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-sky-900/15 flex items-center justify-center gap-2"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                    <span>Input Presensi</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/instruktur/my-eskul"
                                                    className="flex-1 py-2.5 px-4 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-sky-900/15 flex items-center justify-center gap-2"
                                                >
                                                    <i className="bi bi-journal-text"></i>
                                                    <span>Buka Cabang</span>
                                                </Link>
                                            )}
                                            <Link
                                                href={`/instruktur/rekap?eskul_id=${eskul.id}`}
                                                className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                                title="Rekap Kehadiran Siswa"
                                            >
                                                <i className="bi bi-file-earmark-spreadsheet"></i>
                                                <span>Rekap</span>
                                            </Link>
                                            <Link
                                                href={`/instruktur/galeri?eskul_id=${eskul.id}`}
                                                className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                                title="Lib Foto Dokumentasi"
                                            >
                                                <i className="bi bi-images"></i>
                                                <span>Lib Foto</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 5. BOTTOM SECTION: LEFT (40%) MAKLUMAT & RIGHT (60%) AGENDA JADWAL */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* Maklumat Kesiswaan Card */}
                        <div className="bg-white rounded-3xl p-6 border-l-4 border-l-amber-500 border border-slate-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-base">
                                        <i className="bi bi-megaphone-fill"></i>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            MAKLUMAT KESISWAAN
                                        </div>
                                        <h4 className="text-xs font-black text-slate-900">
                                            Batas Presensi & Foto Hari Ini
                                        </h4>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded text-[10px] font-black uppercase">
                                    PENTING
                                </span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                                <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                                    <i className="bi bi-alarm-fill text-amber-700"></i>
                                    <span>Tenggat Pukul 17.00 WIB</span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    "Bapak/Ibu Instruktur, mohon pastikan seluruh presensi dan minimal 2 foto bukti fisik kegiatan (suasana kelas & hasil karya) telah diunggah ke sistem sebelum pukul 17.00 WIB untuk rekapitulasi surat pertanggungjawaban honorarium mingguan."
                                </p>
                                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                                    <strong className="text-slate-800">Bu Elvia, M.Pd.</strong>
                                    <span className="text-slate-500">Waka Kesiswaan SIM-ESKUL</span>
                                </div>
                            </div>
                        </div>

                        {/* Lib Foto Widget Shortcut */}
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 bg-white/15 rounded-lg text-[10px] font-extrabold uppercase text-purple-200">
                                    FITUR BARU
                                </span>
                                <i className="bi bi-camera-fill text-xl text-purple-300"></i>
                            </div>
                            <h4 className="text-base font-extrabold">Library Foto Dokumentasi</h4>
                            <p className="text-xs text-purple-100/80 leading-relaxed">
                                Seluruh foto bukti kegiatan yang Anda kirim tersimpan rapi dan dapat ditinjau kembali kapan saja di menu Lib Foto.
                            </p>
                            <Link
                                href="/instruktur/galeri"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-purple-950 hover:bg-purple-50 rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                                <span>Buka Library Foto ({totalPhotos})</span>
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>

                    </div>

                    {/* Right Column (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        Agenda & Jadwal Sesi Pertemuan
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Daftar pertemuan eskul binaan Anda di semester berjalan
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-sky-100/70 text-sky-800 rounded-full text-[10px] font-extrabold">
                                    {mySchedules.length} Jadwal Tersedia
                                </span>
                            </div>

                            {/* Schedule list — Dynamic */}
                            <div className="space-y-3">
                                {mySchedules.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-xs font-medium">
                                        <i className="bi bi-calendar-x text-2xl block mb-2"></i>
                                        Belum ada jadwal yang dibuat Admin untuk eskul Anda.
                                    </div>
                                ) : (
                                    mySchedules.slice(0, 6).map((sch, idx) => {
                                        const isPast = sch.activity_date < today;
                                        const isToday = sch.activity_date === today;
                                        const hasPhoto = !!sch.photo_url;
                                        const attendanceCount = sch.attendances?.length || 0;

                                        return (
                                            <div
                                                key={sch.id || idx}
                                                className={`p-4 rounded-2xl border space-y-2 ${
                                                    isToday
                                                        ? 'bg-sky-50/40 border-sky-200/70 shadow-xs'
                                                        : isPast
                                                        ? 'bg-slate-50 border-slate-100'
                                                        : 'bg-emerald-50/30 border-emerald-200/50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl text-white flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                                                            isToday ? 'bg-[#005b96]' : isPast ? 'bg-slate-500' : 'bg-emerald-700'
                                                        }`}>
                                                            <span className="text-[8px] opacity-75 leading-none uppercase">{sch.eskul?.type || 'SKL'}</span>
                                                            <i className="bi bi-calendar3 text-sm leading-none mt-0.5"></i>
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                                                                <span>{sch.activity_date} • {sch.eskul?.name || '-'}</span>
                                                                {hasPhoto && (
                                                                    <span className="text-purple-600 text-[11px]" title="Foto dokumentasi sudah diunggah">
                                                                        <i className="bi bi-image-fill"></i>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 font-medium">
                                                                {sch.start_time ? `${sch.start_time} - ${sch.end_time}` : 'Jam belum ditentukan'}
                                                                {sch.location ? ` • ${sch.location}` : ''}
                                                            </div>
                                                            {sch.material_text && (
                                                                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                                                    {sch.material_text}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                                                            isToday
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : isPast
                                                                ? 'bg-slate-200 text-slate-600'
                                                                : 'bg-sky-100 text-sky-800'
                                                        }`}>
                                                            {isToday ? 'Hari Ini' : isPast ? (attendanceCount > 0 ? 'Sudah Diabsen' : 'Selesai') : 'Mendatang'}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <Link
                                                                href={`/instruktur/presensi/${sch.id}`}
                                                                className="px-2.5 py-1 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-lg text-[10px] font-bold transition-all"
                                                            >
                                                                Presensi
                                                            </Link>
                                                            <Link
                                                                href={`/instruktur/jadwal/materi/${sch.id}`}
                                                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all"
                                                                title="Materi & Foto"
                                                            >
                                                                <i className="bi bi-camera"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Bottom quick links */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <Link
                                    href="/instruktur/rekap"
                                    className="font-bold text-[#005b96] hover:text-[#004e7c] flex items-center gap-1.5"
                                >
                                    <i className="bi bi-file-earmark-spreadsheet-fill text-sm text-emerald-600"></i>
                                    <span>Buka Rekap Lengkap & Persentase Siswa</span>
                                </Link>
                                <span className="text-slate-400 font-medium text-[11px]">
                                    SIBAS Panel Instruktur
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
