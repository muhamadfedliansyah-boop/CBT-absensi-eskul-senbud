import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children, title = 'SIBAS Dashboard' }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(true);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const roleName = user.role?.toLowerCase() || '';
    const isAdmin = roleName.includes('admin') || roleName.includes('koordinator');
    const isInstruktur = roleName.includes('instruktur') || roleName.includes('pembina');
    const isPS = roleName.includes('pembimbing') || roleName.includes('ps');

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: 'bi-grid-1x2-fill', show: true },
        // Admin Navigation
        { label: 'Master Eskul', href: '/admin/eskul', icon: 'bi-palette-fill', show: isAdmin },
        { label: 'Data Siswa', href: '/admin/students', icon: 'bi-people-fill', show: isAdmin },
        { label: 'Rayon & Wilayah', href: '/admin/rayons', icon: 'bi-geo-alt-fill', show: isAdmin },
        { label: 'Pengguna & Guru', href: '/admin/users', icon: 'bi-person-gear', show: isAdmin },
        { label: 'Jadwal & Ruangan', href: '/admin/schedules', icon: 'bi-calendar3-event-fill', show: isAdmin },
        { label: 'Rekap Presensi', href: '/admin/rekapitulasi', icon: 'bi-bar-chart-line-fill', show: isAdmin },
        // Instruktur Navigation
        { label: 'Eskul Saya', href: '/instruktur/my-eskul', icon: 'bi-journal-check', show: isInstruktur },
        // PS Navigation
        { label: 'Rayon Bimbingan', href: '/ps/rayon', icon: 'bi-person-lines-fill', show: isPS },
        { label: 'Kelola Dispensasi', href: '/ps/dispensasi', icon: 'bi-file-earmark-medical-fill', show: isPS },
        { label: 'Laporan Rayon', href: '/ps/laporan', icon: 'bi-printer-fill', show: isPS },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            {/* TOP HEADER */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Project Name */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
                            </button>

                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                                    SB
                                </div>
                                <div>
                                    <h1 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                                        SIBAS
                                    </h1>
                                    <p className="text-[10px] font-semibold text-slate-400 leading-none">
                                        Seni Budaya & Eskul
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* User Menu & Logout */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 rounded-xl transition-all border border-slate-200/60"
                            >
                                <i className="bi bi-globe2"></i>
                                Portal Siswa
                            </Link>

                            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                                <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-xs font-bold text-slate-800 leading-tight">
                                        {user.name}
                                    </div>
                                    <div className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider">
                                        {user.role || 'Petugas'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                title="Keluar dari sistem"
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                            >
                                <i className="bi bi-box-arrow-right text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* BODY WITH SIDEBAR & CONTENT */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
                {/* DESKTOP SIDEBAR */}
                <aside className="hidden md:block w-64 shrink-0 space-y-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1 sticky top-24">
                        <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            Menu Utama
                        </div>
                        {navItems.filter(item => item.show).map((item, idx) => {
                            const isActive = window.location.pathname === item.href;
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#004e7c] text-white shadow-md shadow-sky-900/15'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                    }`}
                                >
                                    <i className={`bi ${item.icon} text-base ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* MOBILE DRAWER */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-1">
                        {navItems.filter(item => item.show).map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                            >
                                <i className={`bi ${item.icon} text-slate-400`}></i>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 min-w-0 space-y-6">
                    {/* FLASH MESSAGES */}
                    {flash?.success && flashVisible && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between animate-in fade-in">
                            <div className="flex items-center gap-2.5">
                                <i className="bi bi-check-circle-fill text-emerald-600 text-base"></i>
                                <span>{flash.success}</span>
                            </div>
                            <button onClick={() => setFlashVisible(false)} className="text-emerald-600 hover:text-emerald-900">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    )}

                    {flash?.error && flashVisible && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center justify-between animate-in fade-in">
                            <div className="flex items-center gap-2.5">
                                <i className="bi bi-exclamation-octagon-fill text-rose-600 text-base"></i>
                                <span>{flash.error}</span>
                            </div>
                            <button onClick={() => setFlashVisible(false)} className="text-rose-600 hover:text-rose-900">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    )}

                    {children}
                </main>
            </div>

            {/* FOOTER */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">SIBAS</span>
                        <span>• Sistem Informasi & Presensi Seni Budaya / Eskul</span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Presensi Cloud Digital
                    </div>
                </div>
            </footer>
        </div>
    );
}
