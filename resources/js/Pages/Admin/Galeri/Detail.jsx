import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GaleriDetail({ schedule, summary }) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const attendances = schedule?.attendances || [];

    // Filter
    let filtered = attendances.filter((att) => {
        if (filterStatus !== 'ALL' && att.status !== filterStatus) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (att.student?.name || '').toLowerCase().includes(q) ||
                (att.student?.nis || '').toLowerCase().includes(q) ||
                (att.student?.rayon?.name || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
        let valA, valB;
        if (sortBy === 'name') {
            valA = a.student?.name || '';
            valB = b.student?.name || '';
        } else if (sortBy === 'nis') {
            valA = a.student?.nis || '';
            valB = b.student?.nis || '';
        } else if (sortBy === 'status') {
            valA = a.status || '';
            valB = b.status || '';
        } else if (sortBy === 'rayon') {
            valA = a.student?.rayon?.name || '';
            valB = b.student?.rayon?.name || '';
        }
        const cmp = valA.localeCompare(valB);
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ field }) => (
        <i className={`bi ${sortBy === field ? (sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up'} text-[10px] ml-1 opacity-50`}></i>
    );

    const statusColors = {
        HADIR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        SAKIT: 'bg-amber-50 text-amber-700 border-amber-200',
        IZIN: 'bg-sky-50 text-sky-700 border-sky-200',
        ALPA: 'bg-rose-50 text-rose-700 border-rose-200',
        DISPEN: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Kegiatan - ${schedule?.eskul?.name || 'SIBAS'}`} />

            <div className="space-y-6">
                {/* Back Button */}
                <Link
                    href="/admin/galeri"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali ke Galeri
                </Link>

                {/* Header Card with Photo */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Photo */}
                        {schedule?.photo_url && (
                            <div className="md:w-2/5 h-56 md:h-auto bg-slate-100">
                                <img
                                    src={schedule.photo_url}
                                    alt={schedule.eskul?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 p-6 space-y-4">
                            <div>
                                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-[10px] font-bold uppercase">
                                    {schedule?.eskul?.type || 'ESKUL'}
                                </span>
                                <h2 className="text-xl font-black text-slate-900 mt-2">{schedule?.eskul?.name || '-'}</h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">{schedule?.material_text || '-'}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <i className="bi bi-calendar3 text-sky-500"></i>
                                    <span className="font-semibold">
                                        {schedule?.activity_date ? new Date(schedule.activity_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <i className="bi bi-clock text-sky-500"></i>
                                    <span className="font-semibold">
                                        {schedule?.start_time?.substring(0, 5)} - {schedule?.end_time?.substring(0, 5)} WIB
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <i className="bi bi-geo-alt-fill text-sky-500"></i>
                                    <span className="font-semibold">{schedule?.location || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <i className="bi bi-person-badge text-sky-500"></i>
                                    <span className="font-semibold">{schedule?.eskul?.instruktur?.name || '-'}</span>
                                </div>
                            </div>

                            {/* Attendance Summary Badges */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Hadir: {summary?.hadir || 0}
                                </span>
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    🤒 Sakit: {summary?.sakit || 0}
                                </span>
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                    📋 Izin: {summary?.izin || 0}
                                </span>
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    ✗ Alpa: {summary?.alpa || 0}
                                </span>
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    📝 Dispen: {summary?.dispen || 0}
                                </span>
                                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 text-white">
                                    {summary?.percentage || 0}% Kehadiran
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <input
                            type="text"
                            placeholder="Cari NIS / Nama / Rayon..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                        <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {['ALL', 'HADIR', 'SAKIT', 'IZIN', 'ALPA', 'DISPEN'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setFilterStatus(st)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                                    filterStatus === st
                                        ? 'bg-sky-600 text-white border-sky-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                                }`}
                            >
                                {st === 'ALL' ? 'Semua' : st}
                            </button>
                        ))}
                    </div>

                    <a
                        href={`/admin/export/attendance?schedule_id=${schedule?.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
                    >
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                        Export Excel
                    </a>
                </div>

                {/* Student Attendance Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">No</th>
                                    <th className="pb-3 cursor-pointer hover:text-slate-700" onClick={() => handleSort('nis')}>
                                        NIS <SortIcon field="nis" />
                                    </th>
                                    <th className="pb-3 cursor-pointer hover:text-slate-700" onClick={() => handleSort('name')}>
                                        Nama Siswa <SortIcon field="name" />
                                    </th>
                                    <th className="pb-3 cursor-pointer hover:text-slate-700" onClick={() => handleSort('rayon')}>
                                        Rayon <SortIcon field="rayon" />
                                    </th>
                                    <th className="pb-3 cursor-pointer hover:text-slate-700" onClick={() => handleSort('status')}>
                                        Status <SortIcon field="status" />
                                    </th>
                                    <th className="pb-3">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {filtered.map((att, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 text-slate-400 font-mono">{idx + 1}</td>
                                        <td className="py-3 font-mono font-bold text-slate-900">{att.student?.nis || '-'}</td>
                                        <td className="py-3 font-bold text-slate-800">{att.student?.name || '-'}</td>
                                        <td className="py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                                {att.student?.rayon?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusColors[att.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                {att.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-500">{att.notes || '-'}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-slate-400 font-semibold">
                                            <i className="bi bi-search text-lg block mb-2"></i>
                                            Tidak ada data yang sesuai filter.
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
