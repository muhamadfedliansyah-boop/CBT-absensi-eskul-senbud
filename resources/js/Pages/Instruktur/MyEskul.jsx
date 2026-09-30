import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyEskul({ myEskuls = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Eskul Saya - SIBAS" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Cabang Eskul & Bimbingan Saya</h2>
                    <p className="text-xs text-slate-500">Pilih pertemuan untuk mulai input data absensi dan kelola sangga / materi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myEskuls.map((eskul, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-[10px] font-extrabold uppercase">
                                    {eskul.type}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    {eskul.students?.length || 0} Siswa Terdaftar
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-slate-900">{eskul.name}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Sesi Pertemuan Semester Genap</p>
                            </div>

                            {/* Schedules list */}
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-700">Daftar Pertemuan:</div>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                    {eskul.schedules && eskul.schedules.length > 0 ? (
                                        eskul.schedules.map((sch, i) => (
                                            <div
                                                key={i}
                                                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                                            >
                                                <div>
                                                    <div className="font-bold text-slate-800">{sch.activity_date}</div>
                                                    <div className="text-[11px] text-slate-500">{sch.start_time} - {sch.end_time} • {sch.room_number || 'Ruang Standar'}</div>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <Link
                                                        href={`/instruktur/presensi/${sch.id}`}
                                                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                                    >
                                                        Input Absen
                                                    </Link>
                                                    <Link
                                                        href={`/instruktur/jadwal/materi/${sch.id}`}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-all"
                                                        title="Materi & Dokumentasi"
                                                    >
                                                        <i className="bi bi-file-earmark-text"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 py-3 text-center">
                                            Belum ada sesi jadwal yang dibuat admin.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
