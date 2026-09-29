import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef5fb] to-[#f4f9fd] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased text-slate-800">
            <Head title="Login - SIBAS" />

            {/* MAIN AUTHENTICATION CONTAINER */}
            <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-sky-950/15 overflow-hidden flex flex-col md:flex-row border border-slate-100 transition-all">
                
                {/* LEFT SIDE: BLUE GEOMETRIC BRANDING & TAB NAVIGATION */}
                <div className="md:w-[42%] geometric-bg p-8 sm:p-10 flex flex-col justify-between relative text-white min-h-[380px] md:min-h-[560px]">
                    {/* Top Branding Header */}
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center font-black text-sm text-white shadow-inner">
                            SB
                        </div>
                        <div>
                            <h2 className="font-extrabold text-base tracking-tight leading-none text-white">SIBAS</h2>
                            <p className="text-[11px] text-white/80 font-medium mt-1">Seni Budaya & Absensi Eskul</p>
                        </div>
                    </div>

                    {/* Center Tab Notches (Switch between Login and Register) */}
                    <div className="my-auto py-8 relative z-10 flex flex-col items-end gap-3 -mr-8 sm:-mr-10">
                        {/* LOGIN TAB (Active Notch) */}
                        <div className="w-48 bg-white py-2.5 px-6 rounded-l-full shadow-lg flex items-center justify-start transition-all transform translate-x-0">
                            <span className="font-black text-xs sm:text-sm tracking-wider text-[#005b96] uppercase">LOGIN</span>
                        </div>

                        {/* REGISTER TAB (Inactive Notch) */}
                        <Link
                            href="/register"
                            className="w-44 py-2.5 px-6 rounded-l-full flex items-center justify-start text-white/80 hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all hover:bg-white/10 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">REGISTER</span>
                        </Link>
                    </div>

                    {/* Bottom Left Sub-Footer */}
                    <div className="relative z-10 pt-4 border-t border-white/15">
                        <p className="text-[10px] text-white/70 leading-relaxed">
                            © {new Date().getFullYear()} Sistem Absensi & Jurnal<br />
                            SMK/SMA Negeri Presensi Cloud
                        </p>
                    </div>

                    {/* Decorative Polygon Shapes */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="0,200 400,100 400,600 0,600" fill="white" opacity="0.05" />
                            <polygon points="100,0 400,0 300,400 0,200" fill="white" opacity="0.07" />
                            <polygon points="0,400 400,300 400,600 0,600" fill="white" opacity="0.05" />
                        </svg>
                    </div>
                </div>

                {/* RIGHT SIDE: LOGIN FORM */}
                <div className="md:w-[58%] bg-white p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                        {/* Avatar & Title */}
                        <div className="text-center space-y-1.5">
                            <div className="w-16 h-16 rounded-full bg-[#0077b6] text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-sky-600/25 mb-3">
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">LOGIN</h1>
                            <p className="text-xs font-semibold text-slate-400">Portal Petugas, Instruktur & Guru SIBAS</p>
                        </div>

                        {/* Error Alert */}
                        {errors.email && (
                            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2 animate-in fade-in">
                                <i className="bi bi-exclamation-triangle-fill text-rose-600 text-sm mt-0.5 shrink-0"></i>
                                <div>{errors.email}</div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-6 pt-2">
                            {/* Input 1: Email */}
                            <div className="space-y-1.5">
                                <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2">
                                    <span className="text-slate-400 text-base mr-3">
                                        <i className="bi bi-person-fill"></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="Email Resmi / NISN / NIP"
                                        className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Input 2: Password */}
                            <div className="space-y-1.5">
                                <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2">
                                    <span className="text-slate-400 text-base mr-3">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Password Keamanan"
                                        className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-8"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 text-slate-400 hover:text-slate-600"
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-sm`}></i>
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="text-[11px] text-rose-600 font-semibold">{errors.password}</div>
                                )}
                            </div>

                            {/* Options: Remember Me */}
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-[#0077b6] focus:ring-[#0077b6]"
                                    />
                                    <span>Ingat saya</span>
                                </label>
                                <Link href="/" className="hover:text-[#0077b6] font-semibold transition-colors">
                                    Kembali ke Beranda
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#0077b6] hover:bg-[#005b96] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'MASUK KE AKUN'}
                            </button>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-slate-400">
                            Belum memiliki akun instruktur?{' '}
                            <Link href="/register" className="text-sky-600 font-bold hover:underline">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
