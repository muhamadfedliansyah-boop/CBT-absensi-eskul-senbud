import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SchedulesIndex({ schedules = [], eskuls = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const createForm = useForm({
        eskul_id: eskuls[0]?.id || '',
        activity_date: '',
        start_time: '15:00',
        end_time: '17:00',
        room_number: '',
        material_text: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/schedules', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleDelete = (id, date) => {
        if (confirm(`Hapus jadwal pertemuan tanggal ${date}?`)) {
            router.delete(`/admin/schedules/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal & Ruangan - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Alokasi Ruangan & Jadwal Eskul</h2>
                        <p className="text-xs text-slate-500">Kelola jadwal pertemuan mingguan dan pembagian ruangan kegiatan.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                    >
                        <i className="bi bi-calendar-plus"></i>
                        <span>Tambah Sesi Jadwal</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Cabang Eskul</th>
                                    <th className="pb-3">Tanggal Kegiatan</th>
                                    <th className="pb-3">Waktu</th>
                                    <th className="pb-3">Ruangan</th>
                                    <th className="pb-3">Materi / Topik</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {schedules.map((sch, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-bold text-slate-900">{sch.eskul?.name}</td>
                                        <td className="py-3 font-mono">{sch.activity_date}</td>
                                        <td className="py-3">{sch.start_time} - {sch.end_time}</td>
                                        <td className="py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                                {sch.room_number || 'Standar'}
                                            </span>
                                        </td>
                                        <td className="py-3">{sch.material_text || '-'}</td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(sch.id, sch.activity_date)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Tambah Sesi Jadwal Pertemuan</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Cabang Eskul</label>
                                <select
                                    value={createForm.data.eskul_id}
                                    onChange={(e) => createForm.setData('eskul_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {eskuls.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} ({es.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Tanggal Kegiatan</label>
                                <input
                                    type="date"
                                    required
                                    value={createForm.data.activity_date}
                                    onChange={(e) => createForm.setData('activity_date', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="font-bold text-slate-700">Jam Mulai</label>
                                    <input
                                        type="time"
                                        required
                                        value={createForm.data.start_time}
                                        onChange={(e) => createForm.setData('start_time', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700">Jam Selesai</label>
                                    <input
                                        type="time"
                                        required
                                        value={createForm.data.end_time}
                                        onChange={(e) => createForm.setData('end_time', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Ruangan / Tempat</label>
                                <input
                                    type="text"
                                    value={createForm.data.room_number}
                                    onChange={(e) => createForm.setData('room_number', e.target.value)}
                                    placeholder="contoh: Lab Multimedia 1, Aula Barat"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Topik / Agenda Materi</label>
                                <input
                                    type="text"
                                    value={createForm.data.material_text}
                                    onChange={(e) => createForm.setData('material_text', e.target.value)}
                                    placeholder="contoh: Pengenalan Dasar Komposisi Tari"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex-1 py-2 bg-sky-600 text-white rounded-xl font-bold shadow-xs"
                                >
                                    Simpan Jadwal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
