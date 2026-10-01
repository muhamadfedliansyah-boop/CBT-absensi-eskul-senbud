import React, { useState, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SchedulesIndex({ schedules = [], eskuls = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [filterEskul, setFilterEskul] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ESKUL' | 'SENBUD' | 'PRAMUKA'
    const [searchQuery, setSearchQuery] = useState('');
    const importFileRef = useRef(null);

    const createForm = useForm({
        eskul_id: eskuls[0]?.id || '',
        activity_date: new Date().toISOString().split('T')[0],
        start_time: '15:00',
        end_time: '17:00',
        location: '',
        material_text: '',
    });

    const editForm = useForm({
        eskul_id: '',
        activity_date: '',
        start_time: '15:00',
        end_time: '17:00',
        location: '',
        material_text: '',
    });

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post('/admin/import/schedules', formData, {
            forceFormData: true,
            onFinish: () => {
                if (importFileRef.current) importFileRef.current.value = '';
            },
        });
    };

    const handleExportExcel = () => {
        let url = '/admin/export/schedules';
        if (filterEskul) {
            url += `?eskul_id=${filterEskul}`;
        }
        window.location.href = url;
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/schedules', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditOpen = (sch) => {
        setEditingSchedule(sch);
        editForm.setData({
            eskul_id: sch.eskul_id,
            activity_date: sch.activity_date,
            start_time: sch.start_time ? sch.start_time.slice(0, 5) : '15:00',
            end_time: sch.end_time ? sch.end_time.slice(0, 5) : '17:00',
            location: sch.location || '',
            material_text: sch.material_text || '',
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(`/admin/schedules/${editingSchedule.id}`, {
            onSuccess: () => {
                setEditingSchedule(null);
            },
        });
    };

    const handleDelete = (id, date, eskulName) => {
        if (confirm(`Yakin ingin menghapus jadwal "${eskulName}" pada tanggal ${date}? Data presensi terkait juga akan dihapus.`)) {
            router.delete(`/admin/schedules/${id}`);
        }
    };

    // Filter schedules
    const filteredSchedules = schedules.filter((sch) => {
        if (filterEskul && String(sch.eskul_id) !== String(filterEskul)) return false;
        if (filterType !== 'ALL' && sch.eskul?.type !== filterType) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const eskulName = (sch.eskul?.name || '').toLowerCase();
            const instrukturName = (sch.eskul?.instruktur?.name || '').toLowerCase();
            const location = (sch.location || '').toLowerCase();
            const material = (sch.material_text || '').toLowerCase();
            const date = (sch.activity_date || '').toLowerCase();

            if (
                !eskulName.includes(q) &&
                !instrukturName.includes(q) &&
                !location.includes(q) &&
                !material.includes(q) &&
                !date.includes(q)
            ) {
                return false;
            }
        }
        return true;
    });

    // Counts
    const totalSchedules = schedules.length;
    const recordedSchedules = schedules.filter(s => s.attendances && s.attendances.length > 0).length;

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal & Ruangan - SIBAS" />

            <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#005b96] via-[#006ca7] to-[#004e7c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-lg text-xs font-bold text-sky-100 backdrop-blur-md">
                            <i className="bi bi-calendar-check-fill"></i>
                            <span>Administrasi Jadwal & Alokasi Ruangan</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Jadwal Pertemuan Ekskul & Senbud
                        </h2>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                            Atur jadwal kegiatan mingguan untuk setiap cabang eskul atau seni budaya. Jadwal yang ditambahkan di sini akan **otomatis masuk ke Dashboard akun Instruktur pengampu** agar dapat diabsenkan.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
                        {/* Hidden File Input for Import */}
                        <input
                            type="file"
                            ref={importFileRef}
                            onChange={handleImportExcel}
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                        />

                        {/* Petunjuk Format Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsHelpModalOpen(true)}
                            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md"
                            title="Petunjuk Format Excel"
                        >
                            <i className="bi bi-info-circle"></i>
                            <span className="hidden sm:inline">Format Excel</span>
                        </button>

                        {/* Import Excel */}
                        <button
                            type="button"
                            onClick={() => importFileRef.current?.click()}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-emerald-950/20"
                        >
                            <i className="bi bi-file-earmark-arrow-up-fill"></i>
                            <span>Import Excel</span>
                        </button>

                        {/* Export Excel */}
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white border border-sky-400/40 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-sky-950/20"
                        >
                            <i className="bi bi-file-earmark-arrow-down-fill"></i>
                            <span>Export Excel</span>
                        </button>

                        {/* Tambah Jadwal Manual */}
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2.5 bg-white hover:bg-sky-50 text-slate-900 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-sky-950/20"
                        >
                            <i className="bi bi-plus-circle-fill text-sky-700"></i>
                            <span>Tambah Jadwal</span>
                        </button>
                    </div>
                </div>

                {/* Quick Info & Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-calendar3"></i>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Jadwal Sesi</div>
                            <div className="text-2xl font-black text-slate-900">{totalSchedules} <span className="text-xs font-semibold text-slate-400">Pertemuan</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-check2-circle"></i>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sudah Diabsen</div>
                            <div className="text-2xl font-black text-emerald-800">{recordedSchedules} <span className="text-xs font-semibold text-emerald-600">Sesi</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Belum Ada Presensi</div>
                            <div className="text-2xl font-black text-amber-800">{totalSchedules - recordedSchedules} <span className="text-xs font-semibold text-amber-600">Sesi</span></div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                        <span className="text-xs font-bold text-slate-400 mr-1">Tipe:</span>
                        {['ALL', 'ESKUL', 'SENBUD', 'PRAMUKA'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFilterType(t)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    filterType === t
                                        ? 'bg-[#0077b6] text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {t === 'ALL' ? 'Semua Tipe' : t}
                            </button>
                        ))}
                    </div>

                    {/* Eskul Select and Search */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
                        <select
                            value={filterEskul}
                            onChange={(e) => setFilterEskul(e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                            <option value="">Semua Cabang Kegiatan</option>
                            {eskuls.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name} ({e.type})
                                </option>
                            ))}
                        </select>

                        <div className="relative w-full sm:w-56">
                            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                placeholder="Cari kegiatan/instruktur..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Schedules Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3 w-10">No</th>
                                    <th className="pb-3">Cabang Eskul & Tipe</th>
                                    <th className="pb-3">Instruktur Pengampu</th>
                                    <th className="pb-3">Tanggal Kegiatan</th>
                                    <th className="pb-3">Waktu & Lokasi</th>
                                    <th className="pb-3">Topik / Materi</th>
                                    <th className="pb-3 text-center">Status Presensi</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {filteredSchedules.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-slate-400">
                                            Tidak ada jadwal yang sesuai filter pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSchedules.map((sch, idx) => {
                                        const instrukturName = sch.eskul?.instruktur?.name || 'Belum Ditugaskan';
                                        const attendanceCount = sch.attendances?.length || 0;
                                        const hadirCount = sch.attendances?.filter(a => a.status === 'HADIR').length || 0;
                                        const hasPhoto = !!sch.photo_url;

                                        return (
                                            <tr key={sch.id || idx} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 font-bold text-slate-400">{idx + 1}</td>
                                                <td className="py-3">
                                                    <div className="font-extrabold text-slate-900 flex items-center gap-2">
                                                        <span>{sch.eskul?.name}</span>
                                                        {hasPhoto && (
                                                            <span className="text-purple-600 text-[11px]" title="Foto dokumentasi terunggah">
                                                                <i className="bi bi-image-fill"></i>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-sky-700 font-bold uppercase mt-0.5">
                                                        {sch.eskul?.type || 'ESKUL'}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                                        <i className="bi bi-person-badge text-sky-600"></i>
                                                        <span>{instrukturName}</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {sch.eskul?.instruktur ? 'Akun Siap Mengabsen' : 'Tetapkan di Menu Eskul'}
                                                    </div>
                                                </td>
                                                <td className="py-3 font-mono font-bold text-slate-800">
                                                    {sch.activity_date}
                                                </td>
                                                <td className="py-3">
                                                    <div className="font-semibold text-slate-800">
                                                        {sch.start_time ? sch.start_time.slice(0, 5) : ''} - {sch.end_time ? sch.end_time.slice(0, 5) : ''}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-medium">
                                                        <i className="bi bi-geo-alt text-slate-400"></i> {sch.location || 'Ruang Standar'}
                                                    </div>
                                                </td>
                                                <td className="py-3 max-w-xs">
                                                    <span className="line-clamp-2 text-slate-600">
                                                        {sch.material_text || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    {attendanceCount > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-extrabold">
                                                            <i className="bi bi-check-circle-fill text-emerald-600"></i>
                                                            <span>{hadirCount}/{attendanceCount} Hadir</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-[10px] font-extrabold">
                                                            <i className="bi bi-hourglass-split text-amber-600"></i>
                                                            <span>Belum Diabsen</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/instruktur/presensi/${sch.id}`}
                                                            className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg transition-colors text-xs font-bold"
                                                            title="Input / Lihat Presensi"
                                                        >
                                                            <i className="bi bi-clipboard-check"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEditOpen(sch)}
                                                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                                            title="Edit Jadwal"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(sch.id, sch.activity_date, sch.eskul?.name)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Hapus Jadwal"
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* PETUNJUK FORMAT EXCEL MODAL */}
            {isHelpModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                                    <i className="bi bi-file-earmark-spreadsheet"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">Petunjuk Format File Excel</h3>
                                    <p className="text-[11px] text-slate-400">Gunakan susunan kolom berikut pada baris pertama (header).</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsHelpModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600">
                            <p>
                                Pastikan file Excel Anda (<strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong>) memiliki baris judul kolom berikut:
                            </p>

                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono text-[11px] space-y-2">
                                <div className="text-slate-800 font-bold">
                                    nama_eskul | tanggal | jam_mulai | jam_selesai | ruangan | materi
                                </div>
                                <div className="text-slate-500 text-[10px] font-sans">
                                    Contoh:
                                    <br />• <strong>nama_eskul:</strong> Robotik
                                    <br />• <strong>tanggal:</strong> 2026-10-15 (atau 15/10/2026)
                                    <br />• <strong>jam_mulai:</strong> 15:00
                                    <br />• <strong>jam_selesai:</strong> 17:00
                                    <br />• <strong>ruangan:</strong> Lab Komputer 2
                                    <br />• <strong>materi:</strong> Pengenalan Sensor Ultrasonik
                                </div>
                            </div>

                            <div className="p-3 bg-sky-50 text-sky-900 rounded-2xl text-[11px] space-y-1">
                                <div className="font-bold flex items-center gap-1">
                                    <i className="bi bi-lightbulb-fill text-amber-500"></i> Tips:
                                </div>
                                <p>
                                    Anda juga dapat menekan tombol <strong>Export Excel</strong> untuk mengunduh contoh struktur data jadwal yang sudah ada dan mengeditnya.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsHelpModalOpen(false)}
                                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Tambah Sesi Jadwal Baru</h3>
                                <p className="text-[11px] text-slate-400">Jadwal ini akan otomatis tampil di akun instruktur terkait.</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Cabang Ekstrakurikuler / Seni Budaya</label>
                                <select
                                    required
                                    value={createForm.data.eskul_id}
                                    onChange={(e) => createForm.setData('eskul_id', e.target.value)}
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                >
                                    {eskuls.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} ({es.type}) — Pengampu: {es.instruktur?.name || 'Belum ada'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Tanggal Kegiatan Pertemuan</label>
                                <input
                                    type="date"
                                    required
                                    value={createForm.data.activity_date}
                                    onChange={(e) => createForm.setData('activity_date', e.target.value)}
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700">Jam Mulai</label>
                                    <input
                                        type="time"
                                        required
                                        value={createForm.data.start_time}
                                        onChange={(e) => createForm.setData('start_time', e.target.value)}
                                        className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700">Jam Selesai</label>
                                    <input
                                        type="time"
                                        required
                                        value={createForm.data.end_time}
                                        onChange={(e) => createForm.setData('end_time', e.target.value)}
                                        className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Ruangan / Lokasi Pertemuan</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.location}
                                    onChange={(e) => createForm.setData('location', e.target.value)}
                                    placeholder="Contoh: Lab Komputer 2, Aula Barat, Lapangan Basket..."
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Topik / Agenda Materi (Opsional)</label>
                                <textarea
                                    rows={2}
                                    value={createForm.data.material_text}
                                    onChange={(e) => createForm.setData('material_text', e.target.value)}
                                    placeholder="Tuliskan topik atau target pembelajaran sesi ini..."
                                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                ></textarea>
                            </div>

                            <div className="flex gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex-1 py-2.5 bg-[#0077b6] hover:bg-[#004e7c] text-white rounded-xl font-extrabold shadow-md shadow-sky-900/20 transition-all disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingSchedule && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Ubah Sesi Jadwal Pertemuan</h3>
                                <p className="text-[11px] text-slate-400">Edit tanggal, jam, atau ruangan sesi.</p>
                            </div>
                            <button
                                onClick={() => setEditingSchedule(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
                            <div>
                                <label className="font-bold text-slate-700">Cabang Ekstrakurikuler / Seni Budaya</label>
                                <select
                                    required
                                    value={editForm.data.eskul_id}
                                    onChange={(e) => editForm.setData('eskul_id', e.target.value)}
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                >
                                    {eskuls.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} ({es.type}) — Pengampu: {es.instruktur?.name || 'Belum ada'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Tanggal Kegiatan Pertemuan</label>
                                <input
                                    type="date"
                                    required
                                    value={editForm.data.activity_date}
                                    onChange={(e) => editForm.setData('activity_date', e.target.value)}
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700">Jam Mulai</label>
                                    <input
                                        type="time"
                                        required
                                        value={editForm.data.start_time}
                                        onChange={(e) => editForm.setData('start_time', e.target.value)}
                                        className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700">Jam Selesai</label>
                                    <input
                                        type="time"
                                        required
                                        value={editForm.data.end_time}
                                        onChange={(e) => editForm.setData('end_time', e.target.value)}
                                        className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Ruangan / Lokasi Pertemuan</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.location}
                                    onChange={(e) => editForm.setData('location', e.target.value)}
                                    placeholder="Contoh: Lab Komputer 2, Aula Barat, Lapangan Basket..."
                                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Topik / Agenda Materi (Opsional)</label>
                                <textarea
                                    rows={2}
                                    value={editForm.data.material_text}
                                    onChange={(e) => editForm.setData('material_text', e.target.value)}
                                    placeholder="Tuliskan topik atau target pembelajaran sesi ini..."
                                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                ></textarea>
                            </div>

                            <div className="flex gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingSchedule(null)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-1 py-2.5 bg-[#0077b6] hover:bg-[#004e7c] text-white rounded-xl font-extrabold shadow-md shadow-sky-900/20 transition-all disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Jadwal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
