import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function InstrukturDashboard({ myEskuls = [], mySchedules = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Instruktur Dashboard - SIBAS" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="bg-gradient-to-r from-[#005b96] to-[#013a63] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold text-sky-200 backdrop-blur-xs">
                            <i className="bi bi-journal-bookmark-fill"></i> Panel Instruktur & Pembina Eskul
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Manajemen Presensi & Bimbingan
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                            Rekam kehadiran siswa per pertemuan, bagikan materi ringkasan, serta pantau keaktifan peserta didik di cabang eskul yang Anda ampu.
                        </p>
                    </div>

                    <Link
                        href="/instruktur/my-eskul"
                        className="px-5 py-3 bg-white text-[#005b96] hover:bg-sky-50 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                    >
                        <i className="bi bi-person-lines-fill mr-1.5"></i> Lembar Presensi Siswa
                    </Link>
                </div>

                {/* My Eskuls Cards */}
                <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900">Eskul yang Diampu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myEskuls.map((eskul, i) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-[10px] font-extrabold uppercase">
                                        {eskul.type}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                        {eskul.students?.length || 0} Siswa
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-slate-900">{eskul.name}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {eskul.schedules?.length || 0} Pertemuan Terjadwal
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex gap-2">
                                    <Link
                                        href="/instruktur/my-eskul"
                                        className="flex-1 py-2 text-center bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all"
                                    >
                                        Buka Input Absensi
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Schedules Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Jadwal Pertemuan Terdekat</h3>
                            <p className="text-xs text-slate-500">Pilih pertemuan untuk menginput lembar absensi kehadiran.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Tanggal Kegiatan</th>
                                    <th className="pb-3">Waktu</th>
                                    <th className="pb-3">Topik / Materi</th>
                                    <th className="pb-3">Ruangan</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {mySchedules.length > 0 ? (
                                    mySchedules.map((sch, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 font-bold text-slate-900">{sch.activity_date}</td>
                                            <td className="py-3">{sch.start_time || '15:00'} - {sch.end_time || '17:00'}</td>
                                            <td className="py-3 font-semibold">{sch.material_text || 'Materi Belum Diisi'}</td>
                                            <td className="py-3">{sch.room_number || 'Ruang Standar'}</td>
                                            <td className="py-3 text-right">
                                                <Link
                                                    href={`/instruktur/presensi/${sch.id}`}
                                                    className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold transition-all"
                                                >
                                                    Input Absen
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            Belum ada jadwal pertemuan yang dibuat.
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
