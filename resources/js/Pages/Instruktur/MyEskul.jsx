import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyEskul({ myEskuls = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Ekstrakurikuler Saya - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Cabang Eskul & Seni Budaya Binaan</h2>
                        <p className="text-xs text-slate-500">
                            Kelola jadwal pertemuan, input absensi per sesi, pantau galeri foto dokumentasi, serta rekapitulasi kehadiran siswa.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/instruktur/galeri"
                            className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <i className="bi bi-images"></i>
                            <span>Buka Lib Foto</span>
                        </Link>
                        <Link
                            href="/instruktur/rekap"
                            className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                            <span>Rekap Nilai & Kehadiran</span>
                        </Link>
                    </div>
                </div>

                {myEskuls.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center space-y-3">
                        <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                            <i className="bi bi-award"></i>
                        </div>
                        <h3 className="text-base font-black text-slate-900">Belum Ada Eskul yang Ditugaskan</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Akun Anda belum ditetapkan oleh Administrator Kesiswaan untuk mengampu cabang eskul atau seni budaya. Silakan hubungi admin kesiswaan.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myEskuls.map((eskul, idx) => {
                            const studentCount = eskul.students?.length || 0;
                            const scheduleCount = eskul.schedules?.length || 0;

                            return (
                                <div key={idx} className="bg-white rounded-3xl p-6 border-t-4 border-t-[#0077b6] border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-[10px] font-extrabold uppercase">
                                                {eskul.type}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">
                                                {studentCount} Siswa Terdaftar
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">{eskul.name}</h3>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                Cabang Resmi • {scheduleCount} Pertemuan Terjadwal
                                            </p>
                                        </div>

                                        {/* Quick Links per Eskul */}
                                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                            <Link
                                                href={`/instruktur/rekap?eskul_id=${eskul.id}`}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                            >
                                                <i className="bi bi-file-earmark-spreadsheet"></i>
                                                <span>Rekap Kehadiran</span>
                                            </Link>
                                            <Link
                                                href={`/instruktur/galeri?eskul_id=${eskul.id}`}
                                                className="px-3 py-1.5 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                            >
                                                <i className="bi bi-images"></i>
                                                <span>Lib Foto</span>
                                            </Link>
                                            {eskul.type === 'PRAMUKA' && (
                                                <Link
                                                    href={`/instruktur/sangga/${eskul.id}`}
                                                    className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                                >
                                                    <i className="bi bi-diagram-3"></i>
                                                    <span>Sangga</span>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Schedules list */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                                <span>Daftar Sesi Pertemuan:</span>
                                                <span className="text-[11px] text-slate-400 font-normal">
                                                    {scheduleCount} Sesi
                                                </span>
                                            </div>
                                            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                                                {eskul.schedules && eskul.schedules.length > 0 ? (
                                                    eskul.schedules.map((sch, i) => (
                                                        <div
                                                            key={i}
                                                            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors"
                                                        >
                                                            <div className="overflow-hidden pr-2">
                                                                <div className="font-extrabold text-slate-800 flex items-center gap-2">
                                                                    <span>{sch.activity_date}</span>
                                                                    {sch.photo_url && (
                                                                        <span className="text-purple-600 text-[10px]" title="Foto terunggah">
                                                                            <i className="bi bi-image-fill"></i>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 truncate">
                                                                    {sch.start_time} - {sch.end_time} • {sch.room_number || sch.location || 'Ruang Reguler'}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <Link
                                                                    href={`/instruktur/presensi/${sch.id}`}
                                                                    className="px-3 py-1.5 bg-[#0077b6] hover:bg-[#005b96] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                                                >
                                                                    Absen
                                                                </Link>
                                                                <Link
                                                                    href={`/instruktur/jadwal/materi/${sch.id}`}
                                                                    className="p-1.5 bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-xs transition-all"
                                                                    title="Materi & Dokumentasi"
                                                                >
                                                                    <i className="bi bi-camera"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl">
                                                        Belum ada jadwal pertemuan yang dibuat oleh Admin.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
