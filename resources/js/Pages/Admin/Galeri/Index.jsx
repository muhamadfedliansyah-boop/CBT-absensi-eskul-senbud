import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GaleriIndex({ schedules }) {
    const items = schedules?.data || schedules || [];
    const [search, setSearch] = useState('');

    const filtered = items.filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (s.eskul?.name || '').toLowerCase().includes(q) ||
            (s.material_text || '').toLowerCase().includes(q) ||
            (s.location || '').toLowerCase().includes(q)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Galeri Foto Kegiatan - SIBAS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <i className="bi bi-images text-sky-600"></i>
                            Galeri Foto Kegiatan
                        </h2>
                        <p className="text-xs text-slate-500">Dokumentasi visual kegiatan eskul & senbud. Klik card untuk melihat rekap absensi.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari eskul / materi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-64"
                        />
                        <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>
                </div>

                {/* Card Grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center">
                        <i className="bi bi-camera text-4xl text-slate-300"></i>
                        <p className="text-sm font-bold text-slate-400 mt-3">Belum ada foto kegiatan yang diunggah.</p>
                        <p className="text-xs text-slate-400 mt-1">Instruktur dapat mengunggah foto melalui halaman Materi & Dokumentasi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((schedule, idx) => {
                            const summary = schedule.attendance_summary || { total: 0, hadir: 0, tidak_hadir: 0, percentage: 0 };
                            const pctColor = summary.percentage >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                : summary.percentage >= 75 ? 'text-amber-600 bg-amber-50 border-amber-200'
                                : 'text-rose-600 bg-rose-50 border-rose-200';

                            return (
                                <Link
                                    key={idx}
                                    href={`/admin/galeri/${schedule.id}`}
                                    className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Photo */}
                                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                                        <img
                                            src={schedule.photo_url}
                                            alt={schedule.eskul?.name || 'Kegiatan'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 absolute inset-0">
                                            <i className="bi bi-camera text-3xl text-slate-300"></i>
                                        </div>
                                        {/* Type Badge */}
                                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-sky-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                            {schedule.eskul?.type || 'ESKUL'}
                                        </span>
                                        {/* Attendance Badge */}
                                        <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${pctColor}`}>
                                            {summary.percentage}% Hadir
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-2.5">
                                        <h3 className="font-black text-sm text-slate-900 leading-tight group-hover:text-sky-700 transition-colors">
                                            {schedule.eskul?.name || 'Kegiatan Eskul'}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                                            {schedule.material_text || 'Dokumentasi kegiatan'}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-3 pt-1">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                <i className="bi bi-person-check-fill"></i>
                                                <span>{summary.hadir} Hadir</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
                                                <i className="bi bi-person-x-fill"></i>
                                                <span>{summary.tidak_hadir} Absen</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                                                <i className="bi bi-calendar3"></i>
                                                <span>{schedule.activity_date ? new Date(schedule.activity_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                                                <i className="bi bi-geo-alt-fill"></i>
                                                <span className="truncate max-w-[120px]">{schedule.location || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {schedules?.links && schedules.links.length > 3 && (
                    <div className="flex items-center justify-end gap-1.5 pt-4">
                        {schedules.links.map((link, idx) => (
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
        </AuthenticatedLayout>
    );
}
