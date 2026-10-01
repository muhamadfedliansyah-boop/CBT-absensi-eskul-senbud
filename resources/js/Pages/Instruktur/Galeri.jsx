import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GaleriInstruktur({
    myEskuls = [],
    selectedEskulId = null,
    photosList = [],
    pendingPhotos = [],
    totalPhotos = 0,
    totalPending = 0,
}) {
    const [filterEskul, setFilterEskul] = useState(selectedEskulId || '');
    const [previewImage, setPreviewImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterChange = (eskulId) => {
        setFilterEskul(eskulId);
        router.get(
            '/instruktur/galeri',
            eskulId ? { eskul_id: eskulId } : {},
            { preserveState: true, replace: true }
        );
    };

    const filteredPhotos = photosList.filter((sch) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            sch.eskul?.name?.toLowerCase().includes(q) ||
            sch.activity_date?.toLowerCase().includes(q) ||
            sch.location?.toLowerCase().includes(q) ||
            sch.material_text?.toLowerCase().includes(q)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Library & Galeri Foto Saya - SIBAS" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-purple-200 backdrop-blur-md">
                            <i className="bi bi-images"></i>
                            <span>Dokumentasi Visual Kegiatan Eskul & Seni Budaya</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Library Foto Dokumentasi
                        </h2>
                        <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-medium">
                            Kumpulan foto bukti fisik pelaksanaan kegiatan ekstrakurikuler yang telah Anda kirimkan untuk verifikasi kesiswaan dan kelengkapan SPJ.
                        </p>
                    </div>

                    {/* Stats Counter */}
                    <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-28">
                            <div className="text-2xl font-black">{totalPhotos}</div>
                            <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">
                                Foto Terkirim
                            </div>
                        </div>
                        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-28">
                            <div className="text-2xl font-black text-amber-300">{totalPending}</div>
                            <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">
                                Belum Ada Foto
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions Bar */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Eskul Select Pills */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => handleFilterChange('')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                !filterEskul
                                    ? 'bg-[#0077b6] text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Semua Cabang ({myEskuls.length})
                        </button>
                        {myEskuls.map((eskul) => (
                            <button
                                key={eskul.id}
                                type="button"
                                onClick={() => handleFilterChange(eskul.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                    String(filterEskul) === String(eskul.id)
                                        ? 'bg-[#0077b6] text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {eskul.name}
                            </button>
                        ))}
                    </div>

                    {/* Search query */}
                    <div className="relative w-full sm:w-64">
                        <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            placeholder="Cari materi / tanggal..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>
                </div>

                {/* Pending Photos Alert (if any) */}
                {pendingPhotos.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 shadow-xs">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shrink-0 mt-0.5">
                                <i className="bi bi-camera"></i>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                                        Perlu Tindakan: {pendingPhotos.length} Sesi Belum Mengunggah Foto Dokumentasi
                                    </h4>
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                                        Segera Lengkapi
                                    </span>
                                </div>
                                <p className="text-xs text-amber-900 font-medium">
                                    Unggah foto dokumentasi untuk sesi berikut agar rekapitulasi kehadiran dan pelaporan honorarium tidak tertunda.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                                    {pendingPhotos.slice(0, 6).map((sch) => (
                                        <div
                                            key={sch.id}
                                            className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs"
                                        >
                                            <div className="overflow-hidden pr-2">
                                                <div className="font-extrabold text-slate-800 truncate">
                                                    {sch.eskul?.name}
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    {sch.activity_date} • {sch.room_number || 'Reguler'}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/instruktur/jadwal/materi/${sch.id}`}
                                                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
                                            >
                                                <i className="bi bi-upload"></i>
                                                <span>Upload</span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photos Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-extrabold text-slate-900">
                            Foto Dokumentasi Terunggah ({filteredPhotos.length})
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                            Klik foto untuk memperbesar
                        </span>
                    </div>

                    {filteredPhotos.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center space-y-3">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                                <i className="bi bi-images"></i>
                            </div>
                            <h4 className="text-base font-black text-slate-900">Belum Ada Foto Dokumentasi</h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                {searchQuery
                                    ? 'Tidak ada foto yang cocok dengan pencarian Anda.'
                                    : 'Anda belum mengunggah foto dokumentasi untuk sesi pertemuan eskul yang Anda ajar. Unggah foto melalui menu Presensi atau Edit Materi.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filteredPhotos.map((sch) => {
                                const hadirCount = sch.attendances?.filter((a) => a.status === 'HADIR').length || 0;
                                const totalAtt = sch.attendances?.length || 0;

                                return (
                                    <div
                                        key={sch.id}
                                        className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                                            onClick={() => setPreviewImage(sch)}
                                        >
                                            <img
                                                src={sch.photo_url}
                                                alt={sch.eskul?.name || 'Dokumentasi Eskul'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                                                <span className="text-[11px] font-bold flex items-center gap-1">
                                                    <i className="bi bi-zoom-in"></i> Klik untuk Perbesar
                                                </span>
                                                <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                                                    {sch.activity_date}
                                                </span>
                                            </div>
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                                                    {sch.eskul?.type || 'ESKUL'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                                                    <span>{sch.activity_date}</span>
                                                    <span>{sch.location || sch.room_number || 'Reguler'}</span>
                                                </div>
                                                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 mt-0.5">
                                                    {sch.eskul?.name}
                                                </h4>
                                                {sch.material_text ? (
                                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                                        {sch.material_text}
                                                    </p>
                                                ) : (
                                                    <p className="text-[11px] text-slate-400 italic mt-1">
                                                        Materi belum dicantumkan
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                                                <div className="text-[11px] font-semibold text-slate-500">
                                                    Kehadiran: <strong className="text-emerald-700 font-bold">{hadirCount}</strong>/{totalAtt} Siswa
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={`/instruktur/jadwal/materi/${sch.id}`}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                                                        title="Ganti Foto / Materi"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                    <Link
                                                        href={`/instruktur/presensi/${sch.id}`}
                                                        className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-bold transition-colors"
                                                    >
                                                        Presensi
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 relative animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-sm sm:text-base">
                                    {previewImage.eskul?.name} • Pertemuan {previewImage.activity_date}
                                </h3>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Lokasi: {previewImage.location || previewImage.room_number || 'Kampus Utama'}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Modal Image */}
                        <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
                            <img
                                src={previewImage.photo_url}
                                alt={previewImage.eskul?.name}
                                className="max-h-[70vh] w-auto max-w-full object-contain"
                            />
                        </div>

                        {/* Modal Footer / Material Details */}
                        <div className="p-5 bg-white space-y-3">
                            <div>
                                <div className="text-[10px] font-bold uppercase text-slate-400">
                                    Ringkasan Materi & Topik
                                </div>
                                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                                    {previewImage.material_text || 'Tidak ada catatan materi pada pertemuan ini.'}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                <span className="text-slate-400 font-medium">
                                    Status: Terverifikasi di Sistem CBT SIBAS
                                </span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={previewImage.photo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="bi bi-box-arrow-up-right"></i>
                                        <span>Buka Ukuran Asli</span>
                                    </a>
                                    <Link
                                        href={`/instruktur/jadwal/materi/${previewImage.id}`}
                                        className="px-3.5 py-1.5 bg-[#0077b6] hover:bg-[#005b96] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                        <span>Edit / Ganti Foto</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
