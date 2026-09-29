import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PSLaporan({ rayons = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Laporan Rayon - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Laporan Rekapitulasi Rayon</h2>
                        <p className="text-xs text-slate-500">
                            Rekap keaktifan peserta didik per kelompok rayon bimbingan Anda.
                        </p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0"
                    >
                        <i className="bi bi-printer-fill"></i>
                        <span>Cetak Laporan</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {rayons.map((rayon, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Rayon: {rayon.name}</h3>
                                    <p className="text-xs text-slate-500">Total {rayon.students?.length || 0} Siswa</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                            <th className="pb-2">NIS</th>
                                            <th className="pb-2">Nama Siswa</th>
                                            <th className="pb-2">Cabang Eskul</th>
                                            <th className="pb-2">Total Presensi Terdata</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {rayon.students?.map((st, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="py-2.5 font-mono font-bold">{st.nis}</td>
                                                <td className="py-2.5 font-semibold text-slate-900">{st.name}</td>
                                                <td className="py-2.5">
                                                    <div className="flex flex-wrap gap-1">
                                                        {st.eskuls?.map((es, j) => (
                                                            <span key={j} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-bold">
                                                                {es.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 font-bold text-slate-800">
                                                    {st.attendances?.length || 0} Pertemuan
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
