import React, { useState, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentsIndex({
    students,
    rayons = [],
    eskuls = [],
    clashCount = 0,
    gformSpreadsheetUrl = '',
}) {
    const studentList = students?.data || students || [];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isGSheetModalOpen, setIsGSheetModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const importFileRef = useRef(null);

    // Google Sheet sync form
    const gsheetForm = useForm({
        sheet_url: gformSpreadsheetUrl || '',
    });

    // Divide eskuls into 3 categories: Ekstrakurikuler, Seni Budaya, Ekstrakurikuler Produktif
    const eskulOptions = eskuls.filter(
        (e) => e.type === 'ESKUL' || e.type === 'PRAMUKA' || (!e.type && e.type !== 'SENBUD' && e.type !== 'PRODUKTIF')
    );
    const senbudOptions = eskuls.filter((e) => e.type === 'SENBUD');
    const produktifOptions = eskuls.filter((e) => e.type === 'PRODUKTIF');

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post('/admin/import/students', formData, {
            forceFormData: true,
            onFinish: () => {
                if (importFileRef.current) importFileRef.current.value = '';
            },
        });
    };

    const handleSyncGoogleSheet = (e) => {
        e.preventDefault();
        gsheetForm.post('/admin/sync/google-sheet', {
            onSuccess: () => {
                setIsGSheetModalOpen(false);
            },
        });
    };

    const createForm = useForm({
        nis: '',
        name: '',
        rayon_id: rayons[0]?.id || '',
        selected_eskul: '',
        selected_senbud: '',
        selected_produktif: '',
    });

    const editForm = useForm({
        nis: '',
        name: '',
        rayon_id: '',
        selected_eskul: '',
        selected_senbud: '',
        selected_produktif: '',
    });

    const [formValidationError, setFormValidationError] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!createForm.data.selected_eskul) {
            setFormValidationError('Silakan pilih salah satu cabang Ekstrakurikuler.');
            return;
        }
        if (!createForm.data.selected_senbud) {
            setFormValidationError('Silakan pilih salah satu cabang Seni Budaya.');
            return;
        }
        setFormValidationError('');

        const selectedIds = [
            Number(createForm.data.selected_eskul),
            Number(createForm.data.selected_senbud),
            createForm.data.selected_produktif ? Number(createForm.data.selected_produktif) : null,
        ].filter(Boolean);

        createForm.transform((data) => ({
            nis: data.nis,
            name: data.name,
            rayon_id: data.rayon_id,
            eskul_ids: selectedIds,
        })).post('/admin/students', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset({
                    nis: '',
                    name: '',
                    rayon_id: rayons[0]?.id || '',
                    selected_eskul: '',
                    selected_senbud: '',
                    selected_produktif: '',
                });
            },
            onError: (err) => {
                if (err.eskul_ids) {
                    setFormValidationError(err.eskul_ids);
                }
            },
        });
    };

    const handleEditOpen = (student) => {
        setEditingStudent(student);
        setFormValidationError('');

        const sEskuls = student.eskuls || [];
        const eskul = sEskuls.find((e) => e.type === 'ESKUL' || e.type === 'PRAMUKA' || (e.type !== 'SENBUD' && e.type !== 'PRODUKTIF'));
        const senbud = sEskuls.find((e) => e.type === 'SENBUD');
        const produktif = sEskuls.find((e) => e.type === 'PRODUKTIF');

        editForm.setData({
            nis: student.nis || '',
            name: student.name || '',
            rayon_id: student.rayon_id || rayons[0]?.id || '',
            selected_eskul: eskul ? String(eskul.id) : '',
            selected_senbud: senbud ? String(senbud.id) : '',
            selected_produktif: produktif ? String(produktif.id) : '',
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editForm.data.selected_eskul) {
            setFormValidationError('Silakan pilih salah satu cabang Ekstrakurikuler.');
            return;
        }
        if (!editForm.data.selected_senbud) {
            setFormValidationError('Silakan pilih salah satu cabang Seni Budaya.');
            return;
        }
        setFormValidationError('');

        const selectedIds = [
            Number(editForm.data.selected_eskul),
            Number(editForm.data.selected_senbud),
            editForm.data.selected_produktif ? Number(editForm.data.selected_produktif) : null,
        ].filter(Boolean);

        editForm.transform((data) => ({
            nis: data.nis,
            name: data.name,
            rayon_id: data.rayon_id,
            eskul_ids: selectedIds,
        })).put(`/admin/students/${editingStudent.id}`, {
            onSuccess: () => {
                setEditingStudent(null);
            },
            onError: (err) => {
                if (err.eskul_ids) {
                    setFormValidationError(err.eskul_ids);
                }
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

    // Helper to evaluate completeness of a student
    const checkStudentStatus = (student) => {
        const studentEskuls = student.eskuls || [];
        const hasE = studentEskuls.some((es) => es.type === 'ESKUL' || es.type === 'PRAMUKA' || (es.type !== 'SENBUD' && es.type !== 'PRODUKTIF'));
        const hasS = studentEskuls.some((es) => es.type === 'SENBUD');
        return { hasE, hasS, isComplete: hasE && hasS };
    };

    const sampleScript = `// Pasang di Google Spreadsheet: Extensions > Apps Script
function onFormSubmit(e) {
  var url = "${typeof window !== 'undefined' ? window.location.origin : 'http://your-domain.com'}/api/gform/webhook";
  var payload = JSON.stringify({
    nis: e.namedValues['NIS'] ? e.namedValues['NIS'][0] : '',
    name: e.namedValues['Nama Lengkap'] ? e.namedValues['Nama Lengkap'][0] : '',
    rayon: e.namedValues['Rayon'] ? e.namedValues['Rayon'][0] : '',
    eskul: e.namedValues['Pilihan Ekstrakurikuler'] ? e.namedValues['Pilihan Ekstrakurikuler'][0] : '',
    senbud: e.namedValues['Pilihan Seni Budaya'] ? e.namedValues['Pilihan Seni Budaya'][0] : ''
  });
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: payload
  });
}`;

    const [copiedScript, setCopiedScript] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(sampleScript);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Data Siswa - SIBAS" />

            <div className="space-y-6">
                {/* Header & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <span>Master Data Peserta Didik</span>
                            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-extrabold rounded-full">
                                Wajib 1 Eskul + 1 Senbud
                            </span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            Kelola NIS, rayon, serta penugasan cabang ekstrakurikuler, seni budaya, dan produktif.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search Bar */}
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

                        {/* Export Excel Button */}
                        <a
                            href="/admin/export/students"
                            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                            title="Unduh seluruh data siswa dalam format Excel (.xlsx)"
                        >
                            <i className="bi bi-file-earmark-arrow-down-fill"></i>
                            <span>Export Excel</span>
                        </a>

                        {/* Import Excel Button */}
                        <input
                            type="file"
                            ref={importFileRef}
                            onChange={handleImportExcel}
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                        />
                        <button
                            onClick={() => importFileRef.current?.click()}
                            className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                            title="Import data siswa dari file Excel/CSV lokal"
                        >
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                            <span>Import Excel</span>
                        </button>

                        {/* Google Spreadsheet Sync Button */}
                        <button
                            onClick={() => setIsGSheetModalOpen(true)}
                            className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                            title="Tarik & Sinkronkan data langsung dari Google Spreadsheet hasil Google Form"
                        >
                            <i className="bi bi-google"></i>
                            <span>Sinkron Spreadsheet (GForm)</span>
                        </button>

                        {/* Add Student Button */}
                        <button
                            onClick={() => {
                                setIsCreateModalOpen(true);
                                setFormValidationError('');
                                createForm.reset({
                                    nis: '',
                                    name: '',
                                    rayon_id: rayons[0]?.id || '',
                                    selected_eskul: '',
                                    selected_senbud: '',
                                    selected_produktif: '',
                                });
                            }}
                            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
                        >
                            <i className="bi bi-person-plus-fill"></i>
                            <span>Tambah Siswa</span>
                        </button>
                    </div>
                </div>

                {/* Clash Warning Banner */}
                {clashCount > 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4 text-amber-900 animate-in fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-amber-950">
                                    Deteksi Jadwal Bentrok: {clashCount} Siswa Terdaftar di Tanggal Bersamaan
                                </h4>
                                <p className="text-xs text-amber-800">
                                    Beberapa siswa mengikuti lebih dari satu kegiatan ekstrakurikuler/senbud yang memiliki jadwal pada tanggal yang sama.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/clash-detection"
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-xs"
                        >
                            <span>Lihat Rincian Bentrok</span>
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">NIS</th>
                                    <th className="pb-3">Nama Siswa</th>
                                    <th className="pb-3">Rayon</th>
                                    <th className="pb-3">Ekstrakurikuler</th>
                                    <th className="pb-3">Seni Budaya</th>
                                    <th className="pb-3">Eskul Produktif</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {studentList.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            <i className="bi bi-inbox text-4xl block mb-2 opacity-50"></i>
                                            Belum ada data siswa. Tambahkan manual, import Excel, atau tarik dari Google Spreadsheet.
                                        </td>
                                    </tr>
                                ) : (
                                    studentList.map((st, idx) => {
                                        const { hasE, hasS, isComplete } = checkStudentStatus(st);
                                        const eskulsOnly = (st.eskuls || []).filter(
                                            (e) => e.type === 'ESKUL' || e.type === 'PRAMUKA' || (!e.type && e.type !== 'SENBUD' && e.type !== 'PRODUKTIF')
                                        );
                                        const senbudsOnly = (st.eskuls || []).filter((e) => e.type === 'SENBUD');
                                        const produktifOnly = (st.eskuls || []).filter((e) => e.type === 'PRODUKTIF');

                                        return (
                                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 font-mono font-bold text-slate-900">{st.nis}</td>
                                                <td className="py-3 font-bold text-slate-800">{st.name}</td>
                                                <td className="py-3">
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                                        {st.rayon?.name || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {eskulsOnly.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {eskulsOnly.map((es, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-[10px] font-bold flex items-center gap-1"
                                                                >
                                                                    <i className="bi bi-award text-sky-600"></i>
                                                                    {es.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-amber-600 font-bold text-[10px] flex items-center gap-1">
                                                            <i className="bi bi-exclamation-circle-fill"></i> Belum pilih eskul
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {senbudsOnly.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {senbudsOnly.map((es, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-[10px] font-bold flex items-center gap-1"
                                                                >
                                                                    <i className="bi bi-palette text-purple-600"></i>
                                                                    {es.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-amber-600 font-bold text-[10px] flex items-center gap-1">
                                                            <i className="bi bi-exclamation-circle-fill"></i> Belum pilih senbud
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {produktifOnly.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {produktifOnly.map((es, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold flex items-center gap-1"
                                                                >
                                                                    <i className="bi bi-cpu text-emerald-600"></i>
                                                                    {es.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px]">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {isComplete ? (
                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-extrabold flex items-center gap-1 w-max">
                                                            <i className="bi bi-check-circle-fill"></i> Lengkap
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-extrabold flex items-center gap-1 w-max">
                                                            <i className="bi bi-exclamation-triangle-fill"></i> Tidak Lengkap
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => handleEditOpen(st)}
                                                        className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                                                        title="Edit Data"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(st.id, st.name)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                                        title="Hapus Data"
                                                    >
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {students?.links && students.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-6 border-t border-slate-100">
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

            {/* MODAL SINKRONISASI GOOGLE SPREADSHEET (GFORM) */}
            {isGSheetModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    <i className="bi bi-google"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">
                                        Sambungkan Google Spreadsheet (Google Form)
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Tarik data respon Google Form langsung ke SIBAS & pastikan tiap murid terdaftar di 1 Eskul & 1 Senbud.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsGSheetModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Direct Sync Form */}
                        <form onSubmit={handleSyncGoogleSheet} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Link / URL Google Spreadsheet (Respon Google Form)
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                                        value={gsheetForm.data.sheet_url}
                                        onChange={(e) => gsheetForm.setData('sheet_url', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    <i className="bi bi-info-circle text-sky-600 mr-1"></i>
                                    Pastikan hak akses spreadsheet diatur ke: <strong>"Siapa saja yang memiliki link"</strong> (Pelihat) agar dapat ditarik oleh sistem.
                                </p>
                                {gsheetForm.errors.sheet_url && (
                                    <p className="text-xs text-rose-600 font-bold mt-1">
                                        {gsheetForm.errors.sheet_url}
                                    </p>
                                )}
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <i className="bi bi-layout-text-window-reverse text-emerald-600"></i>
                                    Format Kolom Spreadsheet yang Didukung Otomatis:
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                                    <div>• <strong>NIS</strong> / Nomor Induk Siswa</div>
                                    <div>• <strong>Nama</strong> / Nama Lengkap Siswa</div>
                                    <div>• <strong>Rayon</strong> / Rombel Rayon</div>
                                    <div>• <strong>Pilihan Ekstrakurikuler</strong> (Wajib 1)</div>
                                    <div>• <strong>Pilihan Seni Budaya</strong> (Wajib 1)</div>
                                </div>
                            </div>

                            {/* Optional: Apps Script Section */}
                            <details className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200/60 text-xs">
                                <summary className="font-bold text-sky-900 cursor-pointer flex items-center justify-between">
                                    <span>⚡ Mau Sinkronisasi Otomatis Setiap Murid Submit GForm? (Opsional)</span>
                                    <span className="text-[10px] text-sky-600">Buka Panduan</span>
                                </summary>
                                <div className="mt-3 space-y-2 text-[11px] text-sky-950">
                                    <p>
                                        Buka Google Spreadsheet respon &gt; Menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>Apps Script</strong>.
                                        Paste script di bawah ini lalu pasang Trigger <strong>On form submit</strong>:
                                    </p>
                                    <div className="relative">
                                        <pre className="p-3 bg-slate-900 text-sky-200 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed">
                                            {sampleScript}
                                        </pre>
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-bold"
                                        >
                                            {copiedScript ? 'Tersalin! ✅' : 'Salin Script'}
                                        </button>
                                    </div>
                                </div>
                            </details>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsGSheetModalOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="submit"
                                    disabled={gsheetForm.processing}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                                >
                                    <i className="bi bi-arrow-repeat"></i>
                                    <span>{gsheetForm.processing ? 'Menyinkronkan...' : 'Tarik & Sinkronkan Sekarang'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Tambah Peserta Didik Baru</h3>
                                <p className="text-[11px] text-slate-500">
                                    Pilih Ekstrakurikuler dan Seni Budaya wajib, serta Ekstrakurikuler Produktif (opsional).
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {formValidationError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                                <i className="bi bi-exclamation-octagon-fill text-rose-600"></i>
                                <span>{formValidationError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700">NIS (Nomor Induk) <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: 12301001"
                                        value={createForm.data.nis}
                                        onChange={(e) => createForm.setData('nis', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                    {createForm.errors.nis && (
                                        <p className="text-rose-600 font-bold mt-1 text-[11px]">{createForm.errors.nis}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700">Rayon Wilayah <span className="text-rose-500">*</span></label>
                                    <select
                                        value={createForm.data.rayon_id}
                                        onChange={(e) => createForm.setData('rayon_id', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    >
                                        {rayons.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Nama Lengkap Siswa <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Ahmad Rizki Pratama"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                                {createForm.errors.name && (
                                    <p className="text-rose-600 font-bold mt-1 text-[11px]">{createForm.errors.name}</p>
                                )}
                            </div>

                            {/* Section 1: Dropdown Ekstrakurikuler (Wajib) */}
                            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                                        <i className="bi bi-award-fill text-sky-600"></i>
                                        1. Pilihan Ekstrakurikuler <span className="text-rose-500">*</span>
                                    </span>
                                    {createForm.data.selected_eskul ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                            ⚠️ Wajib Dipilih
                                        </span>
                                    )}
                                </div>
                                <select
                                    required
                                    value={createForm.data.selected_eskul}
                                    onChange={(e) => createForm.setData('selected_eskul', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                                >
                                    <option value="">-- Pilih Cabang Ekstrakurikuler --</option>
                                    {eskulOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {eskulOptions.length === 0 && (
                                    <p className="text-[11px] text-amber-600 font-semibold">
                                        ⚠️ Belum ada cabang ekstrakurikuler dibuat di Master Eskul.
                                    </p>
                                )}
                            </div>

                            {/* Section 2: Dropdown Seni Budaya (Wajib) */}
                            <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                                        <i className="bi bi-palette-fill text-purple-600"></i>
                                        2. Pilihan Seni Budaya <span className="text-rose-500">*</span>
                                    </span>
                                    {createForm.data.selected_senbud ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                            ⚠️ Wajib Dipilih
                                        </span>
                                    )}
                                </div>
                                <select
                                    required
                                    value={createForm.data.selected_senbud}
                                    onChange={(e) => createForm.setData('selected_senbud', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800"
                                >
                                    <option value="">-- Pilih Cabang Seni Budaya --</option>
                                    {senbudOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {senbudOptions.length === 0 && (
                                    <p className="text-[11px] text-amber-600 font-semibold">
                                        ⚠️ Belum ada cabang seni budaya dibuat di Master Eskul.
                                    </p>
                                )}
                            </div>

                            {/* Section 3: Dropdown Ekstrakurikuler Produktif (Opsional) */}
                            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                                        <i className="bi bi-cpu-fill text-emerald-600"></i>
                                        3. Pilihan Ekstrakurikuler Produktif <span className="text-slate-400 font-normal text-[10px]">(Opsional)</span>
                                    </span>
                                    {createForm.data.selected_produktif ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            Opsional
                                        </span>
                                    )}
                                </div>
                                <select
                                    value={createForm.data.selected_produktif}
                                    onChange={(e) => createForm.setData('selected_produktif', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                >
                                    <option value="">-- Tidak Mengambil / Pilih Eskul Produktif --</option>
                                    {produktifOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <i className="bi bi-check-lg"></i>
                                    <span>Simpan Siswa</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Edit Data Siswa</h3>
                                <p className="text-[11px] text-slate-500">
                                    Pilih Ekstrakurikuler dan Seni Budaya wajib, serta Ekstrakurikuler Produktif (opsional).
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingStudent(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {formValidationError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                                <i className="bi bi-exclamation-octagon-fill text-rose-600"></i>
                                <span>{formValidationError}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700">NIS (Nomor Induk) <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.nis}
                                        onChange={(e) => editForm.setData('nis', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    />
                                    {editForm.errors.nis && (
                                        <p className="text-rose-600 font-bold mt-1 text-[11px]">{editForm.errors.nis}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700">Rayon Wilayah <span className="text-rose-500">*</span></label>
                                    <select
                                        value={editForm.data.rayon_id}
                                        onChange={(e) => editForm.setData('rayon_id', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    >
                                        {rayons.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-700">Nama Lengkap Siswa <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                                {editForm.errors.name && (
                                    <p className="text-rose-600 font-bold mt-1 text-[11px]">{editForm.errors.name}</p>
                                )}
                            </div>

                            {/* Section 1: Dropdown Ekstrakurikuler */}
                            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                                        <i className="bi bi-award-fill text-sky-600"></i>
                                        1. Pilihan Ekstrakurikuler <span className="text-rose-500">*</span>
                                    </span>
                                    {editForm.data.selected_eskul ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                            ⚠️ Wajib Dipilih
                                        </span>
                                    )}
                                </div>
                                <select
                                    required
                                    value={editForm.data.selected_eskul}
                                    onChange={(e) => editForm.setData('selected_eskul', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                                >
                                    <option value="">-- Pilih Cabang Ekstrakurikuler --</option>
                                    {eskulOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section 2: Dropdown Seni Budaya */}
                            <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                                        <i className="bi bi-palette-fill text-purple-600"></i>
                                        2. Pilihan Seni Budaya <span className="text-rose-500">*</span>
                                    </span>
                                    {editForm.data.selected_senbud ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                            ⚠️ Wajib Dipilih
                                        </span>
                                    )}
                                </div>
                                <select
                                    required
                                    value={editForm.data.selected_senbud}
                                    onChange={(e) => editForm.setData('selected_senbud', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800"
                                >
                                    <option value="">-- Pilih Cabang Seni Budaya --</option>
                                    {senbudOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section 3: Dropdown Ekstrakurikuler Produktif (Opsional) */}
                            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                                        <i className="bi bi-cpu-fill text-emerald-600"></i>
                                        3. Pilihan Ekstrakurikuler Produktif <span className="text-slate-400 font-normal text-[10px]">(Opsional)</span>
                                    </span>
                                    {editForm.data.selected_produktif ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            ✅ Terpilih
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            Opsional
                                        </span>
                                    )}
                                </div>
                                <select
                                    value={editForm.data.selected_produktif}
                                    onChange={(e) => editForm.setData('selected_produktif', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                                >
                                    <option value="">-- Tidak Mengambil / Pilih Eskul Produktif --</option>
                                    {produktifOptions.map((es) => (
                                        <option key={es.id} value={es.id}>
                                            {es.name} {es.instruktur ? `(Instruktur: ${es.instruktur.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <i className="bi bi-save"></i>
                                    <span>Perbarui Siswa</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
