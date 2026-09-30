import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UsersIndex({ users = [], roles = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const importFileRef = useRef(null);

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post('/admin/import/users', formData, {
            forceFormData: true,
            onFinish: () => { if (importFileRef.current) importFileRef.current.value = ''; },
        });
    };

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id || '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
        is_active: true,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (u) => {
        setEditingUser(u);
        editForm.setData({
            name: u.name,
            email: u.email,
            password: '',
            role_id: u.role_id,
            is_active: Boolean(u.is_active),
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/admin/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
            },
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus pengguna "${name}"?`)) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna - SIBAS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Manajemen Pengguna & Hak Akses</h2>
                        <p className="text-xs text-slate-500">Kelola akun admin, verifikasi instruktur baru, dan pembimbing siswa.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="file" ref={importFileRef} onChange={handleImportExcel} accept=".xlsx,.xls,.csv" className="hidden" />
                        <button
                            onClick={() => importFileRef.current?.click()}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                            <span>Import Excel</span>
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-person-plus-fill"></i>
                            <span>Tambah Pengguna</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Nama</th>
                                    <th className="pb-3">Email / Username</th>
                                    <th className="pb-3">Peran (Role)</th>
                                    <th className="pb-3">Status Akun</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {users.map((u, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-bold text-slate-900">{u.name}</td>
                                        <td className="py-3 font-mono text-slate-600">{u.email}</td>
                                        <td className="py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[10px] font-extrabold uppercase">
                                                {u.role?.name || 'User'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            {u.is_active ? (
                                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold">
                                                    Menunggu Verifikasi
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-right space-x-1.5">
                                            <button
                                                onClick={() => handleEditOpen(u)}
                                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id, u.name)}
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
                        <h3 className="text-base font-black text-slate-900">Tambah Akun Pengguna</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Email Resmi</label>
                                <input
                                    type="email"
                                    required
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={createForm.data.password}
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Hak Akses Role</label>
                                <select
                                    value={createForm.data.role_id}
                                    onChange={(e) => createForm.setData('role_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {roles.map((ro) => (
                                        <option key={ro.id} value={ro.id}>
                                            {ro.name}
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
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Edit Akun Pengguna</h3>
                        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Password Baru (Kosongkan jika tidak diubah)</label>
                                <input
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(e) => editForm.setData('password', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Hak Akses Role</label>
                                <select
                                    value={editForm.data.role_id}
                                    onChange={(e) => editForm.setData('role_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {roles.map((ro) => (
                                        <option key={ro.id} value={ro.id}>
                                            {ro.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="rounded text-sky-600"
                                    />
                                    <span>Akun Terverifikasi & Aktif</span>
                                </label>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
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
