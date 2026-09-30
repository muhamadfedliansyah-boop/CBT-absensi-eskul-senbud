import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PresensiInput({ schedule, students = [], attendances = {} }) {
    // Initial attendance state map
    const initialAttendance = {};
    students.forEach((st) => {
        // JSON keys from PHP keyBy() are strings, so use String(st.id)
        const existing = attendances[String(st.id)] || attendances[st.id] || {};
        initialAttendance[st.id] = {
            status: existing.status || 'HADIR',
            notes: existing.notes || '',
        };
    });

    const { data, setData, post, processing } = useForm({
        attendance: initialAttendance,
    });

    const setAllStatus = (status) => {
        const next = { ...data.attendance };
        students.forEach((st) => {
            next[st.id] = {
                ...next[st.id],
                status: status,
            };
        });
        setData('attendance', next);
    };

    const handleStatusChange = (studentId, status) => {
        setData('attendance', {
            ...data.attendance,
            [studentId]: {
                ...data.attendance[studentId],
                status: status,
            },
        });
    };

    const handleNotesChange = (studentId, notes) => {
        setData('attendance', {
            ...data.attendance,
            [studentId]: {
                ...data.attendance[studentId],
                notes: notes,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/instruktur/presensi/${schedule.id}`);
    };

    const statusOptions = ['HADIR', 'SAKIT', 'IZIN', 'ALPA', 'DISPEN'];

    return (
        <AuthenticatedLayout>
            <Head title={`Input Presensi - ${schedule.eskul?.name}`} />

            <div className="space-y-6">
                {/* Header Information */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href="/instruktur/my-eskul" className="text-xs font-bold text-sky-600 hover:underline">
                                ← Kembali ke Daftar Eskul
                            </Link>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mt-1">
                            Lembar Presensi: {schedule.eskul?.name}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Tanggal: {schedule.activity_date} • Ruangan: {schedule.room_number || 'Reguler'} • {students.length} Siswa Terdaftar
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setAllStatus('HADIR')}
                            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
                        >
                            Set Semua Hadir
                        </button>
                    </div>
                </div>

                {/* Form Table */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 w-12">No</th>
                                        <th className="pb-3">NIS & Siswa</th>
                                        <th className="pb-3">Rayon</th>
                                        <th className="pb-3">Status Kehadiran</th>
                                        <th className="pb-3">Catatan / Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {students.map((st, idx) => {
                                        const cur = data.attendance[st.id] || { status: 'HADIR', notes: '' };
                                        return (
                                            <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 font-bold text-slate-400">{idx + 1}</td>
                                                <td className="py-3">
                                                    <div className="font-bold text-slate-900">{st.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">NIS: {st.nis}</div>
                                                </td>
                                                <td className="py-3 text-slate-600">{st.rayon?.name || '-'}</td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        {statusOptions.map((opt) => (
                                                            <button
                                                                type="button"
                                                                key={opt}
                                                                onClick={() => handleStatusChange(st.id, opt)}
                                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                                                                    cur.status === opt
                                                                        ? opt === 'HADIR'
                                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                                            : opt === 'SAKIT'
                                                                            ? 'bg-amber-500 text-white shadow-xs'
                                                                            : opt === 'IZIN'
                                                                            ? 'bg-sky-600 text-white shadow-xs'
                                                                            : opt === 'DISPEN'
                                                                            ? 'bg-purple-600 text-white shadow-xs'
                                                                            : 'bg-rose-600 text-white shadow-xs'
                                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                }`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <input
                                                        type="text"
                                                        value={cur.notes}
                                                        onChange={(e) => handleNotesChange(st.id, e.target.value)}
                                                        placeholder="keterangan opsional..."
                                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-[#004e7c] hover:bg-[#003859] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan Presensi...' : 'SIMPAN PRESENSI PERTEMUAN INI'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
