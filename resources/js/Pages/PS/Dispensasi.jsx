import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PSDispensasi({ dispensasiList, students = [], schedules = [] }) {
    const list = dispensasiList?.data || dispensasiList || [];
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createForm = useForm({
        student_id: students[0]?.id || '',
        schedule_id: schedules[0]?.id || '',
        status: 'DISPEN',
        notes: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/ps/dispensasi', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset('notes');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Dispensasi & Izin - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Kelola Surat Izin & Dispensasi Siswa</h2>
                        <p className="text-xs text-slate-500">
                            Terbitkan surat dispensasi lomba, izin sakit, atau dinas luar untuk siswa bimbingan rayon.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                        <i className="bi bi-file-earmark-plus"></i>
                        <span>Terbitkan Dispensasi / Izin</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Siswa & Rayon</th>
                                    <th className="pb-3">Cabang Eskul</th>
                                    <th className="pb-3">Tanggal Pertemuan</th>
                                    <th className="pb-3">Jenis Izin</th>
                                    <th className="pb-3">Alasan / Keterangan</th>
                                    <th className="pb-3">Diterbitkan Oleh</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {list.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3">
                                            <div className="font-bold text-slate-900">{item.student?.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">
                                                {item.student?.nis} • {item.student?.rayon?.name}
                                            </div>
                                        </td>
                                        <td className="py-3">{item.schedule?.eskul?.name || '-'}</td>
                                        <td className="py-3 font-mono">{item.schedule?.activity_date || '-'}</td>
                                        <td className="py-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                                    item.status === 'DISPEN'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : item.status === 'IZIN'
                                                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 font-medium text-slate-700">{item.notes}</td>
                                        <td className="py-3 text-slate-500">{item.dispensasi_by_user?.name || 'PS'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Terbitkan Dispensasi / Surat Izin</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Pilih Siswa</label>
                                <select
                                    value={createForm.data.student_id}
                                    onChange={(e) => createForm.setData('student_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {students.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} ({st.nis})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Pilih Jadwal Sesi Eskul</label>
                                <select
                                    value={createForm.data.schedule_id}
                                    onChange={(e) => createForm.setData('schedule_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {schedules.map((sch) => (
                                        <option key={sch.id} value={sch.id}>
                                            {sch.eskul?.name} • {sch.activity_date}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Status Izin</label>
                                <select
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    <option value="DISPEN">Dispensasi Kegiatan Sekolah / Lomba</option>
                                    <option value="IZIN">Izin Keperluan Keluarga</option>
                                    <option value="SAKIT">Surat Keterangan Sakit</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Keterangan / Alasan</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={createForm.data.notes}
                                    onChange={(e) => createForm.setData('notes', e.target.value)}
                                    placeholder="contoh: Mengikuti Lomba Debat Bahasa Inggris Tingkat Provinsi"
                                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                                ></textarea>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex-1 py-2 bg-sky-600 text-white rounded-xl font-bold shadow-xs"
                                >
                                    Terbitkan Izin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
