import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PSDashboard({
    myRayons = [],
    totalStudents = 52,
    attendanceRate = 96.8,
    zeroAlpaCount = 48,
    actionNeededCount = 3,
}) {
    // Agenda checklist state
    const [checklist, setChecklist] = useState({
        task1: false,
        task2: false,
        task3: true,
    });

    const toggleChecklist = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Pembimbing Siswa - Rayon Cisarua 3" />

            <div className="space-y-6">

                {/* 1. BREADCRUMBS & PAGE HEADER */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span>Kesiswaan</span>
                        <i className="bi bi-chevron-right text-[10px]"></i>
                        <span>Pembimbing Siswa (PS)</span>
                        <i className="bi bi-chevron-right text-[10px]"></i>
                        <span className="text-slate-800 font-bold">Dashboard Ringkasan</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                                    Dashboard Pembimbing Siswa — Rayon Cisarua 3
                                </h1>
                                <span className="px-3 py-1 bg-sky-100/80 text-sky-800 text-[11px] font-extrabold rounded-full shrink-0">
                                    Semester Ganjil 24/25
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-4xl mt-1 font-medium leading-relaxed">
                                Pusat kendali dan monitoring terpadu kehadiran 52 siswa binaan Rayon Cisarua 3 pada seluruh kegiatan ekstrakurikuler dan seni budaya semester ganjil TA 2024/2025.
                            </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Link
                                href="/ps/dispensasi"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-900/15 active:scale-95"
                            >
                                <i className="bi bi-plus-lg font-black"></i>
                                <span>Ajukan Dispensasi Siswa</span>
                            </Link>

                            <button
                                onClick={() => alert('Mengunduh rekapitulasi presensi Rayon Cisarua 3 (.xlsx)...')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
                            >
                                <i className="bi bi-download"></i>
                                <span>Unduh Rekap (.xlsx)</span>
                            </button>

                            <button
                                onClick={() => alert('Membuka formulir broadcast pesan WhatsApp ke Orang Tua Rayon Cisarua 3.')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                                <i className="bi bi-whatsapp"></i>
                                <span>Broadcast Ortu</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. FOUR KPI STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Siswa Binaan */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                TOTAL SISWA BINAAN
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-people-fill"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {totalStudents} <span className="text-xs font-bold text-slate-400 font-sans">Siswa Aktif</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>100% Terdaftar Eskul/Senbud</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Rata-Rata Kehadiran Rayon */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                RATA-RATA KEHADIRAN RAYON
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none flex items-baseline gap-2">
                                <span>{attendanceRate}%</span>
                                <span className="text-xs font-bold text-emerald-600">+1.4% vs M6</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-400 mt-2">
                                Kategori: <strong className="text-emerald-700 font-bold">Sangat Baik</strong> • Target: ≥ 90%
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Siswa Nir-Alpa (Disiplin Penuh) */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                SISWA NIR-ALPA (DISIPLIN PENUH)
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-shield-check"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 leading-none">
                                {zeroAlpaCount} <span className="text-sm font-bold text-slate-400 font-sans">/ 52 Siswa</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-2">
                                <span>92.3% Disiplin Sempurna</span>
                                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-md font-bold text-[10px]">Zero Alpa</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Perlu Tindak Lanjut */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                PERLU TINDAK LANJUT
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-rose-600 leading-none">
                                {actionNeededCount} <span className="text-xs font-bold text-slate-400 font-sans">Kasus Alpa Terdata</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2">
                                <span>2 Baru • 1 Selesai</span>
                                <Link href="/ps/rayon" className="text-rose-600 hover:text-rose-800 underline">
                                    Buka Detail →
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. TWO COLUMNS LAYOUT: LEFT (60%) & RIGHT (40%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ========================================================= */}
                    {/* LEFT COLUMN: KASUS ALPA & TREN KEHADIRAN (7 Cols)         */}
                    {/* ========================================================= */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Card 1: Peringatan Cepat Kasus Alpa & Butuh Bimbingan */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-5 bg-rose-500 rounded-full"></div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        Peringatan Cepat Kasus Alpa & Butuh Bimbingan
                                    </h3>
                                </div>
                                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-extrabold">
                                    2 Menunggu Verifikasi
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium -mt-2">
                                Siswa rayon yang tercatat absen tanpa keterangan pada Sesi Pekan ke-7
                            </p>

                            {/* Cases List */}
                            <div className="space-y-3.5 pt-1">
                                
                                {/* Case 1: Faris Pratama */}
                                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#005b96] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                FP
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-xs text-slate-900">Faris Pratama</span>
                                                    <span className="text-[10px] font-semibold text-slate-400">• XI PPLG 1</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mt-0.5">
                                                    Alpa Pekan 7
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => alert('Membuka sesi konseling untuk Faris Pratama...')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                            >
                                                <i className="bi bi-people-fill text-xs"></i>
                                                <span>Proses Konseling</span>
                                            </button>
                                            <button
                                                onClick={() => alert('Membuka chat WhatsApp orang tua Faris Pratama...')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition-all"
                                            >
                                                <i className="bi bi-whatsapp"></i>
                                                <span>Chat Ortu</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-slate-500 font-medium pl-13 border-t border-slate-200/50 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                            Eskul: <strong>Web & Software Dev</strong> (Sabtu, 26 Sep 2024)
                                        </div>
                                        <div className="text-rose-600 font-semibold">
                                            • Catatan: Kartu Tapping RFID Kosong
                                        </div>
                                    </div>
                                </div>

                                {/* Case 2: Bagas Satria */}
                                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                BS
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-xs text-slate-900">Bagas Satria</span>
                                                    <span className="text-[10px] font-semibold text-slate-400">• XTJKT 1</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mt-0.5">
                                                    Alpa Pekan 7
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => alert('Membuka sesi konseling untuk Bagas Satria...')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                            >
                                                <i className="bi bi-people-fill text-xs"></i>
                                                <span>Proses Konseling</span>
                                            </button>
                                            <button
                                                onClick={() => alert('Membuka chat WhatsApp orang tua Bagas Satria...')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition-all"
                                            >
                                                <i className="bi bi-whatsapp"></i>
                                                <span>Chat Ortu</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-slate-500 font-medium pl-13 border-t border-slate-200/50 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                            Eskul: <strong>Futsal Prestasi</strong> (Sabtu, 26 Sep 2024)
                                        </div>
                                        <div className="text-rose-600 font-semibold">
                                            • Catatan: Tidak hadir tanpa keterangan (Bangun Kesiangan)
                                        </div>
                                    </div>
                                </div>

                                {/* Case 3: Siti Nurhaliza (Verified) */}
                                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                SN
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-xs text-slate-900">Siti Nurhaliza</span>
                                                    <span className="text-[10px] font-semibold text-slate-400">• X DKV 1</span>
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                                                        Selesai Diverifikasi
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    Senbud: Seni Rupa & Ilustrasi • Dikonversikan <span className="text-amber-700 font-bold">Sakit Resmi</span> (Surat Terunggah)
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                                            <i className="bi bi-check-circle-fill"></i>
                                            <span>Sudah Tervalidasi</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Card 2: Tren Kehadiran Rayon (9 Pekan Berjalan) */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        Tren Kehadiran Rayon (9 Pekan Berjalan)
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Monitoring stabilitas partisipasi ekstrakurikuler & sangga pramuka
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-bold">
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#005b96]"></span> % Hadir</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Izin/Sakit</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Alpa</span>
                                </div>
                            </div>

                            {/* 9 Weeks Bar Chart Display */}
                            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100">
                                <div className="grid grid-cols-9 gap-2 items-end h-44 pb-2 border-b border-slate-200">
                                    {[
                                        { week: 'M1', rate: 98, color: 'bg-[#005b96]' },
                                        { week: 'M2', rate: 97, color: 'bg-[#005b96]' },
                                        { week: 'M3', rate: 95, color: 'bg-[#005b96]' },
                                        { week: 'M4', rate: 96, color: 'bg-[#005b96]' },
                                        { week: 'M5', rate: 99, color: 'bg-[#005b96]' },
                                        { week: 'M6', rate: 94, color: 'bg-[#005b96]' },
                                        { week: 'M7*', rate: 96.8, color: 'bg-emerald-600', active: true },
                                        { week: 'M8', rate: 0, pending: true },
                                        { week: 'M9', rate: 0, pending: true },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                                            {item.rate > 0 && (
                                                <span className="text-[10px] font-extrabold text-slate-700">
                                                    {item.rate}%
                                                </span>
                                            )}
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-300 ${
                                                    item.pending
                                                        ? 'h-2 bg-slate-200/60 border border-dashed border-slate-300'
                                                        : `${item.color} shadow-sm group-hover:opacity-90`
                                                }`}
                                                style={{ height: item.rate > 0 ? `${(item.rate / 100) * 110}px` : '8px' }}
                                            ></div>
                                            <span className={`text-[10px] font-extrabold ${item.active ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                {item.week}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* 4 Bottom Sub-Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Sesi Terlaksana</div>
                                        <div className="text-sm font-black text-slate-900 mt-0.5">7 dari 9 Pekan</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Kehadiran Kumulatif</div>
                                        <div className="text-sm font-black text-emerald-600 mt-0.5">352 Siswa-Sesi</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Total Izin / Disp.</div>
                                        <div className="text-sm font-black text-amber-600 mt-0.5">8 Berkas Sah</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Total Alpa Rayon</div>
                                        <div className="text-sm font-black text-rose-600 mt-0.5">4 Pelanggaran</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* ========================================================= */}
                    {/* RIGHT COLUMN: JADWAL ANAK RAYON & AGENDA PS (5 Cols)      */}
                    {/* ========================================================= */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Card 1: Jadwal Anak Rayon */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-calendar3-event-fill text-[#005b96]"></i>
                                    <h3 className="text-sm font-black text-slate-900">Jadwal Anak Rayon</h3>
                                </div>
                                <span className="px-3 py-1 bg-sky-100/70 text-sky-800 rounded-full text-[10px] font-extrabold">
                                    Sabtu, 26 Okt
                                </span>
                            </div>

                            {/* Schedule Items List */}
                            <div className="space-y-3">
                                
                                {/* Item 1: Futsal Prestasi */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-sky-300 transition-colors">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-[#005b96]">07.30 – 10.30 WIB</span>
                                        <span className="text-slate-500 font-bold">12 Siswa Rayon</span>
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">Futsal Prestasi</div>
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                                        <span><i className="bi bi-geo-alt"></i> Lapangan Utama</span>
                                        <span>Coach Bambang</span>
                                    </div>
                                </div>

                                {/* Item 2: Tari Tradisional Sunda */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-sky-300 transition-colors">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-[#005b96]">08.00 – 11.00 WIB</span>
                                        <span className="text-slate-500 font-bold">7 Siswa Rayon</span>
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">Tari Tradisional Sunda</div>
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                                        <span><i className="bi bi-geo-alt"></i> Sanggar Budaya 2</span>
                                        <span>Dra. Widyawati</span>
                                    </div>
                                </div>

                                {/* Item 3: Robotika & IoT */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-sky-300 transition-colors">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-[#005b96]">09.00 – 11.30 WIB</span>
                                        <span className="text-slate-500 font-bold">14 Siswa Rayon</span>
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">Robotika & Internet of Things</div>
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                                        <span><i className="bi bi-geo-alt"></i> Lab Komputer 3</span>
                                        <span>Pak Fajar</span>
                                    </div>
                                </div>

                                {/* Item 4: Gamelan & Karawitan */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-sky-300 transition-colors">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-[#005b96]">13.00 – 15.00 WIB</span>
                                        <span className="text-slate-500 font-bold">8 Siswa Rayon</span>
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">Gamelan & Karawitan</div>
                                    <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                                        <span><i className="bi bi-geo-alt"></i> Sanggar Karawitan</span>
                                        <span>Ki Danang</span>
                                    </div>
                                </div>

                                {/* Item 5: Pramuka Penegak (Wajib) */}
                                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-emerald-700">Jumat • 14.00 – 16.30 WIB</span>
                                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-black text-[10px]">52 Siswa (Wajib)</span>
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">Pramuka Penegak Gugus Depan</div>
                                    <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                                        <span><i className="bi bi-geo-alt"></i> Lapangan & Sangga 1–6</span>
                                        <span>Kak Ridwan</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Card 2: Agenda Tindakan PS */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-list-check text-emerald-600 text-lg"></i>
                                    <h3 className="text-sm font-black text-slate-900">Agenda Tindakan PS</h3>
                                </div>
                                <span className="text-xs font-bold text-slate-400">Pekan 7</span>
                            </div>

                            {/* Checklist Items */}
                            <div className="space-y-3 pt-1">
                                
                                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={checklist.task1}
                                        onChange={() => toggleChecklist('task1')}
                                        className="mt-0.5 w-4 h-4 rounded text-[#005b96] focus:ring-[#005b96]"
                                    />
                                    <div className="text-xs">
                                        <div className={`font-bold ${checklist.task1 ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                            Konseling 2 siswa alpa pekan 7
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Faris Pratama & Bagas Satria (Kamis, 13.00)
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={checklist.task2}
                                        onChange={() => toggleChecklist('task2')}
                                        className="mt-0.5 w-4 h-4 rounded text-[#005b96] focus:ring-[#005b96]"
                                    />
                                    <div className="text-xs">
                                        <div className={`font-bold ${checklist.task2 ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                            Validasi surat dispensasi lomba catur
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Arya Mahendra Putra (Tingkat Kota Bogor)
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={checklist.task3}
                                        onChange={() => toggleChecklist('task3')}
                                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                                    />
                                    <div className="text-xs">
                                        <div className={`font-bold ${checklist.task3 ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                            Tanda tangan berita acara presensi M6
                                        </div>
                                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                            Selesai diserahkan ke Bu Elvia Kesiswaan
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
