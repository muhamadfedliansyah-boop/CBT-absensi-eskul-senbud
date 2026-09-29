import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DashboardIndex({ user }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard - SIBAS" />

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-2xl font-black text-slate-900">Selamat Datang, {user?.name}!</h2>
                <p className="text-xs text-slate-500">
                    Anda masuk ke sistem SIBAS dengan status peran: <span className="font-bold text-sky-700">{user?.role?.name || 'Pengguna'}</span>.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                        Buka Portal Beranda
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
