<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIBAS - Portal Informasi & Presensi Siswa</title>
    <meta name="description" content="Portal informasi jadwal eskul & seni budaya sekolah, transparansi rekapitulasi presensi 9 minggu, dan informasi ruangan kegiatan.">
    
    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome / Bootstrap Icons SVG library -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Tailwind CSS CDN for instant rendering -->
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
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            200: '#bae6fd',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            700: '#0369a1',
                            800: '#075985',
                            900: '#0c4a6e',
                            primary: '#005b96',
                            dark: '#013a63'
                        }
                    }
                }
            }
        }
    </script>

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
        }
        .tab-btn.active {
            background-color: #004e7c;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 78, 124, 0.25);
        }
        .filter-btn.active {
            background-color: #004e7c;
            color: #ffffff;
            border-color: #004e7c;
        }
        .bar-transition {
            transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
    </style>
</head>
<body class="min-h-screen bg-[#F8FAFC] antialiased">

    <!-- TOP NAVIGATION BAR -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                
                <!-- Logo SIBAS -->
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xl font-extrabold tracking-tight text-slate-900">SIBAS</span>
                        </div>
                        <p class="text-xs font-semibold text-slate-500">Seni Budaya & Eskul</p>
                    </div>
                </div>

                <!-- Navigation Tabs in Center -->
                <nav class="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
                    <button onclick="switchMainTab('jadwal')" id="nav-btn-jadwal" class="px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-[#005288] text-white shadow-xs">
                        Jadwal Eskul
                    </button>
                    <button onclick="switchMainTab('rekap')" id="nav-btn-rekap" class="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all">
                        Cek Presensi
                    </button>
                    <button onclick="openModal('modal-ruangan')" class="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all">
                        Informasi Ruangan
                    </button>
                </nav>

                <!-- Right Actions -->
                <div class="flex items-center gap-3">
                    <button onclick="openModal('modal-presensi-mandiri')" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-2xs">
                        <i class="bi bi-person-badge"></i>
                        Cari NIS Siswa
                    </button>
                    <a href="{{ route('login') ?? '#' }}" class="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-slate-700 hover:text-sky-700 hover:bg-slate-50 rounded-xl transition-all border border-slate-200/80">
                        <span>Masuk Staf</span>
                        <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                            <i class="bi bi-person-circle text-lg"></i>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- HERO BANNER SECTION -->
    <section class="relative bg-gradient-to-b from-white via-sky-50/30 to-[#F8FAFC] pt-10 pb-12 border-b border-slate-200/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <!-- Left Hero Content -->
                <div class="lg:col-span-8 space-y-5">
                    <!-- Badge -->
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold tracking-wide shadow-2xs">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        TAHUN AJARAN 2024/2025 • SEMESTER GANJIL
                    </div>

                    <!-- Heading -->
                    <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                        Portal Informasi & Presensi<br />
                        <span class="text-[#005288]">Eskul–Senbud Sekolah</span>
                    </h1>

                    <!-- Description -->
                    <p class="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Eksplorasi minat, pantau ketersediaan ruang latihan secara transparan, serta tinjau keaktifan peserta secara terbuka tanpa hambatan login.
                    </p>

                    <!-- Buttons -->
                    <div class="flex flex-wrap items-center gap-3.5 pt-2">
                        <button onclick="scrollToJadwal()" class="inline-flex items-center gap-2.5 px-6 py-3 bg-[#005288] hover:bg-[#003d66] text-white font-bold text-sm rounded-xl shadow-md shadow-sky-900/10 hover:shadow-lg transition-all transform active:scale-98">
                            <i class="bi bi-compass"></i>
                            Jelajahi Jadwal & Ruangan
                        </button>
                        <button onclick="switchMainTab('rekap'); scrollToJadwal();" class="inline-flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#005288] font-bold text-sm rounded-xl border border-slate-300 shadow-2xs hover:border-slate-400 transition-all">
                            <i class="bi bi-bar-chart-line text-sky-600"></i>
                            Lihat Rekap 9 Minggu
                        </button>
                    </div>
                </div>

                <!-- Right Hero Stats Widget Card -->
                <div class="lg:col-span-4">
                    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Keaktifan Komunitas</span>
                            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                                <i class="bi bi-people-fill text-lg"></i>
                            </div>
                        </div>

                        <div class="mb-5">
                            <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-extrabold text-slate-900">{{ $totalEskuls ?? 32 }}</span>
                                <span class="text-sm font-semibold text-slate-600">Ekstrakurikuler Aktif</span>
                            </div>
                        </div>

                        <!-- Weekly Micro Chart Bar -->
                        <div class="pt-3 border-t border-slate-100">
                            <div class="flex items-end justify-between h-20 gap-2 px-1">
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-sky-100 group-hover:bg-sky-200 rounded-t-sm h-7 transition-all"></div>
                                    <span class="text-[11px] font-semibold text-slate-500">Sen</span>
                                </div>
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-sky-100 group-hover:bg-sky-200 rounded-t-sm h-9 transition-all"></div>
                                    <span class="text-[11px] font-semibold text-slate-500">Sel</span>
                                </div>
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-sky-200 group-hover:bg-sky-300 rounded-t-sm h-12 transition-all"></div>
                                    <span class="text-[11px] font-semibold text-slate-500">Rab</span>
                                </div>
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-sky-100 group-hover:bg-sky-200 rounded-t-sm h-8 transition-all"></div>
                                    <span class="text-[11px] font-semibold text-slate-500">Kam</span>
                                </div>
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-[#00669e] group-hover:bg-[#005288] rounded-t-sm h-16 transition-all shadow-xs"></div>
                                    <span class="text-[11px] font-bold text-sky-800">Jum</span>
                                </div>
                                <div class="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                    <div class="w-full bg-[#004e7c] group-hover:bg-[#003d66] rounded-t-sm h-20 transition-all shadow-xs"></div>
                                    <span class="text-[11px] font-bold text-sky-900">Sab</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- VIEW TOGGLER BAR -->
    <div id="section-tabs" class="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-2xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <!-- Main Tab Pills -->
                <div class="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
                    <button onclick="switchMainTab('jadwal')" id="tab-btn-jadwal" class="tab-btn active flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all w-full sm:w-auto">
                        <i class="bi bi-calendar3"></i>
                        <span>Jadwal Ekstrakurikuler</span>
                    </button>
                    <button onclick="switchMainTab('rekap')" id="tab-btn-rekap" class="tab-btn flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-all w-full sm:w-auto">
                        <i class="bi bi-graph-up-arrow"></i>
                        <span>Rekap Absensi 9 Minggu</span>
                    </button>
                </div>

                <!-- Right Public Access Badge -->
                <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                    <i class="bi bi-shield-check text-emerald-600 text-sm"></i>
                    <span>Akses Terbuka • Publik Tanpa Akun</span>
                </div>

            </div>
        </div>
    </div>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        <!-- ========================================================================= -->
        <!-- VIEW 1: JADWAL MINGGUAN EKSTRAKURIKULER                                  -->
        <!-- ========================================================================= -->
        <section id="view-jadwal" class="space-y-6">
            
            <!-- Section Header & Live Search Bar -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Jadwal Mingguan Ekstrakurikuler</h2>
                    <p class="text-sm text-slate-500 mt-1">Pilih hari dan kategori untuk menemukan jam dan instruktur pendamping.</p>
                </div>

                <!-- Search Box -->
                <div class="w-full md:w-80 relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <i class="bi bi-search"></i>
                    </div>
                    <input type="text" id="search-input" onkeyup="filterEskulTable()" placeholder="Cari eskul, instruktur, atau ruangan..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs transition-all">
                </div>
            </div>

            <!-- Filter Pills Bar -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <!-- Day Filters -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
                    <button onclick="filterByDay('all', this)" class="day-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#005288] text-white border border-[#005288] transition-all whitespace-nowrap">
                        Semua Hari
                    </button>
                    <button onclick="filterByDay('Senin', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Senin
                    </button>
                    <button onclick="filterByDay('Selasa', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Selasa
                    </button>
                    <button onclick="filterByDay('Rabu', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Rabu
                    </button>
                    <button onclick="filterByDay('Kamis', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Kamis
                    </button>
                    <button onclick="filterByDay('Jumat', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Jumat
                    </button>
                    <button onclick="filterByDay('Sabtu', this)" class="day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap">
                        Sabtu
                    </button>
                </div>

                <!-- Category Filters -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                    <button onclick="filterByCategory('all', this)" class="cat-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 transition-all whitespace-nowrap">
                        Semua Bidang
                    </button>
                    <button onclick="filterByCategory('Olahraga', this)" class="cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap">
                        Olahraga
                    </button>
                    <button onclick="filterByCategory('Seni Budaya', this)" class="cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap">
                        Seni Budaya
                    </button>
                    <button onclick="filterByCategory('Sains & IT', this)" class="cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap">
                        Sains & IT
                    </button>
                    <button onclick="filterByCategory('Bahasa', this)" class="cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap">
                        Bahasa
                    </button>
                    <button onclick="filterByCategory('Pramuka', this)" class="cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap">
                        Pramuka
                    </button>
                </div>
            </div>

            <!-- TABLE OF EKSTRAKURIKULER -->
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse" id="table-eskul">
                        <thead>
                            <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                                <th class="py-4 px-4 text-center w-12">NO</th>
                                <th class="py-4 px-6">NAMA EKSTRAKURIKULER & BIDANG</th>
                                <th class="py-4 px-6">HARI & WAKTU</th>
                                <th class="py-4 px-6">LOKASI / RUANG</th>
                                <th class="py-4 px-6">INSTRUKTUR PENGAMPU</th>
                                <th class="py-4 px-4 text-center w-20">AKSI</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            @forelse($eskulsList as $index => $item)
                            <tr class="eskul-row hover:bg-slate-50/70 transition-colors" 
                                data-name="{{ strtolower($item['name']) }}"
                                data-day="{{ $item['day'] }}"
                                data-category="{{ $item['category'] }}"
                                data-instructor="{{ strtolower($item['instruktur_name']) }}"
                                data-location="{{ strtolower($item['location_name']) }}">
                                
                                <!-- No -->
                                <td class="py-4 px-4 text-center font-bold text-slate-400">
                                    {{ $index + 1 }}
                                </td>

                                <!-- Nama & Bidang -->
                                <td class="py-4 px-6">
                                    <div class="font-bold text-slate-900 text-base">{{ $item['name'] }}</div>
                                    <div class="flex items-center gap-2 mt-1">
                                        @php
                                            $badgeClass = match($item['category']) {
                                                'Olahraga' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                'Seni Budaya' => 'bg-indigo-50 text-indigo-700 border-indigo-200',
                                                'Sains & IT' => 'bg-cyan-50 text-cyan-700 border-cyan-200',
                                                'Bahasa' => 'bg-amber-50 text-amber-700 border-amber-200',
                                                'Pramuka' => 'bg-slate-100 text-slate-700 border-slate-300',
                                                default => 'bg-sky-50 text-sky-700 border-sky-200',
                                            };
                                        @endphp
                                        <span class="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border {{ $badgeClass }}">
                                            {{ $item['category'] }}
                                        </span>
                                        <span class="text-xs text-slate-500 font-medium">• {{ $item['sub_category'] }}</span>
                                    </div>
                                </td>

                                <!-- Hari & Waktu -->
                                <td class="py-4 px-6 whitespace-nowrap">
                                    <div class="flex items-center gap-1.5 font-bold text-slate-800">
                                        <i class="bi bi-calendar-event text-sky-600"></i>
                                        <span>{{ $item['day'] }}</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                        <i class="bi bi-clock text-slate-400"></i>
                                        <span>{{ $item['time'] }}</span>
                                    </div>
                                </td>

                                <!-- Lokasi / Ruang -->
                                <td class="py-4 px-6">
                                    <div class="flex items-start gap-1.5">
                                        <i class="bi bi-geo-alt-fill text-emerald-600 mt-0.5"></i>
                                        <div>
                                            <div class="font-bold text-slate-800">{{ $item['location_name'] }}</div>
                                            <div class="text-xs text-slate-500">{{ $item['location_sub'] }}</div>
                                        </div>
                                    </div>
                                </td>

                                <!-- Instruktur Pengampu -->
                                <td class="py-4 px-6">
                                    <div class="flex items-center gap-3">
                                        @php
                                            $avatarBg = match($index % 5) {
                                                0 => 'bg-sky-100 text-sky-700 border-sky-200',
                                                1 => 'bg-indigo-100 text-indigo-700 border-indigo-200',
                                                2 => 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                                3 => 'bg-purple-100 text-purple-700 border-purple-200',
                                                default => 'bg-amber-100 text-amber-700 border-amber-200',
                                            };
                                        @endphp
                                        <div class="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs border {{ $avatarBg }} shrink-0">
                                            {{ $item['instruktur_initials'] }}
                                        </div>
                                        <div>
                                            <div class="font-bold text-slate-800 text-sm leading-snug">{{ $item['instruktur_name'] }}</div>
                                            <div class="text-xs text-slate-500">{{ $item['instruktur_role'] }}</div>
                                        </div>
                                    </div>
                                </td>

                                <!-- Aksi / Detail Modal -->
                                <td class="py-4 px-4 text-center">
                                    <button onclick="openEskulDetail({{ $item['id'] }})" title="Lihat Detail & Ruangan" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-500 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-all inline-flex items-center justify-center shadow-2xs">
                                        <i class="bi bi-eye text-base"></i>
                                    </button>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="py-8 text-center text-slate-500 font-medium">
                                    Tidak ada data ekstrakurikuler yang tersedia.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <!-- Pagination & Summary Footer -->
                <div class="p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
                    <div>
                        Menampilkan <span class="font-bold text-slate-900" id="showing-count">1-{{ count($eskulsList) }}</span> dari total <span class="font-bold text-slate-900">{{ $totalEskuls ?? 32 }}</span> ekstrakurikuler terdaftar
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed">
                            ‹ Sebelumnya
                        </button>
                        <button class="w-8 h-8 rounded-lg bg-[#005288] text-white font-bold flex items-center justify-center shadow-2xs">1</button>
                        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center">2</button>
                        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center">3</button>
                        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center">4</button>
                        <button class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                            Selanjutnya ›
                        </button>
                    </div>
                </div>
            </div>

        </section>


        <!-- ========================================================================= -->
        <!-- VIEW 2: REKAPITULASI KEHADIRAN 9 MINGGU (M1 - M9)                         -->
        <!-- ========================================================================= -->
        <section id="view-rekap" class="hidden space-y-8">
            
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Rekap Presensi & Kehadiran 9 Minggu (Transparan & Terbuka)
                    </div>
                    <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Rekapitulasi Kehadiran 9 Minggu (M1 – M9)</h2>
                    <p class="text-sm text-slate-500 mt-1">Transparansi keaktifan dan kehadiran seluruh ekstrakurikuler & seni budaya selama satu semester.</p>
                </div>

                <!-- Search Input for Rekap -->
                <div class="w-full md:w-72 relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <i class="bi bi-search"></i>
                    </div>
                    <input type="text" id="rekap-search-input" onkeyup="filterRekapTable()" placeholder="Cari eskul atau instruktur..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs">
                </div>
            </div>

            <!-- 4 KPI SUMMARY STATS CARDS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Card 1: Rata-rata Kehadiran Global -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Rata-rata Kehadiran Global</span>
                        <div class="flex items-baseline gap-2 mt-1">
                            <span class="text-3xl font-extrabold text-slate-900">{{ $globalAvg }}%</span>
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Sangat Baik</span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-1">Target akreditasi sekolah min 80%</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                        <i class="bi bi-check-circle-fill text-2xl"></i>
                    </div>
                </div>

                <!-- Card 2: Total Keaktifan Siswa -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Total Keaktifan Siswa</span>
                        <div class="flex items-baseline gap-2 mt-1">
                            <span class="text-3xl font-extrabold text-slate-900">{{ $totalStudents }}</span>
                            <span class="text-xs font-bold text-slate-600">Siswa</span>
                        </div>
                        <p class="text-[11px] text-emerald-600 font-semibold mt-1">Terdaftar pada 32 eskul</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shrink-0">
                        <i class="bi bi-people-fill text-2xl"></i>
                    </div>
                </div>

                <!-- Card 3: Progres Pertemuan -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Progres Pertemuan</span>
                        <div class="flex items-baseline gap-2 mt-1">
                            <span class="text-3xl font-extrabold text-slate-900">{{ $meetingsProgress }}</span>
                            <span class="text-xs font-bold text-emerald-700">Pekan Tuntas</span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-1">100% jadwal terselenggara</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <i class="bi bi-calendar-check-fill text-2xl"></i>
                    </div>
                </div>

                <!-- Card 4: Eskul Paling Aktif -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Eskul Paling Aktif</span>
                        <div class="font-extrabold text-slate-900 text-lg mt-1 truncate max-w-[170px]">{{ $topEskul }}</div>
                        <p class="text-[11px] text-amber-600 font-bold mt-1">98% Kehadiran rata-rata</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                        <i class="bi bi-award-fill text-2xl"></i>
                    </div>
                </div>

            </div>

            <!-- WEEKLY TREND BAR CHART CARD -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <i class="bi bi-bar-chart-fill text-[#005288]"></i>
                            <h3 class="font-extrabold text-slate-900 text-base sm:text-lg">Tren Rata-rata Kehadiran Per Pekan (M1 s/d M9)</h3>
                        </div>
                        <p class="text-xs text-slate-500 mt-0.5">Persentase gabungan kehadiran seluruh murid disetiap pekan kegiatan eskul</p>
                    </div>

                    <!-- Legend -->
                    <div class="flex items-center gap-4 text-xs font-bold">
                        <div class="flex items-center gap-1.5 text-slate-600">
                            <span class="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                            <span>≥90% Tertinggi</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-slate-600">
                            <span class="w-3 h-3 rounded-full bg-[#00669e] inline-block"></span>
                            <span>85 - 89% Normal</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-slate-600">
                            <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                            <span><85% Penyesuaian</span>
                        </div>
                    </div>
                </div>

                <!-- 9-Week Bar Chart -->
                <div class="pt-6 pb-2">
                    <div class="grid grid-cols-9 gap-2 sm:gap-4 items-end h-56 px-2">
                        @foreach($weeklyTrend as $wt)
                        @php
                            $barHeight = $wt['pct'] . '%';
                            $barBg = match(true) {
                                $wt['pct'] >= 90 => 'bg-gradient-to-t from-emerald-600 to-emerald-500',
                                $wt['pct'] >= 85 => 'bg-gradient-to-t from-[#004e7c] to-[#00669e]',
                                default => 'bg-gradient-to-t from-amber-600 to-amber-500',
                            };
                            $textCol = match(true) {
                                $wt['pct'] >= 90 => 'text-emerald-700',
                                $wt['pct'] >= 85 => 'text-sky-800',
                                default => 'text-amber-700',
                            };
                        @endphp
                        <div class="flex flex-col items-center justify-end h-full group relative cursor-pointer">
                            <!-- Percentage on top -->
                            <span class="text-xs font-extrabold {{ $textCol }} mb-1.5 transition-transform group-hover:scale-110">{{ $wt['pct'] }}%</span>
                            
                            <!-- Bar -->
                            <div class="w-full max-w-[56px] {{ $barBg }} rounded-t-lg shadow-sm transition-all duration-300 group-hover:opacity-90 group-hover:shadow-md" style="height: {{ $barHeight }};"></div>
                            
                            <!-- Labels below -->
                            <div class="mt-2.5 text-center">
                                <div class="font-extrabold text-xs text-slate-800">{{ $wt['week'] }}</div>
                                <div class="text-[10px] text-slate-400 font-medium truncate max-w-[65px] hidden sm:block">{{ $wt['title'] }}</div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- DETAIL PRESENSI 9 PEKAN PER EKSTRAKURIKULER TABLE -->
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                        <h3 class="font-extrabold text-slate-900 text-base">Detail Presensi 9 Pekan Per Ekstrakurikuler</h3>
                        <p class="text-xs text-slate-500">Rincian kehadiran lengkap dari Pekan 1 hingga Pekan 9</p>
                    </div>

                    <div class="flex items-center gap-3 text-xs font-bold">
                        <span class="inline-flex items-center gap-1 text-emerald-700"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ≥90%</span>
                        <span class="inline-flex items-center gap-1 text-sky-700"><span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span> 85–89%</span>
                        <span class="inline-flex items-center gap-1 text-amber-700"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <85%</span>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse" id="table-rekap">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                                <th class="py-3.5 px-4 text-center w-12">NO</th>
                                <th class="py-3.5 px-5">EKSTRAKURIKULER & BIDANG</th>
                                <th class="py-3.5 px-5">INSTRUKTUR</th>
                                <th class="py-3.5 px-6 text-center">
                                    RINCIAN PEKAN 1 – 9
                                    <div class="flex justify-center gap-3 text-[10px] text-slate-400 font-normal mt-0.5">
                                        <span>M1</span><span>M2</span><span>M3</span><span>M4</span><span>M5</span><span>M6</span><span>M7</span><span>M8</span><span>M9</span>
                                    </div>
                                </th>
                                <th class="py-3.5 px-5 text-center">RATA-RATA KEHADIRAN</th>
                                <th class="py-3.5 px-5 text-center">STATUS PREDIKAT</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            @foreach($eskulsList as $index => $item)
                            <tr class="rekap-row hover:bg-slate-50/70 transition-colors" data-name="{{ strtolower($item['name']) }}" data-instructor="{{ strtolower($item['instruktur_name']) }}">
                                <td class="py-4 px-4 text-center font-bold text-slate-400">
                                    {{ $index + 1 }}
                                </td>
                                
                                <td class="py-4 px-5">
                                    <div class="font-bold text-slate-900">{{ $item['name'] }}</div>
                                    <div class="text-xs text-slate-500 mt-0.5">
                                        <span class="font-semibold text-slate-700">{{ $item['category'] }}</span> • {{ $item['total_students'] }} Anggota
                                    </div>
                                </td>

                                <td class="py-4 px-5">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                                            {{ $item['instruktur_initials'] }}
                                        </div>
                                        <div>
                                            <div class="font-bold text-slate-800 text-xs">{{ $item['instruktur_name'] }}</div>
                                            <div class="text-[11px] text-slate-400">{{ $item['instruktur_role'] }}</div>
                                        </div>
                                    </div>
                                </td>

                                <!-- 9 Badges per week -->
                                <td class="py-4 px-6 text-center">
                                    <div class="flex items-center justify-center gap-1.5">
                                        @foreach($item['weekly_attendance'] as $wPct)
                                        @php
                                            $pillColor = match(true) {
                                                $wPct >= 90 => 'bg-emerald-500 text-white',
                                                $wPct >= 85 => 'bg-[#0077b6] text-white',
                                                default => 'bg-amber-500 text-white',
                                            };
                                        @endphp
                                        <span class="w-6 h-6 rounded-md {{ $pillColor }} font-bold text-[10px] flex items-center justify-center shadow-2xs" title="Pekan Kehadiran: {{ $wPct }}%">
                                            {{ $wPct }}
                                        </span>
                                        @endforeach
                                    </div>
                                </td>

                                <!-- Rata-rata Kehadiran -->
                                <td class="py-4 px-5 text-center">
                                    <div class="inline-flex items-center gap-2">
                                        <div class="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div class="bg-emerald-500 h-2.5 rounded-full" style="width: {{ $item['avg_attendance'] }}%"></div>
                                        </div>
                                        <span class="font-extrabold text-slate-900 text-sm">{{ $item['avg_attendance'] }}%</span>
                                    </div>
                                </td>

                                <!-- Status Predikat -->
                                <td class="py-4 px-5 text-center">
                                    @php
                                        $predikatClass = match($item['status_predikat']) {
                                            'Teladan' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                            'Sangat Baik' => 'bg-sky-50 text-sky-700 border-sky-200',
                                            default => 'bg-blue-50 text-blue-700 border-blue-200',
                                        };
                                    @endphp
                                    <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold border {{ $predikatClass }}">
                                        {{ $item['status_predikat'] }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <div class="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                    <div>
                        Menampilkan {{ count($eskulsList) }} eskul terdata rekap 9 minggu semester berjalan
                    </div>
                    <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <i class="bi bi-arrow-repeat text-sm animate-spin-slow"></i>
                        <span>Data sinkron langsung dengan presensi instruktur sekolah</span>
                    </div>
                </div>
            </div>

        </section>


        <!-- ========================================================================= -->
        <!-- BOTTOM CTA: KONFIRMASI PERUBAHAN JADWAL ATAU RUANGAN                     -->
        <!-- ========================================================================= -->
        <div class="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 rounded-2xl p-6 sm:p-8 border border-sky-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white text-[#005288] border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <i class="bi bi-question-circle-fill text-2xl text-[#005288]"></i>
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-900 text-base sm:text-lg">Butuh Konfirmasi Perubahan Jadwal atau Ruangan?</h4>
                    <p class="text-sm text-slate-600 mt-1 max-w-xl">
                        Silakan hubungi koordinator kesiswaan atau masuk sebagai instruktur terdaftar untuk mengubah alokasi.
                    </p>
                </div>
            </div>

            <button onclick="openModal('modal-contact')" class="px-6 py-3 bg-[#004e7c] hover:bg-[#003d66] text-white font-bold text-sm rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-98">
                Hubungi Petugas Eskul
            </button>
        </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-slate-200 py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                <div class="flex items-center gap-2.5">
                    <div class="w-6 h-6 rounded-lg bg-[#005288] text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                    </div>
                    <span>© 2025 SIM–ESKUL CBT Presensi Eskul & Seni Budaya Sekolah</span>
                </div>

                <div class="flex items-center gap-6 font-semibold">
                    <a href="javascript:void(0)" onclick="openModal('modal-ruangan')" class="hover:text-sky-700 transition-colors">Jadwal & Ruangan</a>
                    <a href="javascript:void(0)" onclick="openModal('modal-presensi-mandiri')" class="hover:text-sky-700 transition-colors">Presensi Mandiri</a>
                    <a href="{{ route('login') ?? '#' }}" class="hover:text-sky-700 transition-colors">Akses Petugas</a>
                </div>
            </div>
        </div>
    </footer>


    <!-- ========================================================================= -->
    <!-- MODAL 1: DETAIL ESKUL, JADWAL RUANGAN PER TANGGAL & SANGGA               -->
    <!-- ========================================================================= -->
    <div id="modal-eskul-detail" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="p-6 bg-gradient-to-r from-[#004e7c] to-[#00669e] text-white flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2.5">
                        <span id="modal-category-badge" class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/20 text-white backdrop-blur-xs">Kategori</span>
                        <span id="modal-members-count" class="text-xs text-sky-100 font-semibold">• 45 Anggota</span>
                    </div>
                    <h3 id="modal-title" class="text-2xl font-extrabold text-white mt-2 tracking-tight">Nama Ekstrakurikuler</h3>
                    <p id="modal-instruktur" class="text-xs text-sky-100 mt-1 flex items-center gap-1.5">
                        <i class="bi bi-person-fill"></i>
                        <span>Instruktur: Coach</span>
                    </p>
                </div>
                <button onclick="closeModal('modal-eskul-detail')" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <!-- Sangga Section (if any) -->
                <div id="modal-sangga-box" class="hidden bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 class="font-extrabold text-xs uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                        <i class="bi bi-diagram-3-fill text-[#005288]"></i>
                        <span>Pembagian Sangga / Regu & PIC Siswa</span>
                    </h4>
                    <div id="modal-sangga-list" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <!-- Filled by JS -->
                    </div>
                </div>

                <!-- Schedule & Room List per Week -->
                <div>
                    <h4 class="font-extrabold text-xs uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                        <i class="bi bi-calendar3 text-[#005288]"></i>
                        <span>Informasi Ruangan & Materi Kegiatan Berdasarkan Tanggal (M1 - M9)</span>
                    </h4>
                    
                    <div id="modal-schedules-list" class="space-y-3">
                        <!-- Filled by JS -->
                    </div>
                </div>

            </div>

            <!-- Modal Footer -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button onclick="closeModal('modal-eskul-detail')" class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all">
                    Tutup
                </button>
            </div>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 2: CEK PRESENSI MANDIRI SISWA (TANPA LOGIN)                        -->
    <!-- ========================================================================= -->
    <div id="modal-presensi-mandiri" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-[#005288] to-[#0077b6] text-white flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-extrabold">Cek Presensi Mandiri Siswa</h3>
                    <p class="text-xs text-sky-100 mt-0.5">Ketik NIS atau Nama Siswa untuk melihat riwayat kehadiran eskul</p>
                </div>
                <button onclick="closeModal('modal-presensi-mandiri')" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="p-6 space-y-5">
                <!-- Search Form -->
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <i class="bi bi-search absolute left-3.5 top-3 text-slate-400"></i>
                        <input type="text" id="nis-search-query" placeholder="Contoh: 12301001 atau Ahmad..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all">
                    </div>
                    <button onclick="doCekPresensi()" class="px-5 py-2.5 bg-[#005288] hover:bg-[#003d66] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5">
                        <i class="bi bi-search"></i>
                        Cari
                    </button>
                </div>

                <!-- Result Container -->
                <div id="presensi-result-container" class="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    <div class="text-center py-8 text-slate-400 text-xs">
                        <i class="bi bi-card-checklist text-3xl text-slate-300 block mb-2"></i>
                        Silakan masukkan NIS atau Nama Siswa di atas untuk melihat detail kehadiran.
                    </div>
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>💡 Data kehadiran diperbarui otomatis saat instruktur selesai mencatat</span>
                <button onclick="closeModal('modal-presensi-mandiri')" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl">
                    Tutup
                </button>
            </div>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 3: INFORMASI RUANGAN & TANGGAL KEGIATAN                             -->
    <!-- ========================================================================= -->
    <div id="modal-ruangan" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-[#005288] to-[#0077b6] text-white flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-extrabold">Informasi Alokasi Ruang & Lapangan</h3>
                    <p class="text-xs text-sky-100 mt-0.5">Daftar ruangan latihan eskul, sangga pramuka, dan ruang kelas yang digunakan</p>
                </div>
                <button onclick="closeModal('modal-ruangan')" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="p-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    @forelse($upcomingSchedules as $sch)
                    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="font-extrabold text-slate-900 text-sm">{{ $sch->eskul ? $sch->eskul->name : 'Ekstrakurikuler' }}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                                {{ \Carbon\Carbon::parse($sch->activity_date)->translatedFormat('d M Y') }}
                            </span>
                        </div>

                        <div class="text-xs text-slate-600 flex items-center gap-1.5">
                            <i class="bi bi-geo-alt-fill text-emerald-600"></i>
                            <span class="font-semibold">{{ $sch->location }}</span>
                        </div>

                        <div class="text-xs text-slate-500 flex items-center gap-1.5">
                            <i class="bi bi-clock"></i>
                            <span>{{ substr($sch->start_time, 0, 5) }} - {{ substr($sch->end_time, 0, 5) }} WIB</span>
                        </div>

                        @if($sch->sanggaRooms->count() > 0)
                        <div class="mt-2 pt-2 border-t border-slate-200 text-[11px] space-y-1">
                            <span class="font-bold text-slate-700">Ruang Sangga:</span>
                            @foreach($sch->sanggaRooms as $sr)
                            <div class="flex justify-between text-slate-500 bg-white px-2 py-1 rounded border border-slate-100">
                                <span>{{ $sr->sangga ? $sr->sangga->name : 'Sangga' }}</span>
                                <span class="font-bold text-sky-700">{{ $sr->room_name }}</span>
                            </div>
                            @endforeach
                        </div>
                        @endif
                    </div>
                    @empty
                    <div class="col-span-2 text-center py-6 text-slate-400 text-xs">
                        Belum ada data alokasi ruangan terkini.
                    </div>
                    @endforelse
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button onclick="closeModal('modal-ruangan')" class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl">
                    Tutup
                </button>
            </div>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 4: HUBUNGI PETUGAS ESKUL                                           -->
    <!-- ========================================================================= -->
    <div id="modal-contact" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-sky-50 text-[#005288] flex items-center justify-center mx-auto text-2xl border border-sky-100 mb-3">
                    <i class="bi bi-headset"></i>
                </div>
                <h3 class="text-lg font-extrabold text-slate-900">Kontak Koordinator Eskul</h3>
                <p class="text-xs text-slate-500 mt-1">Hubungi ruang kesiswaan atau narahubung eskul di bawah ini</p>
            </div>

            <div class="space-y-3 text-xs font-semibold text-slate-700">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <i class="bi bi-whatsapp text-emerald-600 text-lg"></i>
                        <div>
                            <div>WhatsApp Kesiswaan</div>
                            <div class="text-[11px] text-slate-400 font-normal">+62 812-3456-7890</div>
                        </div>
                    </div>
                    <a href="https://wa.me/6281234567890" target="_blank" class="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">Chat</a>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <i class="bi bi-envelope-fill text-sky-600 text-lg"></i>
                        <div>
                            <div>Email Resmi Kesiswaan</div>
                            <div class="text-[11px] text-slate-400 font-normal">kesiswaan@sekolah.sch.id</div>
                        </div>
                    </div>
                    <a href="mailto:kesiswaan@sekolah.sch.id" class="px-3 py-1 bg-sky-700 text-white rounded-lg font-bold hover:bg-sky-800">Email</a>
                </div>
            </div>

            <button onclick="closeModal('modal-contact')" class="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl">
                Tutup
            </button>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- CLIENT JAVASCRIPT: TAB SWITCHING, LIVE SEARCH & REAL-TIME FILTERS       -->
    <!-- ========================================================================= -->
    <script>
        let currentDayFilter = 'all';
        let currentCategoryFilter = 'all';

        // Switch main view tabs (Jadwal vs Rekap 9 Minggu)
        function switchMainTab(tab) {
            const viewJadwal = document.getElementById('view-jadwal');
            const viewRekap = document.getElementById('view-rekap');
            const tabBtnJadwal = document.getElementById('tab-btn-jadwal');
            const tabBtnRekap = document.getElementById('tab-btn-rekap');
            const navBtnJadwal = document.getElementById('nav-btn-jadwal');
            const navBtnRekap = document.getElementById('nav-btn-rekap');

            if (tab === 'jadwal') {
                viewJadwal.classList.remove('hidden');
                viewRekap.classList.add('hidden');

                tabBtnJadwal.classList.add('active');
                tabBtnRekap.classList.remove('active');

                if (navBtnJadwal && navBtnRekap) {
                    navBtnJadwal.className = "px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-[#005288] text-white shadow-xs";
                    navBtnRekap.className = "px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all";
                }
            } else {
                viewJadwal.classList.add('hidden');
                viewRekap.classList.remove('hidden');

                tabBtnJadwal.classList.remove('active');
                tabBtnRekap.classList.add('active');

                if (navBtnJadwal && navBtnRekap) {
                    navBtnJadwal.className = "px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all";
                    navBtnRekap.className = "px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-[#005288] text-white shadow-xs";
                }
            }
        }

        function scrollToJadwal() {
            const el = document.getElementById('section-tabs');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Filter by Day
        function filterByDay(day, btn) {
            currentDayFilter = day;
            document.querySelectorAll('.day-filter-btn').forEach(b => {
                b.className = "day-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap";
            });
            btn.className = "day-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#005288] text-white border border-[#005288] transition-all whitespace-nowrap";
            filterEskulTable();
        }

        // Filter by Category
        function filterByCategory(cat, btn) {
            currentCategoryFilter = cat;
            document.querySelectorAll('.cat-filter-btn').forEach(b => {
                b.className = "cat-filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all whitespace-nowrap";
            });
            btn.className = "cat-filter-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 transition-all whitespace-nowrap";
            filterEskulTable();
        }

        // Live Table Filter (Search + Day + Category)
        function filterEskulTable() {
            const query = (document.getElementById('search-input').value || '').toLowerCase().trim();
            const rows = document.querySelectorAll('.eskul-row');
            let visibleCount = 0;

            rows.forEach(row => {
                const name = row.getAttribute('data-name') || '';
                const day = row.getAttribute('data-day') || '';
                const category = row.getAttribute('data-category') || '';
                const instructor = row.getAttribute('data-instructor') || '';
                const location = row.getAttribute('data-location') || '';

                const matchesSearch = query === '' || 
                    name.includes(query) || 
                    instructor.includes(query) || 
                    location.includes(query) || 
                    category.toLowerCase().includes(query);

                const matchesDay = currentDayFilter === 'all' || day === currentDayFilter;
                const matchesCategory = currentCategoryFilter === 'all' || category === currentCategoryFilter;

                if (matchesSearch && matchesDay && matchesCategory) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            const countEl = document.getElementById('showing-count');
            if (countEl) {
                countEl.innerText = visibleCount > 0 ? `1-${visibleCount}` : '0';
            }
        }

        // Rekap Table Search
        function filterRekapTable() {
            const query = (document.getElementById('rekap-search-input').value || '').toLowerCase().trim();
            const rows = document.querySelectorAll('.rekap-row');

            rows.forEach(row => {
                const name = row.getAttribute('data-name') || '';
                const instructor = row.getAttribute('data-instructor') || '';
                if (query === '' || name.includes(query) || instructor.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Modal Utilities
        function openModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('hidden');
            }
        }

        function closeModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('hidden');
            }
        }

        // Open Detailed Eskul Modal via AJAX
        function openEskulDetail(id) {
            fetch(`/api/eskul/${id}`)
                .then(res => res.json())
                .then(res => {
                    if (!res.success) {
                        alert(res.message || 'Gagal memuat detail');
                        return;
                    }
                    const data = res.data;
                    document.getElementById('modal-title').innerText = data.name;
                    document.getElementById('modal-category-badge').innerText = data.type;
                    document.getElementById('modal-members-count').innerText = `• ${data.total_members} Anggota Terdaftar`;
                    document.getElementById('modal-instruktur').innerHTML = `<i class="bi bi-person-fill"></i> Instruktur: <b>${data.instruktur}</b> (${data.instruktur_email})`;

                    // Sangga List
                    const sanggaBox = document.getElementById('modal-sangga-box');
                    const sanggaList = document.getElementById('modal-sangga-list');
                    sanggaList.innerHTML = '';
                    if (data.sanggas && data.sanggas.length > 0) {
                        sanggaBox.classList.remove('hidden');
                        data.sanggas.forEach(sg => {
                            sanggaList.innerHTML += `
                                <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                                    <div class="font-bold text-slate-800">${sg.name}</div>
                                    <div class="text-[11px] text-slate-500 mt-0.5">Ketua/PIC: <span class="font-semibold text-slate-700">${sg.pic}</span> • ${sg.members_count} Siswa</div>
                                </div>
                            `;
                        });
                    } else {
                        sanggaBox.classList.add('hidden');
                    }

                    // Schedules & Room List
                    const schedList = document.getElementById('modal-schedules-list');
                    schedList.innerHTML = '';
                    if (data.schedules && data.schedules.length > 0) {
                        data.schedules.forEach(sc => {
                            let roomsHtml = '';
                            if (sc.rooms && sc.rooms.length > 0) {
                                roomsHtml = `
                                    <div class="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                                        ${sc.rooms.map(r => `<span class="bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-bold border border-sky-200">${r.sangga}: ${r.room}</span>`).join('')}
                                    </div>
                                `;
                            }

                            schedList.innerHTML += `
                                <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <span class="px-2 py-0.5 rounded bg-[#005288] text-white font-extrabold text-[11px]">${sc.week}</span>
                                            <span class="font-bold text-slate-800 text-xs">${sc.date} (${sc.time})</span>
                                        </div>
                                        <span class="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                            <i class="bi bi-geo-alt-fill"></i> ${sc.location}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 font-medium">
                                        ${sc.material || 'Materi pembelajaran reguler'}
                                    </div>
                                    ${roomsHtml}
                                </div>
                            `;
                        });
                    } else {
                        schedList.innerHTML = '<div class="text-xs text-slate-400 py-4 text-center">Belum ada jadwal terdata.</div>';
                    }

                    openModal('modal-eskul-detail');
                })
                .catch(err => {
                    console.error(err);
                    alert('Terjadi kesalahan saat memuat data');
                });
        }

        // Student Self-Service Attendance Check (AJAX)
        function doCekPresensi() {
            const q = document.getElementById('nis-search-query').value.trim();
            const container = document.getElementById('presensi-result-container');
            if (!q) {
                alert('Silakan masukkan NIS atau Nama Siswa!');
                return;
            }

            container.innerHTML = `
                <div class="py-8 text-center text-slate-500 text-xs">
                    <i class="bi bi-arrow-repeat text-2xl animate-spin inline-block text-sky-600 mb-2"></i>
                    <div>Sedang mencari data kehadiran...</div>
                </div>
            `;

            fetch(`/api/cek-presensi?q=${encodeURIComponent(q)}`)
                .then(res => res.json())
                .then(res => {
                    if (!res.success) {
                        container.innerHTML = `
                            <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold text-center">
                                ${res.message}
                            </div>
                        `;
                        return;
                    }

                    container.innerHTML = '';
                    res.data.forEach(st => {
                        let historyHtml = '';
                        st.history.forEach(h => {
                            const badge = h.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                                         h.status === 'SAKIT' ? 'bg-amber-100 text-amber-800' :
                                         h.status === 'IZIN' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800';
                            historyHtml += `
                                <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                                    <div>
                                        <span class="font-bold text-slate-800">${h.eskul}</span>
                                        <span class="text-slate-400 text-[11px] ml-1">(${h.date})</span>
                                    </div>
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badge}">${h.status}</span>
                                </div>
                            `;
                        });

                        container.innerHTML += `
                            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <div class="font-extrabold text-slate-900 text-base">${st.name}</div>
                                        <div class="text-xs text-slate-500 font-semibold mt-0.5">NIS: <span class="text-slate-800">${st.nis}</span> • Rayon: <span class="text-slate-800">${st.rayon}</span></div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-black text-emerald-600">${st.percentage}%</div>
                                        <div class="text-[10px] font-bold text-slate-400">Kehadiran Global</div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-4 gap-2 text-center text-[11px]">
                                    <div class="bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-emerald-700">Hadir: ${st.hadir}</div>
                                    <div class="bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-amber-700">Sakit: ${st.sakit}</div>
                                    <div class="bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-blue-700">Izin: ${st.izin}</div>
                                    <div class="bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-rose-700">Alpa: ${st.alpa}</div>
                                </div>

                                <div class="bg-white p-3 rounded-lg border border-slate-200">
                                    <div class="font-bold text-xs text-slate-700 mb-2">Riwayat Presensi Per Jadwal:</div>
                                    <div class="max-h-36 overflow-y-auto custom-scrollbar">
                                        ${historyHtml || '<div class="text-xs text-slate-400 text-center">Belum ada riwayat.</div>'}
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                })
                .catch(err => {
                    console.error(err);
                    container.innerHTML = `<div class="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl text-center">Gagal menghubungi server.</div>`;
                });
        }
    </script>
</body>
</html>
