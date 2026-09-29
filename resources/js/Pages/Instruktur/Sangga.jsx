import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SanggaManagement({ eskul }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createForm = useForm({
        name: '',
        type: 'SANGGA',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(`/instruktur/sangga/${eskul.id}`, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Kelola Sangga - ${eskul.name}`} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link href="/instruktur/my-eskul" className="text-xs font-bold text-sky-600 hover:underline">
                            ← Kembali ke Eskul Saya
                        </Link>
                        <h2 className="text-xl font-black text-slate-900 mt-1">
                            Kelola Pembagian Sangga / Kelompok
                        </h2>
                        <p className="text-xs text-slate-500">Cabang: {eskul.name} ({eskul.type})</p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                        <i className="bi bi-plus-lg"></i>
                        <span>Buat Sangga Baru</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {eskul.sanggas && eskul.sanggas.length > 0 ? (
                        eskul.sanggas.map((sangga, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-sm text-slate-900">{sangga.name}</h4>
                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                                        {sangga.type}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {sangga.students?.length || 0} Anggota Terdaftar
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                            Belum ada sangga / kelompok yang dibuat.
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900">Buat Sangga / Kelompok Baru</h3>
                        <form onSubmit={handleCreate} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Nama Sangga / Kelompok</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="contoh: Sangga Perintis 1"
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                />
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
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
