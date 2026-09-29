import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PSRayon({ students, rayons = [] }) {
    const studentList = students?.data || students || [];

    return (
        <AuthenticatedLayout>
            <Head title="Monitoring Rayon Siswa - SIBAS" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Monitoring Siswa Rayon Bimbingan</h2>
                    <p className="text-xs text-slate-500">
                        Pantau riwayat kehadiran eskul dan seni budaya bagi anak bimbingan rayon Anda.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">NIS</th>
                                    <th className="pb-3">Nama Siswa</th>
                                    <th className="pb-3">Rayon</th>
                                    <th className="pb-3">Cabang Eskul</th>
                                    <th className="pb-3">Total Record Absen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {studentList.map((st, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-mono font-bold text-slate-900">{st.nis}</td>
                                        <td className="py-3 font-bold text-slate-800">{st.name}</td>
                                        <td className="py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 rounded-md font-bold text-[10px] text-slate-700">
                                                {st.rayon?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {st.eskuls?.map((es, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-bold">
                                                        {es.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 font-semibold text-slate-600">
                                            {st.attendances?.length || 0} Pertemuan Terdata
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {students?.links && students.links.length > 3 && (
                        <div className="flex items-center justify-end gap-1.5 pt-4 border-t border-slate-100 mt-4">
                            {students.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-sky-600 text-white'
                                            : link.url
                                            ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                            : 'text-slate-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
