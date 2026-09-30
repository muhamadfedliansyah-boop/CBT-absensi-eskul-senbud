import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard({
    totalStudents = 1285,
    totalEskuls = 74,
    totalSchedules = 18,
    totalUsers = 36,
    recentAttendances = [],
    totalGroups = 74,
    incompleteData = 0,
    clashWarnings = 0,
    unrecordedSessions = 0,
    averageAttendanceRate = 88.6,
    completionRate = 92,
    totalPhotos = 142,
}) {
    const [startDate, setStartDate] = useState('2026-09-01');
    const [endDate, setEndDate] = useState('2026-09-26');
    const [selectedActivity, setSelectedActivity] = useState('all');

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Aneka Absen - Administrator" />

            <div className="space-y-6">
                
                {/* 1. TOP STATUS BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        Dashboard Aneka Absen
                    </h1>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-bold self-start sm:self-auto shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                        <span>Sistem Online • Semester Ganjil 2026/2027</span>
                    </div>
                </div>

                {/* 2. HERO BANNER */}
                <div className="bg-gradient-to-r from-[#0077b6] via-[#005f9e] to-[#004e7c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Background Subtle Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-3 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-sky-100 backdrop-blur-md">
                            <i className="bi bi-grid-1x2"></i>
                            <span>Dashboard Administrator / Kesiswaan</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Selamat datang, Administrator Aneka Absen
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                            Pantau kegiatan, kehadiran, dan tindak lanjut siswa dalam satu tampilan terpusat.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/admin/eskul"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#005b96] hover:bg-sky-50 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                            >
                                <i className="bi bi-pencil-square"></i>
                                <span>Input Absensi Eskul (Mode Admin)</span>
                            </Link>

                            <Link
                                href="/admin/students"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                <i className="bi bi-person-check-fill"></i>
                                <span>Absenkan Siswa</span>
                            </Link>
                        </div>
                    </div>

                    {/* Today Date Widget Card */}
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white shrink-0 relative z-10 flex items-center gap-3.5 shadow-inner">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                            <i className="bi bi-calendar-event"></i>
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-sky-200">HARI INI</div>
                            <div className="text-sm sm:text-base font-extrabold tracking-tight">
                                Sabtu, 26 September 2026
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. FILTER RINGKASAN CARD */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold">
                            <i className="bi bi-funnel-fill"></i>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Filter Ringkasan</h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Sesuaikan periode dan kegiatan untuk memperbarui data dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        {/* Tanggal Mulai */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Tanggal mulai</label>
                            <div className="relative flex items-center">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Tanggal Selesai */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Tanggal selesai</label>
                            <div className="relative flex items-center">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Kegiatan Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Kegiatan</label>
                            <select
                                value={selectedActivity}
                                onChange={(e) => setSelectedActivity(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all cursor-pointer"
                            >
                                <option value="all">Semua kegiatan</option>
                                <option value="robotika">Robotika & Internet of Things</option>
                                <option value="desain">Desain Grafis & Multimedia</option>
                                <option value="tari">Tari Tradisional Sunda</option>
                                <option value="futsal">Futsal Prestasi</option>
                                <option value="pramuka">Pramuka Penegak</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. FIVE STATS CARDS IN A ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {/* Card 1: Siswa Aktif */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                SISWA AKTIF
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                {totalStudents}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Seluruh sekolah
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-people-fill"></i>
                        </div>
                    </div>

                    {/* Card 2: Kelompok Aktif */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                KELOMPOK AKTIF
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                {totalGroups}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Kelompok kegiatan
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-calendar3"></i>
                        </div>
                    </div>

                    {/* Card 3: Data Belum Lengkap */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                DATA BELUM LENGKAP
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                {incompleteData}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Siswa tanpa rombel/rayon
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-file-earmark-text"></i>
                        </div>
                    </div>

                    {/* Card 4: Peringatan Bentrok */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                PERINGATAN BENTROK
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                {clashWarnings}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Jadwal perlu diperiksa
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-clock-history"></i>
                        </div>
                    </div>

                    {/* Card 5: Belum Diabsen */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                BELUM DIABSEN
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                {unrecordedSessions}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Pertemuan belum selesai
                            </div>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-bar-chart-fill"></i>
                        </div>
                    </div>
                </div>

                {/* 5. TUGAS DAN JADWAL HARI INI */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-clock-fill text-slate-400"></i>
                            <h3 className="text-sm font-extrabold text-slate-900">Tugas dan Jadwal Hari Ini</h3>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                            Sinkronisasi Real-Time
                        </span>
                    </div>

                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl text-slate-400 mb-2">
                            <i className="bi bi-calendar2-check"></i>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Tidak ada tugas hari ini.</h4>
                        <p className="text-xs text-slate-400 max-w-md">
                            Semua absensi sesi eskul dan pramuka telah rampung atau belum dijadwalkan pada hari ini.
                        </p>
                    </div>
                </div>

                {/* 6. PERTEMUAN DALAM PERIODE */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-journal-text text-slate-400"></i>
                            <h3 className="text-sm font-extrabold text-slate-900">Pertemuan dalam Periode</h3>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                            Rentang 01/09/2026 – 26/09/2026
                        </span>
                    </div>

                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl text-slate-400 mb-2">
                            <i className="bi bi-camera-video-off"></i>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Belum ada pertemuan.</h4>
                        <p className="text-xs text-slate-400 max-w-md">
                            Pilih rentang tanggal lain atau pilih kegiatan spesifik pada filter di atas untuk melihat log pertemuan.
                        </p>
                    </div>
                </div>

                {/* 7. THREE BOTTOM ANALYTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Bottom Card 1: Ringkasan Kehadiran Rata-rata */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                RINGKASAN KEHADIRAN
                            </div>
                            <div className="text-xs text-slate-400 font-semibold">RATA-RATA</div>
                            <div className="text-3xl font-black text-slate-900">
                                {averageAttendanceRate}%
                            </div>
                            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>+2.4% dibanding pekan lalu</span>
                            </div>
                        </div>

                        {/* Circular Indicator */}
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-100"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-[#0077b6]"
                                    strokeDasharray="88, 100"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <span className="absolute text-xs font-black text-slate-800">88%</span>
                        </div>
                    </div>

                    {/* Bottom Card 2: Tingkat Ketuntasan Presensi */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    TINGKAT KETUNTASAN PRESENSI
                                </div>
                                <div className="text-3xl font-black text-slate-900 mt-2">
                                    {completionRate}%
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                                <i className="bi bi-shield-check"></i>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${completionRate}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                <span>68 dari 74 kelompok tuntas</span>
                                <span className="text-slate-400">Target: 95%</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Card 3: Foto Dokumentasi Kegiatan */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                FOTO DOKUMENTASI KEGIATAN
                            </div>
                            <div className="text-3xl font-black text-slate-900 mt-2">
                                {totalPhotos}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-slate-500">
                                Terverifikasi oleh Pembimbing Siswa
                            </span>
                            
                            {/* Avatar Pile */}
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                    <i className="bi bi-camera-fill text-[10px]"></i>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                    <i className="bi bi-image text-[10px]"></i>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-black">
                                    +139
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
