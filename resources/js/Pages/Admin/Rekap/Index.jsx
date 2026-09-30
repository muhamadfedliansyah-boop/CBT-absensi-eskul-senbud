import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RekapIndex({
    eskuls = [],
    totalPresensi = 0,
    hadirCount = 0,
    globalAttendance = [],
}) {
    const rate = totalPresensi > 0 ? Math.round((hadirCount / totalPresensi) * 100) : 100;

    return (
        <AuthenticatedLayout>
            <Head title="Rekapitulasi Presensi - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Rekapitulasi Kehadiran & Laporan Global</h2>
                        <p className="text-xs text-slate-500">Statistik transparansi absensi eskul semester genap.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/admin/export/attendance"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                            <span>Export ke Excel</span>
                        </a>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-printer-fill"></i>
                            <span>Cetak Laporan</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-2xl font-black text-slate-900">{totalPresensi}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Total Record Presensi</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-2xl font-black text-emerald-600">{hadirCount}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Total Kehadiran Hadir</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-2xl font-black text-sky-700">{rate}%</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Rata-rata Tingkat Kehadiran</div>
                    </div>
                </div>

                {/* Per-Eskul Attendance Summary */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Ringkasan per Cabang Ekstrakurikuler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eskuls.map((eskul, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-sm text-slate-900">{eskul.name}</h4>
                                    <span className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold">
                                        {eskul.type}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Instruktur: {eskul.instruktur?.name || '-'}</span>
                                    <span className="font-bold">{eskul.students_count ?? eskul.students?.length ?? 0} Peserta</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
