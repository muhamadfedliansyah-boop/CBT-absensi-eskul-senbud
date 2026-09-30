import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EskulIndex({ eskuls = [], instructors = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEskul, setEditingEskul] = useState(null);
    const importFileRef = useRef(null);

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post('/admin/import/eskuls', formData, {
            forceFormData: true,
            onFinish: () => { if (importFileRef.current) importFileRef.current.value = ''; },
        });
    };

    const createForm = useForm({
        name: '',
        type: 'ESKUL',
        instruktur_id: instructors[0]?.id || '',
    });

    const editForm = useForm({
        name: '',
        type: 'ESKUL',
        instruktur_id: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/eskul', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (eskul) => {
        setEditingEskul(eskul);
        editForm.setData({
            name: eskul.name,
            type: eskul.type,
            instruktur_id: eskul.instruktur_id || '',
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/admin/eskul/${editingEskul.id}`, {
            onSuccess: () => {
                setEditingEskul(null);
            },
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Yakin ingin menghapus eskul "${name}"? Seluruh data terkait akan dihapus.`)) {
            router.delete(`/admin/eskul/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Eskul - SIBAS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Master Ekstrakurikuler & Seni Budaya</h2>
                        <p className="text-xs text-slate-500">Kelola daftar cabang kegiatan dan penetapan instruktur pembina.</p>
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
                            <i className="bi bi-plus-lg"></i>
                            <span>Tambah Cabang Eskul</span>
                        </button>
                    </div>
                </div>

                {/* Eskul Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Nama Ekstrakurikuler</th>
                                    <th className="pb-3">Kategori</th>
                                    <th className="pb-3">Instruktur / Pembina</th>
                                    <th className="pb-3">Jumlah Siswa</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {eskuls.map((eskul, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 font-bold text-slate-900">{eskul.name}</td>
                                        <td className="py-3">
                                            {eskul.type === 'SENBUD' ? (
                                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit">
                                                    <i className="bi bi-palette-fill text-purple-500"></i>
                                                    Seni Budaya
                                                </span>
                                            ) : eskul.type === 'PRODUKTIF' ? (
                                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit">
                                                    <i className="bi bi-cpu-fill text-emerald-500"></i>
                                                    Ekstrakurikuler Produktif
                                                </span>
                                            ) : eskul.type === 'PRAMUKA' ? (
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit">
                                                    <i className="bi bi-compass-fill text-amber-500"></i>
                                                    Pramuka
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit">
                                                    <i className="bi bi-award-fill text-sky-500"></i>
                                                    Ekstrakurikuler
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3">{eskul.instruktur?.name || <span className="text-amber-600 font-bold">Belum Ditentukan</span>}</td>
                                        <td className="py-3 font-semibold">{eskul.students_count ?? eskul.students?.length ?? 0} Siswa</td>
                                        <td className="py-3 text-right space-x-1.5">
                                            <button
                                                onClick={() => handleEditOpen(eskul)}
                                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(eskul.id, eskul.name)}
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
                        <h3 className="text-base font-black text-slate-900">Tambah Ekstrakurikuler / Seni Budaya Baru</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Eskul / Cabang</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="contoh: Seni Tari Tradisional / Robotika"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Jenis / Kategori</label>
                                <select
                                    value={createForm.data.type}
                                    onChange={(e) => createForm.setData('type', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    <option value="ESKUL">Ekstrakurikuler</option>
                                    <option value="SENBUD">Seni Budaya</option>
                                    <option value="PRODUKTIF">Ekstrakurikuler Produktif</option>
                                    <option value="PRAMUKA">Pramuka Wajib</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Instruktur Pembina (Akun Role Instruktur)</label>
                                <select
                                    required
                                    value={createForm.data.instruktur_id}
                                    onChange={(e) => createForm.setData('instruktur_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    <option value="">-- Pilih Instruktur Pengampu --</option>
                                    {instructors.map((ins) => (
                                        <option key={ins.id} value={ins.id}>
                                            {ins.name} ({ins.email})
                                        </option>
                                    ))}
                                </select>
                                {instructors.length === 0 && (
                                    <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                                        ⚠️ Belum ada akun staf dengan role Instruktur. Tambahkan akun baru dengan role "Instruktur" di menu Pegawai & Pengguna.
                                    </p>
                                )}
                                {createForm.errors.instruktur_id && (
                                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{createForm.errors.instruktur_id}</p>
                                )}
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
                                    disabled={createForm.processing || instructors.length === 0}
                                    className="flex-1 py-2 bg-sky-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingEskul && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Edit Ekstrakurikuler / Seni Budaya</h3>
                        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Eskul / Cabang</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Jenis / Kategori</label>
                                <select
                                    value={editForm.data.type}
                                    onChange={(e) => editForm.setData('type', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    <option value="ESKUL">Ekstrakurikuler</option>
                                    <option value="SENBUD">Seni Budaya</option>
                                    <option value="PRODUKTIF">Ekstrakurikuler Produktif</option>
                                    <option value="PRAMUKA">Pramuka Wajib</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700">Instruktur Pembina (Akun Role Instruktur)</label>
                                <select
                                    required
                                    value={editForm.data.instruktur_id}
                                    onChange={(e) => editForm.setData('instruktur_id', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                                >
                                    <option value="">-- Pilih Instruktur Pengampu --</option>
                                    {instructors.map((ins) => (
                                        <option key={ins.id} value={ins.id}>
                                            {ins.name} ({ins.email})
                                        </option>
                                    ))}
                                </select>
                                {editForm.errors.instruktur_id && (
                                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{editForm.errors.instruktur_id}</p>
                                )}
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingEskul(null)}
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
