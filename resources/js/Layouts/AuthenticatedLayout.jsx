import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children, title = 'SIBAS Dashboard' }) {
    const { auth, flash } = usePage().props;
    const { url } = usePage();
    const user = auth?.user || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(true);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const roleName = (user.role || '').toLowerCase();
    const isAdmin = roleName.includes('admin') || roleName.includes('koordinator');
    const isInstruktur = roleName.includes('instruktur') || roleName.includes('pembina');
    const isPS = roleName.includes('pembimbing') || roleName.includes('ps') || roleName.includes('guru') || roleName.includes('laboran');

    const userInitials = (user.name || 'User')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const roleDisplayName = isAdmin
        ? 'Administrator Kesiswaan'
        : isPS
        ? 'Pembimbing Siswa (PS)'
        : 'Instruktur Eskul & Senbud';

    // Helper to determine active state of navigation links
    const isActive = (path) => {
        if (path === '/dashboard') return url === '/dashboard';
        return url.startsWith(path);
    };

    const navLinkClass = (path) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
            isActive(path)
                ? 'bg-[#0077b6] text-white font-bold shadow-md shadow-sky-900/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
        }`;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased">
            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* Left: Mobile Toggle & Breadcrumb / Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0077b6] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-sky-600/20">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <span className="font-extrabold text-slate-800">SIBAS</span>
                                    <i className="bi bi-chevron-right text-[10px] text-slate-400"></i>
                                    <span>
                                        {isAdmin ? 'Administrasi Pusat' : isPS ? 'Panel Pembimbing Siswa' : 'Panel Instruktur'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick Links & User Dropdown Info */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                target="_blank"
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
                            >
                                <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                                <span>Lihat Portal Publik</span>
                            </Link>

                            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                            {/* User Profile Tag */}
                            <div className="flex items-center gap-2.5 pl-2">
                                <div className="w-8 h-8 rounded-full bg-[#0077b6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {userInitials}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="font-bold text-xs text-slate-900 leading-tight">
                                        {user.name || 'Pengguna'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold leading-tight">
                                        {roleDisplayName}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                title="Keluar dari akun"
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                            >
                                <i className="bi bi-box-arrow-right text-base"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN APP SHELL: SIDEBAR + CONTENT */}
            <div className="flex-1 flex flex-col lg:flex-row w-full">

                {/* ========================================================= */}
                {/* SIDEBAR NAVIGATION                                        */}
                {/* ========================================================= */}
                <aside className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden'} w-full lg:w-64 shrink-0 bg-[#0e1726] text-slate-300 p-5 space-y-6 flex flex-col justify-between`}>
                    
                    <div className="space-y-6">
                        {/* Sidebar Brand / User Header */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-[#0077b6] text-white flex items-center justify-center font-black text-sm shadow-inner shrink-0">
                                {userInitials}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-xs text-white truncate">
                                    {user.name || 'Pengguna SIBAS'}
                                </h3>
                                <p className="text-[10px] text-slate-400 truncate">
                                    {roleDisplayName}
                                </p>
                            </div>
                        </div>

                        {/* ===================================================== */}
                        {/* A. NAV LINKS: ADMIN                                   */}
                        {/* ===================================================== */}
                        {isAdmin && (
                            <nav className="space-y-4 text-xs">
                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">DASHBOARD</div>
                                    <Link href="/dashboard" prefetch className={navLinkClass('/dashboard')}>
                                        <i className="bi bi-grid-fill"></i>
                                        <span>Dashboard Ringkasan</span>
                                    </Link>
                                </div>

                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">DATA MASTER</div>
                                    <div className="space-y-1">
                                        <Link href="/admin/eskul" prefetch className={navLinkClass('/admin/eskul')}>
                                            <i className="bi bi-palette-fill text-slate-400"></i>
                                            <span>Ekstrakurikuler</span>
                                        </Link>
                                        <Link href="/admin/students" prefetch className={navLinkClass('/admin/students')}>
                                            <i className="bi bi-mortarboard-fill text-slate-400"></i>
                                            <span>Data Siswa</span>
                                        </Link>
                                        <Link href="/admin/rayons" prefetch className={navLinkClass('/admin/rayons')}>
                                            <i className="bi bi-geo-alt-fill text-slate-400"></i>
                                            <span>Rayon & Pembimbing</span>
                                        </Link>
                                        <Link href="/admin/users" prefetch className={navLinkClass('/admin/users')}>
                                            <i className="bi bi-person-badge-fill text-slate-400"></i>
                                            <span>Pegawai & Pengguna</span>
                                        </Link>
                                        <Link href="/admin/schedules" prefetch className={navLinkClass('/admin/schedules')}>
                                            <i className="bi bi-calendar3 text-slate-400"></i>
                                            <span>Jadwal & Ruangan</span>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">PEMANTAUAN & LAPORAN</div>
                                    <div className="space-y-1">
                                        <Link href="/admin/galeri" prefetch className={navLinkClass('/admin/galeri')}>
                                            <i className="bi bi-images text-purple-400"></i>
                                            <span>Galeri Foto Kegiatan</span>
                                        </Link>
                                        <Link href="/admin/clash-detection" prefetch className={navLinkClass('/admin/clash-detection')}>
                                            <i className="bi bi-exclamation-triangle-fill text-amber-400"></i>
                                            <span>Peringatan Bentrok</span>
                                        </Link>
                                        <Link href="/admin/rekapitulasi" prefetch className={navLinkClass('/admin/rekapitulasi')}>
                                            <i className="bi bi-file-earmark-spreadsheet-fill text-emerald-400"></i>
                                            <span>Rekap & Export Absensi</span>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        )}

                        {/* ===================================================== */}
                        {/* B. NAV LINKS: PEMBIMBING SISWA (PS / GURU / LABORAN) */}
                        {/* ===================================================== */}
                        {isPS && (
                            <nav className="space-y-4 text-xs">
                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">DASHBOARD</div>
                                    <Link href="/dashboard" prefetch className={navLinkClass('/dashboard')}>
                                        <i className="bi bi-grid-fill"></i>
                                        <span>Dashboard Pembimbing</span>
                                    </Link>
                                </div>

                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">MONITORING & DISPENSASI</div>
                                    <div className="space-y-1">
                                        <Link href="/ps/monitoring-rayon" prefetch className={navLinkClass('/ps/monitoring-rayon')}>
                                            <i className="bi bi-people-fill text-sky-400"></i>
                                            <span>Monitoring Siswa Rayon</span>
                                        </Link>
                                        <Link href="/ps/dispensasi" prefetch className={navLinkClass('/ps/dispensasi')}>
                                            <i className="bi bi-file-earmark-medical-fill text-emerald-400"></i>
                                            <span>Dispensasi & Izin</span>
                                        </Link>
                                        <Link href="/ps/laporan" prefetch className={navLinkClass('/ps/laporan')}>
                                            <i className="bi bi-calendar3-range-fill text-amber-400"></i>
                                            <span>Laporan Keaktifan</span>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        )}

                        {/* ===================================================== */}
                        {/* C. NAV LINKS: INSTRUKTUR                              */}
                        {/* ===================================================== */}
                        {isInstruktur && (
                            <nav className="space-y-4 text-xs">
                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">DASHBOARD</div>
                                    <Link href="/dashboard" prefetch className={navLinkClass('/dashboard')}>
                                        <i className="bi bi-grid-fill"></i>
                                        <span>Dashboard Instruktur</span>
                                    </Link>
                                </div>

                                <div>
                                    <div className="px-3 py-1 text-[10px] font-black text-slate-400 tracking-wider uppercase">KEGIATAN & PRESENSI</div>
                                    <div className="space-y-1">
                                        <Link href="/instruktur/my-eskul" prefetch className={navLinkClass('/instruktur/my-eskul')}>
                                            <i className="bi bi-award-fill text-sky-400"></i>
                                            <span>Ekstrakurikuler Saya</span>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        )}
                    </div>

                    {/* Bottom Logout link */}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                        >
                            <i className="bi bi-box-arrow-left"></i>
                            <span>Keluar Aplikasi</span>
                        </button>
                    </div>

                </aside>

                {/* ========================================================= */}
                {/* MAIN CONTENT AREA                                         */}
                {/* ========================================================= */}
                <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
                    {/* FLASH MESSAGES */}
                    {flash?.success && flashVisible && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <i className="bi bi-check-circle-fill text-emerald-600 text-base"></i>
                                <span>{flash.success}</span>
                            </div>
                            <button
                                onClick={() => setFlashVisible(false)}
                                className="text-emerald-500 hover:text-emerald-700 p-1"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    )}

                    {flash?.error && flashVisible && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <i className="bi bi-exclamation-triangle-fill text-rose-600 text-base"></i>
                                <span>{flash.error}</span>
                            </div>
                            <button
                                onClick={() => setFlashVisible(false)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    )}

                    {/* RENDER ACTIVE PAGE CONTENT */}
                    {children}
                </main>
            </div>
        </div>
    );
}
