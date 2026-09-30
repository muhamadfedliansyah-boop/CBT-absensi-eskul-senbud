import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClashIndex({ clashes = [], totalClashes = 0, uniqueStudents = 0 }) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortDir, setSortDir] = useState('asc');

    // Filter
    let filtered = clashes.filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            c.student_name.toLowerCase().includes(q) ||
            c.student_nis.toLowerCase().includes(q) ||
            c.rayon.toLowerCase().includes(q) ||
            c.date.toLowerCase().includes(q) ||
            c.conflicting_eskuls.some((e) => e.eskul_name.toLowerCase().includes(q))
        );
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
        let valA, valB;
        if (sortBy === 'date') {
            valA = a.raw_date;
            valB = b.raw_date;
        } else if (sortBy === 'name') {
            valA = a.student_name;
            valB = b.student_name;
        } else if (sortBy === 'nis') {
            valA = a.student_nis;
            valB = b.student_nis;
        }
        const cmp = (valA || '').localeCompare(valB || '');
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

    return (
        <AuthenticatedLayout>
            <Head title="Deteksi Jadwal Bentrok - SIBAS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill text-amber-500"></i>
                            Deteksi Jadwal Bentrok
                        </h2>
                        <p className="text-xs text-slate-500">Siswa yang mengikuti lebih dari satu eskul/senbud dengan jadwal pada tanggal yang sama.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari NIS / Nama / Eskul..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-64"
                        />
                        <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>
                </div>

                {/* Summary Banner */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    totalClashes > 0
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-emerald-50 border-emerald-200'
                }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        totalClashes > 0
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-emerald-100 text-emerald-600'
                    }`}>
                        <i className={`bi ${totalClashes > 0 ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} text-lg`}></i>
                    </div>
                    <div>
                        <div className="text-xs font-black text-slate-900">
                            {totalClashes > 0
                                ? `Ditemukan ${totalClashes} bentrokan jadwal pada ${uniqueStudents} siswa`
                                : 'Tidak ada bentrokan jadwal terdeteksi!'
                            }
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                            {totalClashes > 0
                                ? 'Siswa-siswa berikut terdaftar pada lebih dari satu eskul/senbud yang jadwalnya bertabrakan.'
                                : 'Semua siswa memiliki jadwal yang tidak saling tumpang tindih.'
                            }
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filtered.length > 0 && (
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
                                        <th className="pb-3">Rayon</th>
                                        <th className="pb-3 cursor-pointer hover:text-slate-700" onClick={() => handleSort('date')}>
                                            Tanggal Bentrok <SortIcon field="date" />
                                        </th>
                                        <th className="pb-3">Eskul yang Bentrok</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {filtered.map((clash, idx) => (
                                        <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                                            <td className="py-3 text-slate-400 font-mono">{idx + 1}</td>
                                            <td className="py-3 font-mono font-bold text-slate-900">{clash.student_nis}</td>
                                            <td className="py-3 font-bold text-slate-800">{clash.student_name}</td>
                                            <td className="py-3">
                                                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                                    {clash.rayon}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                                                    <i className="bi bi-calendar-x mr-1"></i>
                                                    {clash.date}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex flex-col gap-1">
                                                    {clash.conflicting_eskuls.map((es, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold">
                                                                {es.eskul_name}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {es.time} • {es.location}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
