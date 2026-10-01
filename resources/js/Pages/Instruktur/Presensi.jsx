import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PresensiInput({ schedule, students = [], attendances = {} }) {
    // Initial attendance state map
    const initialAttendance = {};
    students.forEach((st) => {
        const existing = attendances[String(st.id)] || attendances[st.id] || {};
        initialAttendance[st.id] = {
            status: existing.status || 'HADIR',
            notes: existing.notes || '',
        };
    });

    const { data, setData, post, processing, progress } = useForm({
        attendance: initialAttendance,
        photo: null,
        material_text: schedule.material_text || '',
        location: schedule.location || '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showDocumentationSection, setShowDocumentationSection] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(schedule.photo_url || null);

    // Dynamic counts
    const totalStudents = students.length;
    let hadirCount = 0;
    let sakitCount = 0;
    let izinCount = 0;
    let alpaCount = 0;
    let dispenCount = 0;

    Object.values(data.attendance).forEach((item) => {
        if (item.status === 'HADIR') hadirCount++;
        else if (item.status === 'SAKIT') sakitCount++;
        else if (item.status === 'IZIN') izinCount++;
        else if (item.status === 'ALPA') alpaCount++;
        else if (item.status === 'DISPEN') dispenCount++;
    });

    const attendanceRate = totalStudents > 0 ? Math.round((hadirCount / totalStudents) * 100) : 0;

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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/instruktur/presensi/${schedule.id}`, {
            forceFormData: true,
        });
    };

    const statusOptions = ['HADIR', 'SAKIT', 'IZIN', 'ALPA', 'DISPEN'];

    // Filter students
    const filteredStudents = students.filter((st) => {
        const item = data.attendance[st.id] || { status: 'HADIR', notes: '' };
        const matchesQuery =
            !searchQuery ||
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (st.rayon?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Input Presensi - ${schedule.eskul?.name}`} />

            <div className="space-y-6">
                
                {/* Header Information */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href="/instruktur/my-eskul" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                                <i className="bi bi-arrow-left"></i> Kembali ke Cabang Eskul
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-md uppercase">
                                {schedule.eskul?.type || 'ESKUL'}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                                Lembar Presensi: {schedule.eskul?.name}
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Tanggal: <strong className="text-slate-800 font-bold">{schedule.activity_date}</strong> • Jam: {schedule.start_time} - {schedule.end_time} • Lokasi: {schedule.location || schedule.room_number || 'Ruang Standar'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setAllStatus('HADIR')}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <i className="bi bi-check2-all"></i>
                            <span>Tandai Semua Hadir</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDocumentationSection(!showDocumentationSection)}
                            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                showDocumentationSection || photoPreview
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <i className="bi bi-camera-fill text-purple-600"></i>
                            <span>{photoPreview ? 'Foto Terlampir' : 'Lampirkan Foto & Materi'}</span>
                        </button>
                    </div>
                </div>

                {/* Real-time Attendance Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Persentase</div>
                        <div className="text-2xl font-black text-emerald-600 mt-0.5">{attendanceRate}%</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Tingkat Kehadiran</div>
                    </div>
                    <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70 shadow-xs">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Hadir (H)</div>
                        <div className="text-2xl font-black text-emerald-800 mt-0.5">{hadirCount}</div>
                        <div className="text-[10px] text-emerald-600 mt-0.5">dari {totalStudents} Siswa</div>
                    </div>
                    <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200/70 shadow-xs">
                        <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Sakit (S)</div>
                        <div className="text-2xl font-black text-sky-800 mt-0.5">{sakitCount}</div>
                        <div className="text-[10px] text-sky-600 mt-0.5">Izin Sakit</div>
                    </div>
                    <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 shadow-xs">
                        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Izin (I)</div>
                        <div className="text-2xl font-black text-amber-800 mt-0.5">{izinCount}</div>
                        <div className="text-[10px] text-amber-600 mt-0.5">Izin Keperluan</div>
                    </div>
                    <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/70 shadow-xs">
                        <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Alpa (A)</div>
                        <div className="text-2xl font-black text-rose-800 mt-0.5">{alpaCount}</div>
                        <div className="text-[10px] text-rose-600 mt-0.5">Tanpa Keterangan</div>
                    </div>
                    <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200/70 shadow-xs">
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Dispen (D)</div>
                        <div className="text-2xl font-black text-purple-800 mt-0.5">{dispenCount}</div>
                        <div className="text-[10px] text-purple-600 mt-0.5">Dispensasi Sekolah</div>
                    </div>
                </div>

                {/* Form Main */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Integrated Photo & Documentation Drawer (Collapsible) */}
                    {(showDocumentationSection || photoPreview) && (
                        <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                                        <i className="bi bi-camera-fill"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">
                                            Dokumentasi Foto & Materi Kegiatan
                                        </h4>
                                        <p className="text-[11px] text-slate-400">
                                            Foto ini akan langsung masuk ke Lib Foto Instruktur dan Galeri Kesiswaan.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDocumentationSection(false)}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    <i className="bi bi-chevron-up"></i> Sembunyikan
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                                <div className="space-y-3">
                                    <div>
                                        <label className="font-bold text-slate-700">Lokasi Kegiatan / Ruang</label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Contoh: Lapangan Utama, Lab Komputer, Aula..."
                                            className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-bold text-slate-700">Materi / Topik Pembelajaran</label>
                                        <textarea
                                            rows={3}
                                            value={data.material_text}
                                            onChange={(e) => setData('material_text', e.target.value)}
                                            placeholder="Tuliskan materi yang dipelajari pada sesi ini..."
                                            className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-slate-700">Foto Bukti Pelaksanaan (Lib Foto)</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handlePhotoChange}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    {photoPreview && (
                                        <div className="pt-2">
                                            <div className="text-[11px] font-bold text-slate-500 mb-1">Pratinjau Foto:</div>
                                            <img
                                                src={photoPreview}
                                                alt="Dokumentasi"
                                                className="h-32 w-full object-cover rounded-2xl border border-purple-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Table Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                        {/* Table Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Filter Status */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-400 mr-1">Filter:</span>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('ALL')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                        statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Semua ({students.length})
                                </button>
                                {statusOptions.map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                            statusFilter === st
                                                ? 'bg-[#0077b6] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>

                            {/* Search Student */}
                            <div className="relative w-full sm:w-64">
                                <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input
                                    type="text"
                                    placeholder="Cari siswa / NIS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 w-12">No</th>
                                        <th className="pb-3">NIS & Nama Siswa</th>
                                        <th className="pb-3">Rayon</th>
                                        <th className="pb-3">Status Kehadiran</th>
                                        <th className="pb-3">Catatan / Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-slate-400">
                                                Tidak ada siswa yang sesuai filter pencarian.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((st, idx) => {
                                            const cur = data.attendance[st.id] || { status: 'HADIR', notes: '' };
                                            return (
                                                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3 font-bold text-slate-400">{idx + 1}</td>
                                                    <td className="py-3">
                                                        <div className="font-extrabold text-slate-900">{st.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono">NIS: {st.nis}</div>
                                                    </td>
                                                    <td className="py-3 text-slate-600 font-medium">{st.rayon?.name || '-'}</td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            {statusOptions.map((opt) => (
                                                                <button
                                                                    type="button"
                                                                    key={opt}
                                                                    onClick={() => handleStatusChange(st.id, opt)}
                                                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${
                                                                        cur.status === opt
                                                                            ? opt === 'HADIR'
                                                                                ? 'bg-emerald-600 text-white shadow-xs font-black'
                                                                                : opt === 'SAKIT'
                                                                                ? 'bg-sky-600 text-white shadow-xs font-black'
                                                                                : opt === 'IZIN'
                                                                                ? 'bg-amber-500 text-white shadow-xs font-black'
                                                                                : opt === 'DISPEN'
                                                                                ? 'bg-purple-600 text-white shadow-xs font-black'
                                                                                : 'bg-rose-600 text-white shadow-xs font-black'
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
                                                            placeholder="Keterangan opsional..."
                                                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Submit Action */}
                    <div className="flex items-center justify-between bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="text-xs text-slate-500">
                            Total Hadir: <strong className="text-emerald-700 font-bold">{hadirCount}</strong> dari {totalStudents} Siswa ({attendanceRate}%)
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/instruktur/my-eskul"
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-7 py-3 bg-[#005b96] hover:bg-[#004e7c] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md shadow-sky-900/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <i className="bi bi-cloud-arrow-up-fill text-sm"></i>
                                <span>{processing ? 'Menyimpan Presensi & Foto...' : 'SIMPAN PRESENSI KEGIATAN'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
