import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Materi({ schedule }) {
    const { data, setData, post, processing } = useForm({
        material_text: schedule.material_text || '',
        activity_photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/instruktur/materi/${schedule.id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Materi & Dokumentasi - ${schedule.eskul?.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <Link href="/instruktur/my-eskul" className="text-xs font-bold text-sky-600 hover:underline">
                        ← Kembali ke Daftar Eskul
                    </Link>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                        Unggah Materi & Dokumentasi
                    </h2>
                    <p className="text-xs text-slate-500">
                        {schedule.eskul?.name} • Pertemuan Tanggal {schedule.activity_date}
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="font-bold text-slate-700">Ringkasan Materi / Topik Pembelajaran</label>
                            <textarea
                                rows={5}
                                value={data.material_text}
                                onChange={(e) => setData('material_text', e.target.value)}
                                placeholder="Tuliskan materi yang diajarkan pada pertemuan ini..."
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            ></textarea>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700">Foto Dokumentasi Kegiatan</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('activity_photo', e.target.files[0])}
                                className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                            />
                        </div>

                        {schedule.activity_photo_url && (
                            <div className="pt-2">
                                <div className="text-xs font-bold text-slate-600 mb-1">Foto Sebelumnya:</div>
                                <img
                                    src={schedule.activity_photo_url}
                                    alt="Dokumentasi"
                                    className="h-36 rounded-2xl object-cover border border-slate-200"
                                />
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs transition-all disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Materi & Dokumentasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
