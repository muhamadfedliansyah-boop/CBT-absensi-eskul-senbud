<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Eskul;
use App\Models\Rayon;
use App\Models\Role;
use App\Models\Sangga;
use App\Models\SanggaScheduleRoom;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('attendances')->truncate();
        DB::table('sangga_schedule_rooms')->truncate();
        DB::table('sangga_members')->truncate();
        DB::table('sanggas')->truncate();
        DB::table('schedules')->truncate();
        DB::table('student_eskuls')->truncate();
        DB::table('students')->truncate();
        DB::table('eskuls')->truncate();
        DB::table('rayons')->truncate();
        DB::table('users')->truncate();
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Roles
        $rolesData = [
            ['id' => 1, 'name' => 'Admin'],
            ['id' => 2, 'name' => 'Koordinator Eskul'],
            ['id' => 3, 'name' => 'Instruktur'],
            ['id' => 4, 'name' => 'Pembimbing'],
            ['id' => 5, 'name' => 'Guru'],
            ['id' => 6, 'name' => 'Laboran'],
        ];
        foreach ($rolesData as $r) {
            Role::create($r);
        }

        // 2. Users / Instructors & PS
        $instructors = [
            ['name' => 'Coach Hendra Wijaya, S.Pd', 'email' => 'hendra@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Ibu Nimas Ayu, M.Sn', 'email' => 'nimas@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Pak Fajar Ramadhan, S.Kom', 'email' => 'fajar@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Dimas Prakoso', 'email' => 'dimas@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Sarah Amanda, M.Ed', 'email' => 'sarah@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Raden Bagus Prasetyo', 'email' => 'raden@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Aditya Pratama, S.T', 'email' => 'aditya@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Kak Dian & Kak Rizki', 'email' => 'pramuka@sekolah.sch.id', 'role_id' => 3],
            ['name' => 'Budi Santoso, S.Pd (PS Ciawi)', 'email' => 'ps.ciawi@sekolah.sch.id', 'role_id' => 4],
            ['name' => 'Siti Nurhaliza, M.Pd (PS Cicurug)', 'email' => 'ps.cicurug@sekolah.sch.id', 'role_id' => 4],
            ['name' => 'Bu Elvia (Admin Kesiswaan)', 'email' => 'elvia@sekolah.sch.id', 'role_id' => 1],
            ['name' => 'Admin Sekolah', 'email' => 'admin@sekolah.sch.id', 'role_id' => 1],
        ];
        $createdUsers = [];
        foreach ($instructors as $u) {
            $createdUsers[] = User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password123'),
                'role_id' => $u['role_id'],
            ]);
        }

        // 3. Rayons
        $rayonsList = ['Ciawi 1', 'Ciawi 2', 'Cicurug 1', 'Cicurug 2', 'Tajur 1', 'Tajur 2', 'Wikrama 1', 'Wikrama 2', 'Sukasari 1', 'Sukasari 2'];
        $createdRayons = [];
        foreach ($rayonsList as $i => $rName) {
            $createdRayons[] = Rayon::create([
                'name' => $rName,
                'ps_id' => $createdUsers[8]->id,
            ]);
        }

        // 4. Eskuls
        $eskulsData = [
            [
                'name' => 'Bola Basket Satria',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[0]->id,
            ],
            [
                'name' => 'Tari Tradisional & Karawitan',
                'type' => 'SENBUD',
                'instruktur_id' => $createdUsers[1]->id,
            ],
            [
                'name' => 'Robotika & IoT Innovation',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[2]->id,
            ],
            [
                'name' => 'Band & Musik Modern',
                'type' => 'SENBUD',
                'instruktur_id' => $createdUsers[3]->id,
            ],
            [
                'name' => 'English Debate Society',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[4]->id,
            ],
            [
                'name' => 'Teater & Seni Peran Kencana',
                'type' => 'SENBUD',
                'instruktur_id' => $createdUsers[5]->id,
            ],
            [
                'name' => 'Koding & Game Development',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[6]->id,
            ],
            [
                'name' => 'Pramuka Inti Gugus Depan',
                'type' => 'PRAMUKA',
                'instruktur_id' => $createdUsers[7]->id,
            ],
            [
                'name' => 'Futsal Garuda Mandiri',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[0]->id,
            ],
            [
                'name' => 'Badminton Prestasi',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[0]->id,
            ],
            [
                'name' => 'Karya Ilmiah Remaja (KIR)',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[2]->id,
            ],
            [
                'name' => 'Desain Grafis & Multimedia',
                'type' => 'ESKUL',
                'instruktur_id' => $createdUsers[6]->id,
            ],
        ];

        $createdEskuls = [];
        foreach ($eskulsData as $e) {
            $createdEskuls[] = Eskul::create($e);
        }

        // 5. Students
        $firstNames = ['Ahmad', 'Rafi', 'Naufal', 'Dimas', 'Alif', 'Fajar', 'Zaky', 'Bintang', 'Arya', 'Farhan', 'Syifa', 'Zahra', 'Alya', 'Nabila', 'Salma', 'Putri', 'Tiara', 'Citra', 'Maya', 'Annisa'];
        $lastNames = ['Pratama', 'Saputra', 'Ramadhan', 'Hidayat', 'Kusuma', 'Nugraha', 'Maulana', 'Firmansyah', 'Santoso', 'Wijaya', 'Lestari', 'Wulandari', 'Anggraini', 'Utami', 'Pertiwi'];

        $createdStudents = [];
        $nisCounter = 12301001;
        for ($i = 0; $i < 60; $i++) {
            $name = $firstNames[$i % count($firstNames)] . ' ' . $lastNames[($i * 3) % count($lastNames)];
            $rayon = $createdRayons[$i % count($createdRayons)];
            $student = Student::create([
                'nis' => (string)($nisCounter + $i),
                'name' => $name,
                'rayon_id' => $rayon->id,
            ]);
            $createdStudents[] = $student;

            // Assign to 1-2 eskuls
            $assignedEskuls = [$createdEskuls[$i % count($createdEskuls)]->id];
            if ($i % 3 === 0) {
                $assignedEskuls[] = $createdEskuls[7]->id; // Pramuka
            }
            $student->eskuls()->attach($assignedEskuls);
        }

        // 6. Sangga (Pramuka)
        $sanggaNames = [
            'Sangga Perintis 1 (Putra)',
            'Sangga Penegas 2 (Putri)',
            'Sangga Pendobrak 3 (Putra)',
            'Sangga Pelaksana 4 (Putri)',
        ];
        $createdSanggas = [];
        foreach ($sanggaNames as $idx => $sName) {
            $sangga = Sangga::create([
                'name' => $sName,
                'eskul_id' => $createdEskuls[7]->id,
                'pic_student_id' => $createdStudents[$idx]->id,
            ]);
            // Attach 8 students to each sangga
            $memberIds = [];
            for ($k = 0; $k < 8; $k++) {
                $memberIds[] = $createdStudents[($idx * 8 + $k) % count($createdStudents)]->id;
            }
            $sangga->members()->attach($memberIds);
            $createdSanggas[] = $sangga;
        }

        // 7. Schedules & Sangga Rooms for 9 Weeks (M1 - M9)
        $startDate = Carbon::parse('2024-09-01');
        $locations = [
            'Lapangan Basket Utama (Outdoor Barat)',
            'Pendopo Seni & Budaya (Gedung Kesenian Lt. 1)',
            'Lab Komputer 3 (Gedung ICT Lt. 2)',
            'Studio Musik Akustik (Gedung Budaya Lt. 2)',
            'Ruang Audiovisual 1 (Perpustakaan Lt. 2)',
            'Aula Teater Mini Lt. 2 (Sayap Timur)',
            'Lab Multimedia 1 (Gedung ICT Lt. 1)',
            'Lapangan Upacara Utama (Plaza Tengah)',
            'Lapangan Futsal Indoor',
            'GOR Bulutangkis Gelora',
            'Lab IPA Terpadu',
            'Lab Desain Komputer',
        ];

        $materials = [
            'M1: Pengenalan Silabus, Kontrak Belajar & Orientasi Anggota Baru',
            'M2: Penguasaan Teknik Dasar & Pengenalan Perangkat/Alat Latihan',
            'M3: Pendalaman Teori & Latihan Praktik Terbimbing Kelompok',
            'M4: Sesi Diskusi Analisis Taktik & Persiapan Pra-Ujian Tengah Semester',
            'M5: Eksplorasi Materi Lanjutan & Studi Kasus Pembelajaran',
            'M6: Simulasi Praktik Lapangan & Evaluasi Formatif Mingguan',
            'M7: Pengayaan Keterampilan & Penyusunan Proyek Karya Kreatif',
            'M8: Gladi Bersih, Uji Coba Pementasan & Penampilan Kelompok',
            'M9: Evaluasi Akhir Semester & Pengambilan Nilai Rapor Eskul',
        ];

        $scheduleList = [];
        for ($week = 1; $week <= 9; $week++) {
            $actDate = $startDate->copy()->addWeeks($week - 1);

            foreach ($createdEskuls as $eIdx => $eskul) {
                $sched = Schedule::create([
                    'eskul_id' => $eskul->id,
                    'activity_date' => $actDate->format('Y-m-d'),
                    'start_time' => '15:00:00',
                    'end_time' => '17:00:00',
                    'location' => $locations[$eIdx % count($locations)],
                    'material_text' => $materials[$week - 1],
                    'photo_url' => null,
                ]);
                $scheduleList[] = $sched;

                // If Pramuka, assign sangga rooms
                if ($eskul->type === 'PRAMUKA') {
                    $rooms = ['Ruang Kelas X-RPL 1', 'Ruang Kelas X-TKJ 2', 'Ruang Kelas XI-DKV 1', 'Ruang Kelas XI-PPLG 2'];
                    foreach ($createdSanggas as $sIdx => $sg) {
                        SanggaScheduleRoom::create([
                            'schedule_id' => $sched->id,
                            'sangga_id' => $sg->id,
                            'room_name' => $rooms[$sIdx % count($rooms)],
                        ]);
                    }
                }

                // Generate Attendance records for students of this eskul
                $eskulStudents = $eskul->students()->get();
                foreach ($eskulStudents as $st) {
                    $rand = rand(1, 100);
                    $status = 'HADIR';
                    if ($rand > 95) {
                        $status = 'ALPA';
                    } elseif ($rand > 90) {
                        $status = 'SAKIT';
                    } elseif ($rand > 85) {
                        $status = 'IZIN';
                    }

                    Attendance::create([
                        'schedule_id' => $sched->id,
                        'student_id' => $st->id,
                        'status' => $status,
                        'recorded_by' => $eskul->instruktur_id,
                        'dispensasi_by' => null,
                        'notes' => $status === 'HADIR' ? 'Tepat Waktu' : null,
                    ]);
                }
            }
        }
    }
}
