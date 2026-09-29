import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RayonsIndex({ rayons = [], psUsers = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingRayon, setEditingRayon] = useState(null);

    const createForm = useForm({
        name: '',
        ps_id: psUsers[0]?.id || '',
    });

    const editForm = useForm({
        name: '',
        ps_id: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/rayons', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (r) => {
        setEditingRayon(r);
        editForm.setData({
            name: r.name,
            ps_id: r.ps_id || '',
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/admin/rayons/${editingRayon.id}`, {
            onSuccess: () => {
                setEditingRayon(null);
            },
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus rayon "${name}"?`)) {
            router.delete(`/admin/rayons/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Rayon - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Master Rayon & Pembimbing Siswa</h2>
                        <p className="text-xs text-slate-500">Kelola kelompok rayon dan penetapan Guru Pembimbing Siswa (PS).</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                    >
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>Tambah Rayon</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Nama Rayon</th>
                                    <th className="pb-3">Guru Pembimbing Siswa (PS)</th>
                                    <th className="pb-3">Total Anggota Siswa</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {rayons.map((r, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-bold text-slate-900">{r.name}</td>
                                        <td className="py-3 font-semibold text-slate-800">
                                            {r.pembimbing?.name || <span className="text-amber-600 font-bold">Belum Ditugaskan</span>}
                                        </td>
                                        <td className="py-3">{r.students?.length || 0} Siswa</td>
                                        <td className="py-3 text-right space-x-1.5">
                                            <button
                                                onClick={() => handleEditOpen(r)}
                                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id, r.name)}
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
                        <h3 className="text-base font-black text-slate-900">Tambah Rayon Baru</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Rayon</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="contoh: Ciawi 1, Wikrama 3"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Guru Pembimbing Siswa (PS)</label>
                                <select
                                    value={createForm.data.ps_id}
                                    onChange={(e) => createForm.setData('ps_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {psUsers.map((ps) => (
                                        <option key={ps.id} value={ps.id}>
                                            {ps.name} ({ps.email})
                                        </option>
                                    ))}
                                </select>
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
                                    Simpan Rayon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingRayon && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Edit Rayon</h3>
                        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Rayon</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Guru Pembimbing Siswa (PS)</label>
                                <select
                                    value={editForm.data.ps_id}
                                    onChange={(e) => editForm.setData('ps_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {psUsers.map((ps) => (
                                        <option key={ps.id} value={ps.id}>
                                            {ps.name} ({ps.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingRayon(null)}
                                    className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-1 py-2 bg-sky-600 text-white rounded-xl font-bold shadow-xs"
                                >
                                    Perbarui
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
