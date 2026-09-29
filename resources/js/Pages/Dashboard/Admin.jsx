import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard({
    totalStudents = 0,
    totalEskuls = 0,
    totalSchedules = 0,
    totalUsers = 0,
    recentAttendances = [],
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard - SIBAS" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="bg-gradient-to-r from-[#004e7c] to-[#006094] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold text-sky-200 backdrop-blur-xs">
                            <i className="bi bi-shield-check"></i> Panel Koordinator & Administrator
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Pusat Kendali Presensi SIBAS
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                            Kelola cabang ekstrakurikuler & seni budaya, master data peserta didik, alokasi ruang sangga, serta pantau transparansi kehadiran real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <Link
                            href="/admin/eskul"
                            className="px-4 py-2.5 bg-white text-[#004e7c] hover:bg-sky-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                            <i className="bi bi-plus-lg mr-1.5"></i> Tambah Eskul
                        </Link>
                        <Link
                            href="/admin/rekapitulasi"
                            className="px-4 py-2.5 bg-sky-500/30 hover:bg-sky-500/40 text-white border border-white/20 rounded-xl text-xs font-bold transition-all backdrop-blur-xs"
                        >
                            <i className="bi bi-bar-chart-line mr-1.5"></i> Laporan Global
                        </Link>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-2xl shrink-0">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 leading-none">{totalStudents}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-1">Total Peserta Didik</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-2xl shrink-0">
                            <i className="bi bi-palette-fill"></i>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 leading-none">{totalEskuls}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-1">Cabang Eskul & Senbud</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl shrink-0">
                            <i className="bi bi-calendar3-event-fill"></i>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 leading-none">{totalSchedules}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-1">Sesi Pertemuan</div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
                            <i className="bi bi-person-badge-fill"></i>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 leading-none">{totalUsers}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-1">Petugas & Guru</div>
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/students"
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
                                <i className="bi bi-person-lines-fill"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                                    Master Data Siswa
                                </h4>
                                <p className="text-[11px] text-slate-400">Pendaftaran & Rayonisasi</p>
                            </div>
                        </div>
                        <i className="bi bi-arrow-right text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1"></i>
                    </Link>

                    <Link
                        href="/admin/schedules"
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg">
                                <i className="bi bi-door-open-fill"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    Alokasi Ruang & Sangga
                                </h4>
                                <p className="text-[11px] text-slate-400">Jadwal & Ruang Kegiatan</p>
                            </div>
                        </div>
                        <i className="bi bi-arrow-right text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1"></i>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                                <i className="bi bi-person-check-fill"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                    Verifikasi Instruktur
                                </h4>
                                <p className="text-[11px] text-slate-400">Aktivasi Hak Akses Guru</p>
                            </div>
                        </div>
                        <i className="bi bi-arrow-right text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1"></i>
                    </Link>
                </div>

                {/* Recent Attendances Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Aktivitas Presensi Terakhir</h3>
                            <p className="text-xs text-slate-500">Log kehadiran terbaru yang direkam oleh instruktur / pembina.</p>
                        </div>
                        <Link
                            href="/admin/rekapitulasi"
                            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                        >
                            <span>Lihat Semua</span>
                            <i className="bi bi-chevron-right text-[10px]"></i>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Siswa</th>
                                    <th className="pb-3">Cabang Eskul</th>
                                    <th className="pb-3">Pertemuan</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {recentAttendances.length > 0 ? (
                                    recentAttendances.map((att, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 font-bold text-slate-900">
                                                {att.student?.name || 'Siswa'}
                                                <div className="text-[10px] text-slate-400 font-normal">NIS: {att.student?.nis}</div>
                                            </td>
                                            <td className="py-3">{att.schedule?.eskul?.name || '-'}</td>
                                            <td className="py-3">{att.schedule?.activity_date || '-'}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                                        att.status === 'HADIR'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : att.status === 'SAKIT'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : att.status === 'IZIN'
                                                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                                            : att.status === 'DISPEN'
                                                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    {att.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-500">{att.notes || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            Belum ada rekaman presensi terbaru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
