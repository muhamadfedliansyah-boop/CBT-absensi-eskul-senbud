import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Forbidden({
    userRole = 'Tidak Diketahui',
    requiredRoles = [],
    attemptedUrl = '',
    dashboardUrl = '/dashboard',
    message = null,
}) {
    const [count, setCount] = useState(10);
    const [animIn, setAnimIn] = useState(false);

    // Countdown auto-redirect
    useEffect(() => {
        setAnimIn(true);
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    window.location.href = dashboardUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [dashboardUrl]);

    const roleIcons = {
        'Administrator Kesiswaan': 'bi-shield-lock-fill',
        'Koordinator Kesiswaan': 'bi-diagram-3-fill',
        'Instruktur Eskul & Senbud': 'bi-award-fill',
        'Pembina Ekstrakurikuler': 'bi-patch-check-fill',
        'Pembimbing Siswa (PS)': 'bi-person-badge-fill',
        'Pembimbing Siswa': 'bi-person-badge-fill',
        'Guru / Wali Kelas': 'bi-mortarboard-fill',
        'Laboran': 'bi-eyedropper',
    };

    return (
        <div className="min-h-screen bg-[#0e1726] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="403 - Akses Ditolak | SIBAS" />

            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-900/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

            {/* SIBAS Logo strip */}
            <div className="absolute top-6 left-6 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0077b6] flex items-center justify-center shadow-lg shadow-sky-900/40">
                    <i className="bi bi-shield-check text-white text-base" />
                </div>
                <span className="text-white font-extrabold text-sm tracking-wide">SIBAS</span>
                <span className="text-slate-500 text-xs font-medium hidden sm:block">Sistem Absensi Eskul</span>
            </div>

            {/* Main Card */}
            <div
                className={`relative w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-700 ${
                    animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                            <i className="bi bi-shield-x text-5xl text-rose-400" />
                        </div>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-3xl border-2 border-rose-500/30 animate-ping opacity-30" />
                    </div>
                </div>

                {/* Error Code */}
                <div className="text-center mb-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-rose-400 text-[11px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                        Error 403 — Akses Ditolak
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-white text-center mt-4 leading-tight">
                    Anda Tidak Memiliki<br />
                    <span className="text-rose-400">Izin Akses</span> ke Halaman Ini
                </h1>

                <p className="text-slate-400 text-center text-xs font-medium mt-3 leading-relaxed">
                    Halaman yang Anda coba akses hanya diperuntukkan bagi peran tertentu dalam sistem SIBAS.
                    Silakan kembali ke dashboard atau hubungi Administrator.
                </p>

                {/* Custom message from abort(403) */}
                {message && (
                    <div className="mt-4 mx-auto max-w-sm px-4 py-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-2.5">
                        <i className="bi bi-info-circle-fill text-rose-400 text-sm shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-300 font-medium leading-relaxed">{message}</p>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/10 my-6" />

                {/* Role Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* User's Current Role */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Role Anda Saat Ini
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                                <i className="bi bi-person-circle text-slate-300 text-sm" />
                            </div>
                            <div>
                                <div className="font-bold text-white">{userRole}</div>
                                <div className="text-[10px] text-slate-500">Akun Aktif Anda</div>
                            </div>
                        </div>
                    </div>

                    {/* Required Roles */}
                    <div className="bg-white/5 border border-rose-500/20 rounded-2xl p-4 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-rose-400/70">
                            Akses Dibutuhkan
                        </div>
                        <div className="space-y-1.5">
                            {requiredRoles.length > 0 ? (
                                requiredRoles.map((role, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-rose-500/15 flex items-center justify-center shrink-0">
                                            <i className={`bi ${roleIcons[role] || 'bi-lock-fill'} text-rose-400 text-[11px]`} />
                                        </div>
                                        <span className="font-semibold text-slate-300 text-[11px]">{role}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-500 text-[11px]">Tidak ada role yang memenuhi syarat</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attempted URL */}
                {attemptedUrl && (
                    <div className="mt-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5">
                        <i className="bi bi-link-45deg text-slate-500 text-base shrink-0" />
                        <div className="overflow-hidden">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Halaman yang Dicoba</div>
                            <div className="text-xs text-slate-400 font-mono truncate">/{attemptedUrl}</div>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/10 my-6" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={dashboardUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#0077b6] hover:bg-[#005b96] text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-sky-900/40 hover:shadow-sky-900/60 hover:-translate-y-0.5"
                    >
                        <i className="bi bi-grid-fill" />
                        Kembali ke Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl text-xs font-bold transition-all"
                    >
                        <i className="bi bi-arrow-left" />
                        Halaman Sebelumnya
                    </button>
                </div>

                {/* Auto-redirect countdown */}
                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <div className="relative w-5 h-5 shrink-0">
                        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" fill="none" stroke="#334155" strokeWidth="2" />
                            <circle
                                cx="10" cy="10" r="8" fill="none"
                                stroke="#0077b6" strokeWidth="2"
                                strokeDasharray={`${(count / 10) * 50.27} 50.27`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-sky-400">{count}</span>
                    </div>
                    <span>Dialihkan otomatis ke dashboard dalam <strong className="text-sky-400">{count} detik</strong>...</span>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-[11px] text-slate-600 text-center">
                Butuh bantuan? Hubungi{' '}
                <span className="text-sky-500 font-bold cursor-pointer hover:underline">
                    Administrator SIBAS
                </span>
            </p>
        </div>
    );
}
