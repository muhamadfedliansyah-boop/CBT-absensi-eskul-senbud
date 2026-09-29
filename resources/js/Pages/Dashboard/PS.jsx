import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PSDashboard({ myRayons = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Pembimbing Siswa Dashboard - SIBAS" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="bg-gradient-to-r from-[#006094] to-[#0077b6] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold text-sky-200 backdrop-blur-xs">
                            <i className="bi bi-people-fill"></i> Panel Pembimbing Siswa (PS)
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Monitoring Rayon & Dispensasi
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                            Pantau tingkat kehadiran eskul anak bimbingan rayon Anda, terbitkan surat izin dispensasi, dan unduh laporan rekapitulasi.
                        </p>
                    </div>

                    <Link
                        href="/ps/dispensasi"
                        className="px-5 py-3 bg-white text-[#006094] hover:bg-sky-50 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                    >
                        <i className="bi bi-file-earmark-plus mr-1.5"></i> Buat Izin Dispensasi
                    </Link>
                </div>

                {/* Rayons List Cards */}
                <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900">Rayon Bimbingan Anda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myRayons.map((rayon, i) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-black text-slate-900">{rayon.name}</h4>
                                    <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold">
                                        {rayon.students?.length || 0} Siswa
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Pantau presensi gabungan dari seluruh cabang eskul yang diikuti siswa di rayon ini.
                                </p>
                                <div className="pt-2 border-t border-slate-100 flex gap-2">
                                    <Link
                                        href="/ps/rayon"
                                        className="flex-1 py-2 text-center bg-[#006094] hover:bg-[#004e7c] text-white rounded-xl text-xs font-bold transition-all"
                                    >
                                        Lihat Daftar Siswa
                                    </Link>
                                    <Link
                                        href="/ps/laporan"
                                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all"
                                    >
                                        Laporan
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
