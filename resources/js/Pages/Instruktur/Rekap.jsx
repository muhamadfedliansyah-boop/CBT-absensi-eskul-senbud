import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RekapInstruktur({
    myEskuls = [],
    activeEskul = null,
    schedules = [],
    rekapData = [],
    summaryStats = {
        total_students: 0,
        total_sessions: 0,
        total_presensi: 0,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpa: 0,
        dispen: 0,
        attendance_percentage: 0,
    },
}) {
    const [selectedEskulId, setSelectedEskulId] = useState(activeEskul?.id || '');
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'matrix' | 'sessions'
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

    const handleEskulChange = (eskulId) => {
        setSelectedEskulId(eskulId);
        router.get(
            '/instruktur/rekap',
            { eskul_id: eskulId },
            { preserveState: true, replace: true }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    // Filter students
    const filteredRekap = rekapData.filter((row) => {
        const matchesQuery =
            !searchQuery ||
            row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.rayon.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;

        if (filterCategory === 'high') return row.percentage >= 85;
        if (filterCategory === 'medium') return row.percentage >= 70 && row.percentage < 85;
        if (filterCategory === 'low') return row.percentage < 70;

        return true;
    });

    const getBadgeCategory = (pct) => {
        if (pct >= 85) return { label: 'Sangat Baik', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        if (pct >= 70) return { label: 'Baik', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
        if (pct >= 50) return { label: 'Cukup', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
        return { label: 'Kurang / Perlu Bimbingan', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'HADIR': return 'bg-emerald-500 text-white';
            case 'SAKIT': return 'bg-sky-500 text-white';
            case 'IZIN': return 'bg-amber-500 text-white';
            case 'ALPA': return 'bg-rose-500 text-white';
            case 'DISPEN': return 'bg-purple-500 text-white';
            default: return 'bg-slate-200 text-slate-400';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Rekap Kehadiran - ${activeEskul?.name || 'Instruktur'}`} />

            <div className="space-y-6">
                
                {/* 1. Header Banner & Quick Actions */}
                <div className="bg-gradient-to-r from-[#005b96] via-[#006ca7] to-[#004e7c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-sky-100 backdrop-blur-md">
                            <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                            <span>Rekapitulasi Presensi & Evaluasi Keaktifan</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Rekap & Persentase Kehadiran Siswa
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                            Laporan rekam jejak absensi murid khusus pada cabang ekstrakurikuler & seni budaya yang Anda ampu, dilengkapi perhitungan persentase kehadiran otomatis.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-sky-950/20"
                        >
                            <i className="bi bi-printer-fill text-sky-700"></i>
                            <span>Cetak Laporan / PDF</span>
                        </button>
                    </div>
                </div>

                {/* Printable Header (Visible only on print) */}
                <div className="hidden print:block text-center space-y-1 pb-4 border-b border-slate-300">
                    <h1 className="text-xl font-bold text-slate-900">REKAPITULASI PRESENSI EKSTRAKURIKULER & SENI BUDAYA</h1>
                    <h2 className="text-base font-bold text-slate-700">{activeEskul?.name} ({activeEskul?.type})</h2>
                    <p className="text-xs text-slate-500">
                        Tahun Ajaran 2024/2025 • Total Siswa: {summaryStats.total_students} • Total Sesi: {summaryStats.total_sessions}
                    </p>
                </div>

                {/* 2. Eskul Selector & Filter Bar */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                    {/* Eskul Pills */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400 mr-1">Pilih Cabang:</span>
                        {myEskuls.map((eskul) => (
                            <button
                                key={eskul.id}
                                type="button"
                                onClick={() => handleEskulChange(eskul.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                                    String(selectedEskulId) === String(eskul.id)
                                        ? 'bg-[#0077b6] text-white shadow-md shadow-sky-900/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <i className={eskul.type === 'SENBUD' ? 'bi bi-palette' : 'bi bi-award'}></i>
                                <span>{eskul.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* View Tabs */}
                    <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('summary')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'summary'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <i className="bi bi-people-fill"></i>
                            <span>Rekap Siswa</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('matrix')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'matrix'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <i className="bi bi-grid-3x3"></i>
                            <span>Matriks Pertemuan</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('sessions')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'sessions'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <i className="bi bi-calendar-event"></i>
                            <span>Daftar Sesi</span>
                        </button>
                    </div>
                </div>

                {/* 3. Overall Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                    {/* Card 1: Rata Rata Kehadiran */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Rata-Rata Kehadiran
                        </div>
                        <div className="text-2xl font-black text-emerald-600 mt-1 flex items-baseline gap-1.5">
                            <span>{summaryStats.attendance_percentage}%</span>
                            <span className="text-[11px] font-semibold text-slate-400">Hadir</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(100, summaryStats.attendance_percentage)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Card 2: Total Siswa */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Total Murid
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1">
                            {summaryStats.total_students} <span className="text-xs font-semibold text-slate-400">Siswa</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                            {summaryStats.total_sessions} Sesi Pertemuan
                        </div>
                    </div>

                    {/* Card 3: Hadir Count */}
                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/70 shadow-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                            Hadir (H)
                        </div>
                        <div className="text-2xl font-black text-emerald-800 mt-1">
                            {summaryStats.hadir}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                            {summaryStats.total_presensi > 0 ? Math.round((summaryStats.hadir / summaryStats.total_presensi) * 100) : 0}% dari presensi
                        </div>
                    </div>

                    {/* Card 4: Sakit Count */}
                    <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200/70 shadow-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                            Sakit (S)
                        </div>
                        <div className="text-2xl font-black text-sky-800 mt-1">
                            {summaryStats.sakit}
                        </div>
                        <div className="text-[11px] font-semibold text-sky-600 mt-1">
                            Surat Dokter
                        </div>
                    </div>

                    {/* Card 5: Izin / Dispen */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 shadow-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                            Izin / Dispen
                        </div>
                        <div className="text-2xl font-black text-amber-800 mt-1">
                            {summaryStats.izin + summaryStats.dispen}
                        </div>
                        <div className="text-[11px] font-semibold text-amber-600 mt-1">
                            I: {summaryStats.izin} • D: {summaryStats.dispen}
                        </div>
                    </div>

                    {/* Card 6: Alpa Count */}
                    <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/70 shadow-xs">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
                            Tanpa Ket (A)
                        </div>
                        <div className="text-2xl font-black text-rose-800 mt-1">
                            {summaryStats.alpa}
                        </div>
                        <div className="text-[11px] font-semibold text-rose-600 mt-1">
                            Perlu Tindak Lanjut
                        </div>
                    </div>
                </div>

                {/* 4. CONTENT TABS */}
                
                {/* TAB 1: SUMMARY PER STUDENT */}
                {activeTab === 'summary' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400">Filter Kehadiran:</span>
                                <button
                                    type="button"
                                    onClick={() => setFilterCategory('all')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                        filterCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Semua ({rekapData.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterCategory('high')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                        filterCategory === 'high' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                >
                                    ≥85% (Sangat Baik)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterCategory('medium')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                        filterCategory === 'medium' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                                    }`}
                                >
                                    70% - 84% (Baik)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterCategory('low')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                        filterCategory === 'low' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    }`}
                                >
                                    &lt;70% (Perhatian)
                                </button>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input
                                    type="text"
                                    placeholder="Cari siswa / NIS / rayon..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>
                        </div>

                        {/* Student Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 w-10">No</th>
                                        <th className="pb-3">NIS & Nama Siswa</th>
                                        <th className="pb-3">Rayon</th>
                                        <th className="pb-3 text-center w-12 text-emerald-700">H</th>
                                        <th className="pb-3 text-center w-12 text-sky-700">S</th>
                                        <th className="pb-3 text-center w-12 text-amber-700">I</th>
                                        <th className="pb-3 text-center w-12 text-rose-700">A</th>
                                        <th className="pb-3 text-center w-12 text-purple-700">D</th>
                                        <th className="pb-3 text-center">Persentase Kehadiran</th>
                                        <th className="pb-3 text-center">Kategori Evaluasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {filteredRekap.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="py-8 text-center text-slate-400">
                                                Tidak ada data siswa yang sesuai filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRekap.map((row, idx) => {
                                            const badge = getBadgeCategory(row.percentage);
                                            return (
                                                <tr key={row.student_id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3 font-bold text-slate-400">{idx + 1}</td>
                                                    <td className="py-3">
                                                        <div className="font-extrabold text-slate-900">{row.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono">NIS: {row.nis}</div>
                                                    </td>
                                                    <td className="py-3 text-slate-600 font-medium">{row.rayon}</td>
                                                    <td className="py-3 text-center font-bold text-emerald-700 bg-emerald-50/40 rounded-lg">{row.hadir}</td>
                                                    <td className="py-3 text-center font-bold text-sky-700 bg-sky-50/40 rounded-lg">{row.sakit}</td>
                                                    <td className="py-3 text-center font-bold text-amber-700 bg-amber-50/40 rounded-lg">{row.izin}</td>
                                                    <td className="py-3 text-center font-bold text-rose-700 bg-rose-50/40 rounded-lg">{row.alpa}</td>
                                                    <td className="py-3 text-center font-bold text-purple-700 bg-purple-50/40 rounded-lg">{row.dispen}</td>
                                                    <td className="py-3 text-center">
                                                        <div className="inline-flex items-center gap-2">
                                                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                                                                <div
                                                                    className={`h-2 rounded-full ${
                                                                        row.percentage >= 85
                                                                            ? 'bg-emerald-500'
                                                                            : row.percentage >= 70
                                                                            ? 'bg-sky-500'
                                                                            : row.percentage >= 50
                                                                            ? 'bg-amber-500'
                                                                            : 'bg-rose-500'
                                                                    }`}
                                                                    style={{ width: `${Math.min(100, row.percentage)}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-black text-slate-900 font-mono">
                                                                {row.percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border ${badge.bg}`}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: MATRIX ATTENDANCE PER MEETING */}
                {activeTab === 'matrix' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900">
                                    Matriks Presensi per Pertemuan ({schedules.length} Sesi)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Keterangan: H (Hadir), S (Sakit), I (Izin), A (Alpa), D (Dispensasi)
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded">H = Hadir</span>
                                <span className="px-2 py-0.5 bg-sky-500 text-white rounded">S = Sakit</span>
                                <span className="px-2 py-0.5 bg-amber-500 text-white rounded">I = Izin</span>
                                <span className="px-2 py-0.5 bg-rose-500 text-white rounded">A = Alpa</span>
                                <span className="px-2 py-0.5 bg-purple-500 text-white rounded">D = Dispen</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 w-8 sticky left-0 bg-white">No</th>
                                        <th className="pb-3 min-w-44 sticky left-8 bg-white">Siswa</th>
                                        <th className="pb-3 min-w-24">Rayon</th>
                                        {schedules.map((sch, i) => (
                                            <th key={sch.id} className="pb-3 text-center min-w-16 px-1">
                                                <div className="font-mono text-slate-700">P-{i + 1}</div>
                                                <div className="text-[9px] text-slate-400 font-normal">{sch.activity_date?.slice(5)}</div>
                                            </th>
                                        ))}
                                        <th className="pb-3 text-center min-w-20">% Hadir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {rekapData.map((row, idx) => (
                                        <tr key={row.student_id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-2.5 font-bold text-slate-400 sticky left-0 bg-white">{idx + 1}</td>
                                            <td className="py-2.5 font-extrabold text-slate-900 sticky left-8 bg-white truncate">
                                                {row.name}
                                            </td>
                                            <td className="py-2.5 text-slate-500 text-[11px]">{row.rayon}</td>
                                            {schedules.map((sch) => {
                                                const st = row.session_statuses[sch.id] || '-';
                                                const initial = st !== '-' ? st[0] : '-';
                                                return (
                                                    <td key={sch.id} className="py-2.5 text-center px-1">
                                                        <span
                                                            className={`inline-block w-6 h-6 rounded-md text-[10px] font-black leading-6 text-center ${getStatusColor(
                                                                st
                                                            )}`}
                                                            title={`Pertemuan ${sch.activity_date}: ${st}`}
                                                        >
                                                            {initial}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                            <td className="py-2.5 text-center font-black text-slate-900 font-mono">
                                                {row.percentage}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: SESSIONS LIST */}
                {activeTab === 'sessions' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-slate-900">
                                Riwayat Sesi & Presensi Pertemuan
                            </h3>
                            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                                {schedules.length} Sesi Terjadwal
                            </span>
                        </div>

                        <div className="space-y-3">
                            {schedules.map((sch, i) => {
                                const hadir = sch.attendances?.filter((a) => a.status === 'HADIR').length || 0;
                                const sakit = sch.attendances?.filter((a) => a.status === 'SAKIT').length || 0;
                                const izin = sch.attendances?.filter((a) => a.status === 'IZIN').length || 0;
                                const alpa = sch.attendances?.filter((a) => a.status === 'ALPA').length || 0;
                                const dispen = sch.attendances?.filter((a) => a.status === 'DISPEN').length || 0;
                                const total = sch.attendances?.length || 0;
                                const pct = total > 0 ? Math.round((hadir / total) * 100) : 0;

                                return (
                                    <div
                                        key={sch.id}
                                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-12 h-12 rounded-xl bg-[#0077b6] text-white flex flex-col items-center justify-center font-black shrink-0 shadow-xs">
                                                <span className="text-[9px] uppercase opacity-75">Sesi</span>
                                                <span className="text-sm">{i + 1}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                                                    <span>{sch.activity_date}</span>
                                                    <span className="text-slate-400 font-normal">•</span>
                                                    <span className="text-slate-600 font-semibold text-xs">
                                                        {sch.start_time} - {sch.end_time} ({sch.location || sch.room_number || 'Ruang Standar'})
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                    {sch.material_text || 'Topik / materi belum dicantumkan'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 font-medium">
                                                    <span className="text-emerald-700 font-bold">Hadir: {hadir}</span> •
                                                    <span className="text-sky-700">Sakit: {sakit}</span> •
                                                    <span className="text-amber-700">Izin: {izin}</span> •
                                                    <span className="text-rose-700 font-bold">Alpa: {alpa}</span> •
                                                    <span className="text-purple-700">Dispen: {dispen}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                                            <div className="text-right">
                                                <div className="text-base font-black text-emerald-700 font-mono">
                                                    {pct}%
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                                                    Kehadiran Sesi
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Link
                                                    href={`/instruktur/presensi/${sch.id}`}
                                                    className="px-3 py-1.5 bg-[#0077b6] hover:bg-[#005b96] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                                                >
                                                    Presensi
                                                </Link>
                                                <Link
                                                    href={`/instruktur/jadwal/materi/${sch.id}`}
                                                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs transition-colors"
                                                    title="Materi & Foto"
                                                >
                                                    <i className="bi bi-file-earmark-image"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
