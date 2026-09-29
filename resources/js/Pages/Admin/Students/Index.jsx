import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentsIndex({ students, rayons = [], eskuls = [] }) {
    const studentList = students?.data || students || [];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [search, setSearch] = useState('');

    const createForm = useForm({
        nis: '',
        name: '',
        rayon_id: rayons[0]?.id || '',
        eskul_ids: [],
    });

    const editForm = useForm({
        nis: '',
        name: '',
        rayon_id: '',
        eskul_ids: [],
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/students', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (student) => {
        setEditingStudent(student);
        editForm.setData({
            nis: student.nis,
            name: student.name,
            rayon_id: student.rayon_id,
            eskul_ids: student.eskuls?.map((es) => es.id) || [],
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/admin/students/${editingStudent.id}`, {
            onSuccess: () => {
                setEditingStudent(null);
            },
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus data siswa "${name}"? Seluruh rekaman presensi siswa ini akan ikut terhapus.`)) {
            router.delete(`/admin/students/${id}`);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/students', { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Data Siswa - SIBAS" />

            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Master Data Peserta Didik</h2>
                        <p className="text-xs text-slate-500">Kelola NIS, rayon, dan penugasan cabang ekstrakurikuler siswa.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Cari NIS / Nama..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                            <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        </form>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-person-plus-fill"></i>
                            <span>Tambah Siswa</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">NIS</th>
                                    <th className="pb-3">Nama Siswa</th>
                                    <th className="pb-3">Rayon</th>
                                    <th className="pb-3">Eskul yang Diikuti</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {studentList.map((st, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-mono font-bold text-slate-900">{st.nis}</td>
                                        <td className="py-3 font-bold text-slate-800">{st.name}</td>
                                        <td className="py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                                {st.rayon?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {st.eskuls?.map((es, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-[10px] font-bold"
                                                    >
                                                        {es.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 text-right space-x-1.5">
                                            <button
                                                onClick={() => handleEditOpen(st)}
                                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(st.id, st.name)}
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

                    {/* Pagination Links */}
                    {students?.links && students.links.length > 3 && (
                        <div className="flex items-center justify-end gap-1.5 pt-4 border-t border-slate-100 mt-4">
                            {students.links.map((link, idx) => (
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
            </div>

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Tambah Peserta Didik Baru</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nomor Induk Siswa (NIS)</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.nis}
                                    onChange={(e) => createForm.setData('nis', e.target.value)}
                                    placeholder="contoh: 12309871"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Nama Lengkap Siswa</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="contoh: Muhammad Fedliansyah"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Rayon Wilayah</label>
                                <select
                                    value={createForm.data.rayon_id}
                                    onChange={(e) => createForm.setData('rayon_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {rayons.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Pilih Cabang Eskul yang Diikuti</label>
                                <div className="mt-1 max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                    {eskuls.map((es) => (
                                        <label key={es.id} className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                                            <input
                                                type="checkbox"
                                                value={es.id}
                                                checked={createForm.data.eskul_ids.includes(es.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const cur = [...createForm.data.eskul_ids];
                                                    if (checked) {
                                                        createForm.setData('eskul_ids', [...cur, es.id]);
                                                    } else {
                                                        createForm.setData('eskul_ids', cur.filter((id) => id !== es.id));
                                                    }
                                                }}
                                                className="rounded text-sky-600"
                                            />
                                            <span>{es.name}</span>
                                        </label>
                                    ))}
                                </div>
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
                                    Simpan Siswa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Edit Data Siswa</h3>
                        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">NIS</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.nis}
                                    onChange={(e) => editForm.setData('nis', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Nama Siswa</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Rayon Wilayah</label>
                                <select
                                    value={editForm.data.rayon_id}
                                    onChange={(e) => editForm.setData('rayon_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    {rayons.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Cabang Eskul yang Diikuti</label>
                                <div className="mt-1 max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                    {eskuls.map((es) => (
                                        <label key={es.id} className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                                            <input
                                                type="checkbox"
                                                value={es.id}
                                                checked={editForm.data.eskul_ids.includes(es.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const cur = [...editForm.data.eskul_ids];
                                                    if (checked) {
                                                        editForm.setData('eskul_ids', [...cur, es.id]);
                                                    } else {
                                                        editForm.setData('eskul_ids', cur.filter((id) => id !== es.id));
                                                    }
                                                }}
                                                className="rounded text-sky-600"
                                            />
                                            <span>{es.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
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
