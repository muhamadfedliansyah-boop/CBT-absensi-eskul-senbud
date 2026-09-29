<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SIBAS (Sistem Informasi & Presensi Seni Budaya / Eskul)</title>
    
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
        .geometric-bg::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                polygon(0 0, 100% 0, 80% 100%, 0% 100%);
            opacity: 0.15;
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
        <div class="md:w-[42%] geometric-bg p-8 sm:p-10 flex flex-col justify-between relative text-white min-h-[380px] md:min-h-[560px]">
            
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
                
                <!-- LOGIN TAB (Active Notch) -->
                <div class="w-48 bg-white py-2.5 px-6 rounded-l-full shadow-lg active-tab-notch flex items-center justify-start transition-all transform translate-x-0">
                    <span class="font-black text-xs sm:text-sm tracking-wider text-[#005b96] uppercase">LOGIN</span>
                </div>

                <!-- REGISTER TAB (Inactive Notch) -->
                <a href="{{ route('register') }}" class="w-44 py-2.5 px-6 rounded-l-full flex items-center justify-start text-white/80 hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all hover:bg-white/10 group">
                    <span class="group-hover:translate-x-1 transition-transform">REGISTER</span>
                </a>
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
        <!-- RIGHT SIDE: LOGIN FORM                                    -->
        <!-- ========================================================= -->
        <div class="md:w-[58%] bg-white p-8 sm:p-12 flex flex-col justify-between space-y-6">

            <!-- Form Content Top -->
            <div class="space-y-6">
                
                <!-- Avatar & Title -->
                <div class="text-center space-y-1.5">
                    <div class="w-16 h-16 rounded-full bg-[#0077b6] text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-sky-600/25 mb-3">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <h1 class="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">LOGIN</h1>
                    <p class="text-xs font-semibold text-slate-400">Portal Eskul & CBT Ujian Siswa</p>
                </div>

                <!-- Alert Messages -->
                @if(session('success'))
                <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-start gap-2 animate-in fade-in">
                    <i class="bi bi-check-circle-fill text-emerald-600 text-sm mt-0.5"></i>
                    <div>{{ session('success') }}</div>
                </div>
                @endif

                @if($errors->any())
                <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2 animate-in fade-in">
                    <i class="bi bi-exclamation-triangle-fill text-rose-600 text-sm mt-0.5"></i>
                    <div>{{ $errors->first() }}</div>
                </div>
                @endif

                <!-- Login Form -->
                <form action="{{ route('login.post') }}" method="POST" class="space-y-6 pt-2">
                    @csrf

                    <!-- Input 1: Email / NISN / NIP -->
                    <div class="space-y-1.5">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-person-fill"></i>
                            </span>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value="{{ old('email') }}" 
                                required 
                                autocomplete="email"
                                placeholder="Email Resmi / NISN / NIP" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                            >
                        </div>
                    </div>

                    <!-- Input 2: Password Keamanan -->
                    <div class="space-y-1.5">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2">
                            <span class="text-slate-400 text-base mr-3">
                                <i class="bi bi-lock-fill"></i>
                            </span>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                required 
                                autocomplete="current-password"
                                placeholder="Password Keamanan" 
                                class="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-8"
                            >
                            <button 
                                type="button" 
                                onclick="togglePasswordVisibility('password', 'eye-icon')" 
                                class="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                <i id="eye-icon" class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Row: Forgot Password & Login Button -->
                    <div class="flex items-center justify-between pt-2">
                        <a href="javascript:void(0)" onclick="alert('Silakan hubungi Admin Kesiswaan (Bu Elvia) untuk reset kata sandi Anda.')" class="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors">
                            Forgot Password?
                        </a>

                        <button 
                            type="submit" 
                            class="px-10 py-2.5 bg-[#0077b6] hover:bg-[#005b96] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all transform active:scale-95"
                        >
                            LOGIN
                        </button>
                    </div>

                </form>

            </div>

            <!-- Bottom Social / SSO Login Section -->
            <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span class="text-slate-400 font-medium">Or Login With:</span>
                
                <div class="flex items-center gap-2">
                    <!-- Google Button -->
                    <button type="button" onclick="alert('Layanan Google SSO sedang dalam integrasi sistem sekolah.')" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-2xs">
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
