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
        @view-transition {
            navigation: auto;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .geometric-bg {
            background: linear-gradient(145deg, #0077b6 0%, #005b96 45%, #003e6b 100%);
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
            background: radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 60%),
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

        /* Cursor-following Notch Button Base Styles */
        .tab-btn-tracker {
            position: relative;
            overflow: hidden;
            transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, width 0.35s cubic-bezier(0.34, 1.25, 0.64, 1), background-color 0.3s ease;
            will-change: transform;
        }

        /* Spotlight Glow that follows the cursor */
        .tab-btn-tracker::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(140px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.4), transparent 70%);
            opacity: 0;
            transition: opacity 0.25s ease;
            pointer-events: none;
            border-radius: inherit;
            z-index: 1;
        }

        .tab-btn-tracker:hover::before {
            opacity: 1;
        }

        /* Active Notch */
        .active-tab-notch {
            box-shadow: -8px 0 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.9);
        }
        .active-tab-notch::before {
            background: radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 119, 182, 0.15), transparent 70%);
        }

        /* Inactive Notch */
        .inactive-tab-notch {
            border: 1px solid transparent;
        }
        .inactive-tab-notch:hover {
            background-color: rgba(255, 255, 255, 0.22);
            backdrop-filter: blur(12px);
            border-color: rgba(255, 255, 255, 0.35);
            box-shadow: -6px 8px 24px rgba(0, 0, 0, 0.14);
        }

        @keyframes fadeInRight {
            0% {
                opacity: 0;
                transform: translateX(18px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animate-fade-right {
            animation: fadeInRight 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    </style>
</head>
<body class="min-h-screen bg-white font-sans antialiased overflow-x-hidden">

    <!-- FULL PAGE SPLIT CONTAINER -->
    <div class="min-h-screen w-full flex flex-col md:flex-row">

        <!-- ========================================================= -->
        <!-- LEFT SIDE: FULL-HEIGHT BLUE GEOMETRIC BRANDING & TABS     -->
        <!-- ========================================================= -->
        <div class="md:w-5/12 lg:w-[38%] geometric-bg p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative text-white min-h-[380px] md:min-h-screen">
            
            <!-- Top Branding Header -->
            <div class="flex items-center gap-3.5 relative z-10 transition-transform duration-300 hover:translate-x-1">
                <div class="w-11 h-11 rounded-xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center font-black text-base text-white shadow-inner transition-transform duration-300 hover:scale-105">
                    SB
                </div>
                <div>
                    <h2 class="font-extrabold text-lg tracking-tight leading-none text-white">SIBAS</h2>
                    <p class="text-xs text-white/80 font-medium mt-1">Seni Budaya & Absensi Eskul</p>
                </div>
            </div>

            <!-- Center Tab Notches with Cursor Tracking -->
            <div class="my-auto py-10 relative z-20 flex flex-col items-end gap-4 -mr-8 sm:-mr-12 lg:-mr-16">
                
                <!-- LOGIN TAB (Active Notch with Cursor Follow) -->
                <div class="tab-btn-tracker active-tab-notch w-48 sm:w-56 lg:w-60 bg-white py-3.5 px-6 sm:px-8 rounded-l-full flex items-center justify-between text-[#005b96] cursor-default select-none">
                    <span class="font-black text-xs sm:text-sm tracking-wider uppercase relative z-10">LOGIN</span>
                    <i class="bi bi-chevron-right text-xs opacity-70 relative z-10"></i>
                </div>

                <!-- REGISTER TAB (Inactive Notch with Cursor Follow) -->
                <a href="{{ route('register') }}" class="tab-btn-tracker inactive-tab-notch w-40 sm:w-48 hover:w-48 sm:hover:w-56 lg:hover:w-60 py-3.5 px-6 sm:px-8 rounded-l-full flex items-center justify-between text-white/85 hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase group select-none">
                    <span class="group-hover:translate-x-1.5 transition-transform duration-300 relative z-10">REGISTER</span>
                    <i class="bi bi-arrow-right text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10"></i>
                </a>
            </div>

            <!-- Bottom Left Sub-Footer -->
            <div class="relative z-10 pt-4 border-t border-white/15">
                <p class="text-xs text-white/70 leading-relaxed font-medium">
                    © 2026 Sistem Absensi & Jurnal<br />
                    SMK/SMA Negeri Presensi Cloud
                </p>
            </div>

            <!-- Decorative Polygon Shapes -->
            <div class="absolute inset-0 opacity-20 pointer-events-none">
                <svg class="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,200 400,100 400,600 0,600" fill="white" opacity="0.06" />
                    <polygon points="100,0 400,0 300,400 0,200" fill="white" opacity="0.08" />
                    <polygon points="0,400 400,300 400,600 0,600" fill="white" opacity="0.06" />
                </svg>
            </div>
        </div>


        <!-- ========================================================= -->
        <!-- RIGHT SIDE: FULL-PAGE LOGIN FORM CONTENT                  -->
        <!-- ========================================================= -->
        <div class="md:w-7/12 lg:w-[62%] bg-white p-6 sm:p-12 lg:p-20 flex flex-col justify-center items-center min-h-screen overflow-y-auto">

            <div class="w-full max-w-md my-auto space-y-7 animate-fade-right">
                
                <!-- Avatar & Title Header -->
                <div class="text-center space-y-2">
                    <div class="w-16 h-16 rounded-full bg-[#0077b6] text-white flex items-center justify-center mx-auto text-2xl shadow-xl shadow-sky-600/30 mb-4 transition-transform duration-300 hover:scale-105">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">LOGIN</h1>
                    <p class="text-xs sm:text-sm font-semibold text-slate-400">Portal Petugas, Instruktur & Guru SIBAS</p>
                </div>

                <!-- Alert Messages -->
                @if(session('success'))
                <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-start gap-2.5 animate-in fade-in shadow-xs">
                    <i class="bi bi-check-circle-fill text-emerald-600 text-sm mt-0.5"></i>
                    <div>{{ session('success') }}</div>
                </div>
                @endif

                @if($errors->any())
                <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2.5 animate-in fade-in shadow-xs">
                    <i class="bi bi-exclamation-triangle-fill text-rose-600 text-sm mt-0.5"></i>
                    <div>{{ $errors->first() }}</div>
                </div>
                @endif

                <!-- Login Form -->
                <form action="{{ route('login.post') }}" method="POST" class="space-y-6 pt-1">
                    @csrf

                    <!-- Input 1: Email / NISN / NIP -->
                    <div class="space-y-1.5">
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2.5">
                            <span class="text-slate-400 text-base mr-3.5">
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
                        <div class="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0077b6] transition-colors pb-2.5">
                            <span class="text-slate-400 text-base mr-3.5">
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
                                class="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                            >
                                <i id="eye-icon" class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Row: Remember me & Forgot Password / Kembali ke Beranda -->
                    <div class="flex items-center justify-between pt-1 text-xs">
                        <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                            <input type="checkbox" name="remember" class="rounded border-slate-300 text-[#0077b6] focus:ring-[#0077b6]">
                            <span>Ingat saya</span>
                        </label>

                        <a href="{{ url('/') }}" class="font-medium text-slate-500 hover:text-sky-700 transition-colors">
                            Kembali ke Beranda
                        </a>
                    </div>

                    <!-- Login Submit Button (Full Width Pill Button) -->
                    <div class="pt-2">
                        <button 
                            type="submit" 
                            class="w-full py-3.5 bg-[#0077b6] hover:bg-[#005b96] text-white font-extrabold text-sm tracking-wider uppercase rounded-full shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all transform active:scale-95 duration-200"
                        >
                            MASUK KE AKUN
                        </button>
                    </div>

                </form>

                <!-- Quick Demo Role Accounts Autofill Section -->
                <div class="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span class="flex items-center gap-1.5"><i class="bi bi-key-fill text-sky-600"></i> Akun Uji Coba Role (Klik Cepat):</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <button type="button" onclick="fillLogin('admin@sekolah.sch.id', 'password123')" class="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg border border-slate-200 font-bold transition-all text-[11px] shadow-2xs">
                            👑 Admin (Bu Elvia)
                        </button>
                        <button type="button" onclick="fillLogin('fajar@sekolah.sch.id', 'password123')" class="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg border border-slate-200 font-bold transition-all text-[11px] shadow-2xs">
                            🤖 Instruktur (Pak Fajar)
                        </button>
                        <button type="button" onclick="fillLogin('dedi@sekolah.sch.id', 'password123')" class="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg border border-slate-200 font-bold transition-all text-[11px] shadow-2xs">
                            👥 PS / Guru (Pak Dedi)
                        </button>
                    </div>
                </div>

                <!-- Bottom Register Callout Link -->
                <div class="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                    Belum memiliki akun instruktur? 
                    <a href="{{ route('register') }}" class="font-bold text-[#0077b6] hover:text-[#005b96] underline hover:no-underline transition-colors ml-1">
                        Daftar di sini
                    </a>
                </div>

                <!-- SSO / Alternative Login Section -->
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1">
                    <span class="text-slate-400 font-medium">Or Login With:</span>
                    
                    <div class="flex items-center gap-2">
                        <!-- Google Button -->
                        <button type="button" onclick="alert('Layanan Google SSO sedang dalam integrasi sistem sekolah.')" class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all hover:border-slate-300 shadow-2xs">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Google</span>
                        </button>

                        <!-- Sekolah ID Button -->
                        <button type="button" onclick="alert('Layanan Sekolah ID SSO sedang aktif.')" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all hover:border-slate-300 shadow-2xs">
                            <i class="bi bi-shield-lock-fill text-sky-700"></i>
                            <span>Sekolah ID</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>

    </div>

    <!-- Eye Toggle Password & Cursor Tracking Scripts -->
    <script>
        function fillLogin(email, password) {
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');
            if (emailInput && passInput) {
                emailInput.value = email;
                passInput.value = password;
                emailInput.focus();
            }
        }

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

        // Magnetic Cursor-Tracking on Notch Buttons
        document.querySelectorAll('.tab-btn-tracker').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);

                // Subtle magnetic pull following the cursor
                const isInactive = btn.classList.contains('inactive-tab-notch');
                const baseShiftX = isInactive ? -8 : 0;
                btn.style.transform = `translate(${baseShiftX + deltaX * 8}px, ${deltaY * 5}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.setProperty('--mouse-x', '50%');
                btn.style.setProperty('--mouse-y', '50%');
            });
        });
    </script>
</body>
</html>
