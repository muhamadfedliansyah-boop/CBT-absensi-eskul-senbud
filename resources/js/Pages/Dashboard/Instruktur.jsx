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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Instruktur - SIBAS" />

            <div className="space-y-6">

                {/* 1. TOP BANNER WELCOME */}
                <div className="bg-gradient-to-r from-[#005b96] via-[#006ca7] to-[#004e7c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Background subtle radial glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-2.5 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-sky-100 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-sky-300 animate-ping"></span>
                            <span>SEMESTER GANJIL 2024/2025 • Panel Instruktur</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Selamat Datang, {userName}
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                            Anda mengampu <strong className="text-white font-bold">{totalEskulsCount} cabang kegiatan</strong> dengan total <strong className="text-white font-bold">{totalStudentsCount} siswa binaan</strong>. Pastikan pengisian presensi siswa dan unggah foto dokumentasi kegiatan dilakukan tepat waktu.
                        </p>
                    </div>

                    {/* Server Time Widget */}
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white shrink-0 relative z-10 flex items-center gap-4 shadow-inner">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                                Waktu Server Presensi
                            </div>
                            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                                {timeStr} <span className="text-xs font-bold text-sky-200">WIB</span>
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
                                <span className="text-xs font-bold text-slate-400">Sesi Saya</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-600 mt-2">
                                ↗ Tingkat Kehadiran
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                                <i className="bi bi-check2-all text-emerald-600"></i>
                                <span>Target Sekolah (≥ 80%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 4: Sesi Selesai / Terjadwal */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                TOTAL SESI KEGIATAN
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-sliders"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {sessionsThisWeek}
                            </div>
                            <div className="text-xs font-semibold text-slate-500 mt-2">
                                Terjadwal di Kalender
                            </div>
                            <div className="text-[11px] font-bold text-amber-700 mt-2 flex items-center gap-1">
                                <i className="bi bi-calendar-check-fill text-amber-600"></i>
                                <span>Sesuai Agenda Kesiswaan</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. ESKUL & KLUB YANG DIAMPU */}
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
                                        </div>

                                        {/* Status / Jadwal Sesi */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                                            <div className="w-16 h-14 rounded-xl bg-gradient-to-tr from-sky-800 to-sky-600 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                                                <i className="bi bi-clock-history text-lg"></i>
                                                <span className="text-[9px] font-black uppercase mt-0.5">Sesi</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                                                    {latestSchedule ? `Pertemuan: ${latestSchedule.activity_date}` : 'Belum Ada Jadwal'}
                                                </div>
                                                <div className="font-extrabold text-xs text-slate-900 truncate">
                                                    {latestSchedule ? `${latestSchedule.start_time || ''} - ${latestSchedule.end_time || ''} (${latestSchedule.room_number || 'Ruang Standar'})` : 'Jadwal belum ditambahkan Admin'}
                                                </div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {latestSchedule?.material_text || 'Materi pembelajaran belum diisi'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2.5 pt-1">
                                            {latestSchedule ? (
                                                <Link
                                                    href={`/instruktur/presensi/${latestSchedule.id}`}
                                                    className="flex-1 py-3 px-4 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-sky-900/15 flex items-center justify-center gap-2"
                                                >
                                                    <i className="bi bi-camera-fill"></i>
                                                    <span>Input Absensi & Foto</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/instruktur/my-eskul"
                                                    className="flex-1 py-3 px-4 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-sky-900/15 flex items-center justify-center gap-2"
                                                >
                                                    <i className="bi bi-journal-text"></i>
                                                    <span>Buka Menu Eskul</span>
                                                </Link>
                                            )}
                                            <Link
                                                href="/instruktur/my-eskul"
                                                className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <i className="bi bi-list-check"></i>
                                                <span>Daftar Sesi</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 4. BOTTOM SECTION: LEFT (40%) MAKLUMAT & RIGHT (60%) AGENDA JADWAL */}
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

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                <span>Perlu bantuan teknis sistem?</span>
                                <a href="javascript:void(0)" onClick={() => alert('Membuka kontak tim Admin CBT SIBAS.')} className="font-bold text-[#005b96] hover:underline flex items-center gap-1">
                                    <i className="bi bi-headset"></i> Hubungi Admin CBT
                                </a>
                            </div>
                        </div>

                        {/* Tips Dokumentasi Eskul */}
                        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70 space-y-1.5">
                            <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5">
                                <i className="bi bi-lightbulb-fill text-amber-500"></i>
                                <span>Tips Dokumentasi Eskul</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                Ambil foto dengan orientasi lanskap (*landscape*) yang memperlihatkan antusiasme siswa saat mempraktikkan materi. Sistem secara otomatis menyematkan stempel waktu (*timestamp*) dan koordinat sekolah.
                            </p>
                        </div>

                    </div>

                    {/* Right Column (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        Agenda & Jadwal 3 Pekan ke Depan
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Rencana pertemuan tersisa menuju Penilaian Akhir Semester (PAS Eskul)
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
                                        const today = new Date().toISOString().split('T')[0];
                                        const isPast = sch.activity_date < today;
                                        const isToday = sch.activity_date === today;
                                        return (
                                            <div
                                                key={sch.id || idx}
                                                className={`p-4 rounded-2xl border space-y-2 ${
                                                    isToday
                                                        ? 'bg-sky-50/40 border-sky-200/70'
                                                        : isPast
                                                        ? 'bg-slate-50 border-slate-100 opacity-75'
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
                                                            <div className="font-extrabold text-xs text-slate-900">
                                                                {sch.activity_date} • {sch.eskul?.name || '-'}
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
                                                            {isToday ? 'Hari Ini' : isPast ? 'Selesai' : 'Mendatang'}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <Link
                                                                href={`/instruktur/presensi/${sch.id}`}
                                                                className="px-2 py-1 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-lg text-[10px] font-bold transition-all"
                                                            >
                                                                Absen
                                                            </Link>
                                                            <Link
                                                                href={`/instruktur/jadwal/materi/${sch.id}`}
                                                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all"
                                                                title="Materi & Foto"
                                                            >
                                                                <i className="bi bi-file-earmark-text"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Download link */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <a
                                    href="javascript:void(0)"
                                    onClick={() => alert('Mengunduh dokumen Berita Acara & RPP Semester...')}
                                    className="font-bold text-[#005b96] hover:text-[#004e7c] flex items-center gap-1.5"
                                >
                                    <i className="bi bi-file-earmark-arrow-down-fill text-sm"></i>
                                    <span>Unduh Berita Acara & RPP Semester</span>
                                </a>
                                <span className="text-slate-400 font-medium text-[11px]">
                                    Format PDF / DOCX
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
