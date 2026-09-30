import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function NotFound({ attemptedUrl = '', dashboardUrl = '/dashboard' }) {
    const [animIn, setAnimIn] = useState(false);

    useEffect(() => {
        setAnimIn(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0e1726] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="404 - Halaman Tidak Ditemukan | SIBAS" />

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-900/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

            {/* SIBAS Logo */}
            <div className="absolute top-6 left-6 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0077b6] flex items-center justify-center shadow-lg shadow-sky-900/40">
                    <i className="bi bi-shield-check text-white text-base" />
                </div>
                <span className="text-white font-extrabold text-sm tracking-wide">SIBAS</span>
            </div>

            {/* Main Card */}
            <div
                className={`relative w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-700 ${
                    animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Giant 404 */}
                <div className="text-center mb-4">
                    <div
                        className="text-8xl sm:text-9xl font-black text-transparent select-none leading-none"
                        style={{ WebkitTextStroke: '2px rgba(99,102,241,0.4)' }}
                    >
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                        <i className="bi bi-compass text-3xl text-indigo-400" />
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-xl sm:text-2xl font-black text-white text-center leading-tight">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-slate-400 text-center text-xs font-medium mt-3 leading-relaxed max-w-sm mx-auto">
                    Halaman yang Anda cari tidak ada, telah dipindahkan, atau URL yang dimasukkan tidak valid.
                </p>

                {/* Attempted URL */}
                {attemptedUrl && (
                    <div className="mt-5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5">
                        <i className="bi bi-link-45deg text-slate-500 text-base shrink-0" />
                        <div className="overflow-hidden">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">URL yang Dicoba</div>
                            <div className="text-xs text-slate-400 font-mono truncate">/{attemptedUrl}</div>
                        </div>
                    </div>
                )}

                <div className="border-t border-white/10 my-6" />

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={dashboardUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#0077b6] hover:bg-[#005b96] text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-sky-900/40 hover:-translate-y-0.5"
                    >
                        <i className="bi bi-grid-fill" />
                        Ke Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl text-xs font-bold transition-all"
                    >
                        <i className="bi bi-house-fill" />
                        Portal Publik
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-[11px] text-slate-600 text-center">
                © SIBAS — Sistem Absensi Ekstrakurikuler & Seni Budaya
            </p>
        </div>
    );
}
