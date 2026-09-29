import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    eskulsList = [],
    globalAvg = 91,
    totalStudents = 0,
    totalEskuls = 0,
    meetingsProgress = '5 / 9 Pertemuan Selesai',
    topEskul = 'Pramuka Ambalan',
    weeklyTrend = [],
    upcomingSchedules = [],
    auth = {},
}) {
    const [activeTab, setActiveTab] = useState('jadwal'); // 'jadwal' | 'rekap' | 'ruangan'
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // DataTable Controls
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

    // Modal States
    const [isNisModalOpen, setIsNisModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedEskulDetail, setSelectedEskulDetail] = useState(null);

    // NIS Checker State
    const [nisInput, setNisInput] = useState('');
    const [nisLoading, setNisLoading] = useState(false);
    const [nisResult, setNisResult] = useState(null);
    const [nisError, setNisError] = useState('');

    const categories = ['Semua', 'Pramuka', 'Seni Budaya', 'Olahraga', 'Sains & IT', 'Bahasa'];

    // Sort Handler
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Filter and Sort Eskul Records
    const filteredAndSortedEskuls = useMemo(() => {
        let result = eskulsList.filter((item) => {
            const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(q) ||
                (item.instruktur && item.instruktur.name.toLowerCase().includes(q)) ||
                (item.day && item.day.toLowerCase().includes(q)) ||
                (item.location && item.location.name.toLowerCase().includes(q)) ||
                (item.category && item.category.toLowerCase().includes(q));
            return matchesCat && matchesSearch;
        });

        // Sorting
        result.sort((a, b) => {
            let valA = a[sortColumn] || '';
            let valB = b[sortColumn] || '';

            if (sortColumn === 'instruktur') {
                valA = a.instruktur?.name || '';
                valB = b.instruktur?.name || '';
            } else if (sortColumn === 'students') {
                valA = a.students?.length || a.total_students || 0;
                valB = b.students?.length || b.total_students || 0;
            }

            if (typeof valA === 'string') {
                const cmp = valA.localeCompare(valB);
                return sortDirection === 'asc' ? cmp : -cmp;
            } else {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
        });

        return result;
    }, [eskulsList, selectedCategory, searchQuery, sortColumn, sortDirection]);

    // Pagination calculations
    const totalEntries = filteredAndSortedEskuls.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginatedEskuls = filteredAndSortedEskuls.slice(startIndex, startIndex + entriesPerPage);

    // Handle NIS Attendance Lookup
    const handleCekPresensi = async (e) => {
        if (e) e.preventDefault();
        if (!nisInput.trim()) return;

        setNisLoading(true);
        setNisError('');
        setNisResult(null);

        try {
            const res = await fetch(`/api/cek-presensi?nis=${encodeURIComponent(nisInput.trim())}`);
            const data = await res.json();
            if (res.ok && data.status === 'success') {
                setNisResult(data.data);
            } else {
                setNisError(data.message || 'Data siswa dengan NIS tersebut tidak ditemukan.');
            }
        } catch (err) {
            setNisError('Gagal menghubungi server. Silakan coba kembali.');
        } finally {
            setNisLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased flex flex-col">
            <Head title="SIBAS - Portal Informasi & Jadwal Eskul Senbud" />

            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo SIBAS */}
                        <Link href="/" className="flex items-center gap-3.5 group">
                            <div className="w-11 h-11 bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-black text-lg group-hover:scale-105 transition-transform">
                                SB
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                                        SIBAS
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                                        DataTable View
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500">Seni Budaya & Eskul</p>
                            </div>
                        </Link>

                        {/* Navigation Tabs in Center */}
                        <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
                            <button
                                onClick={() => setActiveTab('jadwal')}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'jadwal'
                                        ? 'bg-[#005288] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                            >
                                <i className="bi bi-table mr-2"></i>
                                Tabel Jadwal Eskul
                            </button>
                            <button
                                onClick={() => setActiveTab('rekap')}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'rekap'
                                        ? 'bg-[#005288] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                            >
                                <i className="bi bi-graph-up mr-2"></i>
                                Cek Presensi
                            </button>
                            <button
                                onClick={() => setIsRoomModalOpen(true)}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all"
                            >
                                <i className="bi bi-door-open mr-2"></i>
                                Info Ruangan
                            </button>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsNisModalOpen(true)}
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-2xs"
                            >
                                <i className="bi bi-person-badge"></i>
                                Cari NIS Siswa
                            </button>

                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#005288] hover:bg-[#00406c] rounded-xl transition-all shadow-md shadow-sky-900/15"
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    Dashboard ({auth.user.name.split(' ')[0]})
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#005288] hover:bg-[#00406c] rounded-xl transition-all shadow-md shadow-sky-900/15"
                                >
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    Login Petugas
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO STATS */}
            <section className="bg-gradient-to-b from-sky-50/50 via-white to-slate-50 pt-8 pb-6 border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Jadwal Terpadu Semester Genap 2024/2025
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Jadwal Ekstrakurikuler & Seni Budaya
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl">
                                Data tabel resmi seluruh kegiatan eskul, nama pembina/instruktur, waktu latihan, dan alokasi ruangan sekolah.
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                            >
                                <i className="bi bi-printer-fill text-slate-500"></i>
                                <span>Cetak Tabel</span>
                            </button>
                            <button
                                onClick={() => setIsNisModalOpen(true)}
                                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <i className="bi bi-search"></i>
                                <span>Cek Absensi Siswa</span>
                            </button>
                        </div>
                    </div>

                    {/* Compact KPI Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-palette-fill"></i>
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900 leading-none">{totalEskuls}</div>
                                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Cabang Kegiatan</div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900 leading-none">{totalStudents}</div>
                                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Peserta Didik</div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-pie-chart-fill"></i>
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900 leading-none">{globalAvg}%</div>
                                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Rata-rata Hadir</div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-calendar-check-fill"></i>
                            </div>
                            <div>
                                <div className="text-sm font-black text-slate-900 leading-none">Minggu ke-5</div>
                                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Sesi Aktif Saat Ini</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT: DATATABLE */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {activeTab === 'jadwal' && (
                    <div className="space-y-4">
                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-[#004e7c] text-white shadow-md shadow-sky-900/15'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* DATATABLE WRAPPER CARD */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
                            {/* DataTable Top Bar (Per Page & Search Box) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <span>Tampilkan</span>
                                    <select
                                        value={entriesPerPage}
                                        onChange={(e) => {
                                            setEntriesPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span>data per halaman</span>
                                </div>

                                <div className="relative w-full sm:w-80">
                                    <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Cari eskul, instruktur, hari, atau ruangan..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <i className="bi bi-x-circle-fill text-xs"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Responsive Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-y border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                            <th className="py-3.5 px-3 w-12 text-center">No</th>
                                            <th
                                                onClick={() => handleSort('name')}
                                                className="py-3.5 px-3 cursor-pointer select-none hover:text-sky-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>Nama Ekstrakurikuler</span>
                                                    <i className={`bi ${sortColumn === 'name' ? (sortDirection === 'asc' ? 'bi-arrow-up-short text-sky-600' : 'bi-arrow-down-short text-sky-600') : 'bi-arrow-down-up text-slate-300'}`}></i>
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('category')}
                                                className="py-3.5 px-3 cursor-pointer select-none hover:text-sky-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>Kategori</span>
                                                    <i className={`bi ${sortColumn === 'category' ? (sortDirection === 'asc' ? 'bi-arrow-up-short text-sky-600' : 'bi-arrow-down-short text-sky-600') : 'bi-arrow-down-up text-slate-300'}`}></i>
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('instruktur')}
                                                className="py-3.5 px-3 cursor-pointer select-none hover:text-sky-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>Instruktur / Pembina</span>
                                                    <i className={`bi ${sortColumn === 'instruktur' ? (sortDirection === 'asc' ? 'bi-arrow-up-short text-sky-600' : 'bi-arrow-down-short text-sky-600') : 'bi-arrow-down-up text-slate-300'}`}></i>
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('day')}
                                                className="py-3.5 px-3 cursor-pointer select-none hover:text-sky-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>Jadwal Latihan</span>
                                                    <i className={`bi ${sortColumn === 'day' ? (sortDirection === 'asc' ? 'bi-arrow-up-short text-sky-600' : 'bi-arrow-down-short text-sky-600') : 'bi-arrow-down-up text-slate-300'}`}></i>
                                                </div>
                                            </th>
                                            <th className="py-3.5 px-3">Lokasi / Ruangan</th>
                                            <th
                                                onClick={() => handleSort('students')}
                                                className="py-3.5 px-3 text-center cursor-pointer select-none hover:text-sky-700 transition-colors"
                                            >
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <span>Anggota</span>
                                                    <i className={`bi ${sortColumn === 'students' ? (sortDirection === 'asc' ? 'bi-arrow-up-short text-sky-600' : 'bi-arrow-down-short text-sky-600') : 'bi-arrow-down-up text-slate-300'}`}></i>
                                                </div>
                                            </th>
                                            <th className="py-3.5 px-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                        {paginatedEskuls.length > 0 ? (
                                            paginatedEskuls.map((eskul, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-sky-50/40 transition-colors group"
                                                >
                                                    <td className="py-4 px-3 text-center font-bold text-slate-400">
                                                        {startIndex + idx + 1}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <div className="font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">
                                                            {eskul.name}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                                            {eskul.subCategory || 'Reguler & Prestasi'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${
                                                                eskul.category === 'Pramuka'
                                                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                                    : eskul.category === 'Seni Budaya'
                                                                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                                                                    : eskul.category === 'Olahraga'
                                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                    : eskul.category === 'Sains & IT'
                                                                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                                                                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                                            }`}
                                                        >
                                                            {eskul.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs shrink-0">
                                                                {eskul.instruktur?.name ? eskul.instruktur.name.charAt(0) : 'G'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800">
                                                                    {eskul.instruktur?.name || 'Instruktur Belum Ditentukan'}
                                                                </div>
                                                                <div className="text-[10px] text-slate-400">
                                                                    {eskul.instrukturRole || 'Pembina Eskul'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <div className="font-bold text-slate-800">
                                                            <i className="bi bi-calendar-event text-sky-600 mr-1.5"></i>
                                                            {eskul.day || 'Sabtu'}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                                            {eskul.time || '15.00 - 17.00 WIB'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <div className="flex items-start gap-1.5">
                                                            <i className="bi bi-geo-alt-fill text-rose-500 mt-0.5 text-xs shrink-0"></i>
                                                            <div>
                                                                <div className="font-bold text-slate-800">
                                                                    {eskul.location?.name || 'Ruang Serbaguna'}
                                                                </div>
                                                                <div className="text-[10px] text-slate-400">
                                                                    {eskul.location?.sub || 'Area Kampus Sekolah'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3 text-center">
                                                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-extrabold rounded-xl text-xs">
                                                            {eskul.total_students || eskul.students?.length || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-3 text-right">
                                                        <button
                                                            onClick={() => setSelectedEskulDetail(eskul)}
                                                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ml-auto shadow-2xs"
                                                        >
                                                            <span>Detail</span>
                                                            <i className="bi bi-arrow-right text-[10px]"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center text-slate-400 space-y-2">
                                                    <i className="bi bi-folder-x text-3xl text-slate-300"></i>
                                                    <div className="text-sm font-bold text-slate-700">Tidak ada data jadwal yang sesuai</div>
                                                    <div className="text-xs text-slate-400">Silakan ubah filter kategori atau kata kunci pencarian.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* DataTable Bottom Pagination Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                <div>
                                    Menampilkan <span className="font-bold text-slate-800">{totalEntries > 0 ? startIndex + 1 : 0}</span> sampai{' '}
                                    <span className="font-bold text-slate-800">{Math.min(startIndex + entriesPerPage, totalEntries)}</span> dari{' '}
                                    <span className="font-bold text-slate-800">{totalEntries}</span> data eskul & senbud
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:pointer-events-none transition-all"
                                    >
                                        Sebelumnya
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                                                currentPage === page
                                                    ? 'bg-sky-600 text-white shadow-xs'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:pointer-events-none transition-all"
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'rekap' && (
                    <div className="space-y-6">
                        {/* Weekly Attendance Matrix (M1-M9) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">
                                        Tren Kehadiran Global (9 Minggu)
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Persentase rata-rata kehadiran siswa per pertemuan minggu 1 hingga minggu 9.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                                        Rata-rata: {globalAvg}%
                                    </span>
                                </div>
                            </div>

                            {/* Weekly Trend Bar Cards */}
                            <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
                                {weeklyTrend.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center justify-between h-44 hover:bg-sky-50/50 transition-colors"
                                    >
                                        <div className="text-xs font-black text-sky-700">{item.pct}%</div>
                                        <div className="w-full flex-1 flex items-end justify-center py-2">
                                            <div
                                                style={{ height: `${item.pct}%` }}
                                                className="w-5 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-lg transition-all duration-500 shadow-xs"
                                            ></div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-extrabold text-slate-800">{item.week}</div>
                                            <div className="text-[10px] text-slate-400 truncate max-w-[60px]">{item.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive NIS Search section */}
                        <div className="bg-gradient-to-br from-[#004e7c] to-[#002f4d] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <h3 className="text-2xl font-black">Cek Kehadiran Personal Siswa</h3>
                                <p className="text-xs text-sky-100 max-w-md">
                                    Ketik NIS Anda untuk melihat riwayat absensi mingguan, izin dispensasi, dan status keaktifan di eskul.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsNisModalOpen(true)}
                                className="px-8 py-3 bg-white text-[#004e7c] hover:bg-sky-50 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all shrink-0"
                            >
                                Buka Lembar Presensi Siswa
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL: NIS CHECKER */}
            {isNisModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                                    <i className="bi bi-person-check-fill"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Cek Presensi Siswa</h3>
                                    <p className="text-xs text-slate-500">Transparansi Kehadiran Eskul SIBAS</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsNisModalOpen(false)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleCekPresensi} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Masukkan NIS Siswa (contoh: 1230987)..."
                                value={nisInput}
                                onChange={(e) => setNisInput(e.target.value)}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                            <button
                                type="submit"
                                disabled={nisLoading}
                                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                            >
                                {nisLoading ? 'Mencari...' : 'Cari'}
                            </button>
                        </form>

                        {/* Error Notice */}
                        {nisError && (
                            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                                <i className="bi bi-exclamation-circle-fill text-rose-500"></i>
                                <span>{nisError}</span>
                            </div>
                        )}

                        {/* Result Display */}
                        {nisResult && (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{nisResult.student?.name}</h4>
                                        <p className="text-[11px] text-slate-500">
                                            NIS: {nisResult.student?.nis} • Rayon: {nisResult.student?.rayon?.name || '-'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-emerald-600">{nisResult.attendance_pct || 100}%</div>
                                        <div className="text-[10px] text-slate-400">Total Hadir</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-700">Cabang Eskul Terdaftar:</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {nisResult.student?.eskuls?.map((eskul, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-sky-800"
                                            >
                                                {eskul.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL: DETAIL ESKUL */}
            {selectedEskulDetail && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                    <i className="bi bi-info-circle-fill"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{selectedEskulDetail.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedEskulDetail.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEskulDetail(null)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Instruktur:</span>
                                <span className="font-bold text-slate-800">{selectedEskulDetail.instruktur?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Hari & Waktu:</span>
                                <span className="font-bold text-slate-800">{selectedEskulDetail.day} ({selectedEskulDetail.time})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Lokasi / Ruangan:</span>
                                <span className="font-bold text-slate-800">{selectedEskulDetail.location?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Total Anggota:</span>
                                <span className="font-bold text-slate-800">{selectedEskulDetail.total_students || selectedEskulDetail.students?.length || 0} Siswa</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedEskulDetail(null)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: INFO RUANGAN */}
            {isRoomModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                                    <i className="bi bi-building"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Jadwal Alokasi Ruangan</h3>
                                    <p className="text-xs text-slate-500">Ruangan & Sangga Eskul Terjadwal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRoomModalOpen(false)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {upcomingSchedules.length > 0 ? (
                                upcomingSchedules.map((sch, i) => (
                                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">{sch.eskul?.name}</div>
                                            <div className="text-[11px] text-slate-500">{sch.activity_date} • {sch.start_time} - {sch.end_time}</div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">
                                            {sch.room_number || 'Ruang Reguler'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-xs text-slate-500">
                                    Belum ada jadwal ruangan spesifik yang terdaftar.
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsRoomModalOpen(false)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                            SB
                        </div>
                        <span className="font-extrabold text-slate-800">SIBAS</span>
                        <span>• Sistem Informasi & Presensi Seni Budaya / Eskul</span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Presensi Cloud Digital • Ditenagai oleh React DataTable
                    </div>
                </div>
            </footer>
        </div>
    );
}
