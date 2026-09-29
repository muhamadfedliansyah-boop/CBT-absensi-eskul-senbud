<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - SIBAS Pendaftaran Akun Instruktur</title>
    
    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            blue: '#0077b6',
                            darkBlue: '#005b96',
                            deep: '#013a63',
                            light: '#e0f2fe',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #eef5fb 0%, #f4f9fd 100%);
        }
        .geometric-bg {
            background: linear-gradient(135deg, #0077b6 0%, #006094 50%, #004e7c 100%);
            position: relative;
            overflow: hidden;
        }
        .geometric-bg::before {
            content: '';
            position: absolute;
            top: -20%;
            right: -20%;
            width: 140%;
            height: 140%;
            background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%),
                        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
            pointer-events: none;
        }
        .active-tab-notch {
            box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">

    <!-- MAIN AUTHENTICATION CONTAINER -->
    <div class="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-sky-950/15 overflow-hidden flex flex-col md:flex-row border border-slate-100 transition-all">

        <!-- ========================================================= -->
        <!-- LEFT SIDE: BLUE GEOMETRIC BRANDING & TAB NAVIGATION       -->
        <!-- ========================================================= -->
        <div class="md:w-[42%] geometric-bg p-8 sm:p-10 flex flex-col justify-between relative text-white min-h-[380px] md:min-h-[640px]">
            
            <!-- Top Branding Header -->
            <div class="flex items-center gap-3 relative z-10">
                <div class="w-10 h-10 rounded-xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center font-black text-sm text-white shadow-inner">
                    SB
                </div>
                <div>
                    <h2 class="font-extrabold text-base tracking-tight leading-none text-white">SIBAS</h2>
                    <p class="text-[11px] text-white/80 font-medium mt-1">Seni Budaya & Absensi Eskul</p>
                </div>
            </div>

            <!-- Center Tab Notches (Switch between Login and Register) -->
            <div class="my-auto py-8 relative z-10 flex flex-col items-end gap-3 -mr-8 sm:-mr-10">
                
                <!-- LOGIN TAB (Inactive Notch) -->
                <a href="{{ route('login') }}" class="w-44 py-2.5 px-6 rounded-l-full flex items-center justify-start text-white/80 hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all hover:bg-white/10 group">
                    <span class="group-hover:translate-x-1 transition-transform">LOGIN</span>
                </a>

                <!-- REGISTER TAB (Active Notch) -->
                <div class="w-48 bg-white py-2.5 px-6 rounded-l-full shadow-lg active-tab-notch flex items-center justify-start transition-all transform translate-x-0">
                    <span class="font-black text-xs sm:text-sm tracking-wider text-[#005b96] uppercase">REGISTER</span>
                </div>

            </div>

            <!-- Bottom Left Sub-Footer -->
            <div class="relative z-10 pt-4 border-t border-white/15">
                <p class="text-[10px] text-white/70 leading-relaxed">
                    © 2025 Sistem Absensi & Jurnal<br />
                    SMK/SMA Negeri Presensi Cloud
                </p>
            </div>

            <!-- Decorative Polygon Shapes -->
            <div class="absolute inset-0 opacity-20 pointer-events-none">
                <svg class="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,200 400,100 400,600 0,600" fill="white" opacity="0.05" />
                    <polygon points="100,0 400,0 300,400 0,200" fill="white" opacity="0.07" />
                    <polygon points="0,400 400,300 400,600 0,600" fill="white" opacity="0.05" />
                </svg>
            </div>
        </div>


        <!-- ========================================================= -->
        <!-- RIGHT SIDE: REGISTER FORM                                 -->
        <!-- ========================================================= -->
        <div class="md:w-[58%] bg-white p-8 sm:p-12 flex flex-col justify-between space-y-6">

            <!-- Form Content Top -->
            <div class="space-y-5">
                
                <!-- Avatar & Title -->
                <div class="text-center space-y-1.5">
                    <div class="w-16 h-16 rounded-full bg-white text-[#0077b6] border-2 border-[#0077b6] flex items-center justify-center mx-auto text-2xl shadow-lg shadow-sky-600/15 mb-3">
                        <i class="bi bi-person-plus-fill"></i>
                    </div>
                    <h1 class="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">REGISTER</h1>
                    <p class="text-xs font-semibold text-slate-400">Pendaftaran Akun Baru Petugas & Guru</p>
                </div>

                <!-- Alert Messages -->
                @if($errors->any())
                <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2 animate-in fade-in">
                    <i class="bi bi-exclamation-triangle-fill text-rose-600 text-sm mt-0.5"></i>
                    <div>{{ $errors->first() }}</div>
                </div>
                @endif

                <!-- Register Form -->
                <form action="{{ route('register.post') }}" method="POST" class="space-y-4 pt-1">
                    @csrf

                    <!-- Input 1: Nama Lengkap & Gelar -->
                    <div class="space-y-1">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-1.5">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-person-fill"></i>
                            </span>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value="{{ old('name') }}" 
                                required 
                                placeholder="Nama Lengkap & Gelar" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                            >
                        </div>
                    </div>

                    <!-- Input 2: Email Resmi Sekolah / NIP / NISN -->
                    <div class="space-y-1">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-1.5">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-envelope-fill"></i>
                            </span>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value="{{ old('email') }}" 
                                required 
                                placeholder="Email Resmi Sekolah / NIP / NISN" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                            >
                        </div>
                    </div>

                    <!-- Input 3: Peran (Locked to Instruktur / Guru / Pembina) -->
                    <div class="space-y-1">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-1.5">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-building-fill"></i>
                            </span>
                            <select 
                                name="role_id" 
                                id="role_id" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                            >
                                <option value="3" selected>Pilih Peran: Instruktur / Guru / Pembina</option>
                            </select>
                        </div>
                    </div>

                    <!-- Input 4: Password Baru (Min 8 Karakter) -->
                    <div class="space-y-1">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-1.5">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-lock-fill"></i>
                            </span>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                required 
                                autocomplete="new-password"
                                placeholder="Buat Kata Sandi (Min. 8 Karakter)" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-8"
                            >
                            <button 
                                type="button" 
                                onclick="togglePasswordVisibility('password', 'eye-icon-1')" 
                                class="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                <i id="eye-icon-1" class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Input 5: Konfirmasi Password -->
                    <div class="space-y-1">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-1.5">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-shield-check"></i>
                            </span>
                            <input 
                                type="password" 
                                name="password_confirmation" 
                                id="password_confirmation" 
                                required 
                                autocomplete="new-password"
                                placeholder="Konfirmasi Kata Sandi" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-8"
                            >
                            <button 
                                type="button" 
                                onclick="togglePasswordVisibility('password_confirmation', 'eye-icon-2')" 
                                class="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                <i id="eye-icon-2" class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Checkbox & Admin Bu Elvia Disclaimer -->
                    <div class="pt-2">
                        <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                            <input 
                                type="checkbox" 
                                name="terms" 
                                value="1" 
                                required 
                                {{ old('terms') ? 'checked' : '' }}
                                class="mt-0.5 rounded border-slate-300 text-[#0077b6] focus:ring-[#0077b6]"
                            >
                            <span>
                                Saya menyetujui ketentuan akun SIBAS. <span class="text-amber-600 font-bold">Akun baru memerlukan verifikasi Admin (Bu Elvia) sebelum aktif.</span>
                            </span>
                        </label>
                    </div>

                    <!-- Row: Sudah punya akun? Login & Register Button -->
                    <div class="flex items-center justify-between pt-3">
                        <a href="{{ route('login') }}" class="text-xs font-semibold text-slate-600 hover:text-[#0077b6] transition-colors">
                            Sudah punya akun? <span class="text-sky-600 font-bold underline">Login</span>
                        </a>

                        <button 
                            type="submit" 
                            class="px-10 py-2.5 bg-[#0077b6] hover:bg-[#005b96] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all transform active:scale-95"
                        >
                            REGISTER
                        </button>
                    </div>

                </form>

            </div>

            <!-- Bottom Social / SSO Section -->
            <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span class="text-slate-400 font-medium">Or Register With:</span>
                
                <div class="flex items-center gap-2">
                    <!-- Google Button -->
                    <button type="button" onclick="alert('Layanan Google SSO untuk registrasi sedang dalam integrasi.')" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-2xs">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                    </button>

                    <!-- Sekolah ID Button -->
                    <button type="button" onclick="alert('Layanan Sekolah ID SSO sedang aktif.')" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-2xs">
                        <i class="bi bi-shield-lock-fill text-sky-700"></i>
                        <span>Sekolah ID</span>
                    </button>
                </div>
            </div>

        </div>

    </div>

    <!-- Eye Toggle Password Script -->
    <script>
        function togglePasswordVisibility(inputId, iconId) {
            const input = document.getElementById(inputId);
            const icon = document.getElementById(iconId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
            }
        }
    </script>
</body>
</html>
