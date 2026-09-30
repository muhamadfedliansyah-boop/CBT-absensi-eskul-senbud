import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Materi({ schedule }) {
    const { data, setData, post, processing, errors } = useForm({
        material_text: schedule.material_text || '',
        location: schedule.location || '',
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/instruktur/jadwal/materi/${schedule.id}`, {
            forceFormData: true,
        });
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
                            <label className="font-bold text-slate-700">Lokasi Kegiatan</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Contoh: Lapangan Utama, Lab Komputer 2, Aula..."
                                className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                            {errors.location && <p className="text-rose-500 mt-1">{errors.location}</p>}
                        </div>

                        <div>
                            <label className="font-bold text-slate-700">Ringkasan Materi / Topik Pembelajaran</label>
                            <textarea
                                rows={5}
                                value={data.material_text}
                                onChange={(e) => setData('material_text', e.target.value)}
                                placeholder="Tuliskan materi yang diajarkan pada pertemuan ini..."
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            ></textarea>
                            {errors.material_text && <p className="text-rose-500 mt-1">{errors.material_text}</p>}
                        </div>

                        <div>
                            <label className="font-bold text-slate-700">Foto Dokumentasi Kegiatan</label>
                            <p className="text-[10px] text-slate-400 mb-1.5">Format: JPG, PNG, WebP — Maks. 2MB</p>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={(e) => setData('photo', e.target.files[0])}
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                            />
                            {errors.photo && <p className="text-rose-500 mt-1">{errors.photo}</p>}
                        </div>

                        {schedule.photo_url && (
                            <div className="pt-2">
                                <div className="text-xs font-bold text-slate-600 mb-1.5">Foto Sebelumnya:</div>
                                <img
                                    src={schedule.photo_url}
                                    alt="Dokumentasi Kegiatan"
                                    className="h-40 w-full object-cover rounded-2xl border border-slate-200"
                                />
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/instruktur/my-eskul"
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </Link>
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
