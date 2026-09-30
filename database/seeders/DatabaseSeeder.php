<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign keys and truncate all tables
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

        // 1. Roles Sistem SIBAS
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

        // 2. Akun Dummy Tiap Role (Hanya Akun Pengguna)
        $dummyUsers = [
            [
                'name' => 'Administrator Kesiswaan',
                'email' => 'admin@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 1,
            ],
            [
                'name' => 'Koordinator Ekstrakurikuler',
                'email' => 'koordinator@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 2,
            ],
            [
                'name' => 'Instruktur Eskul & Senbud',
                'email' => 'instruktur@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 3,
            ],
            [
                'name' => 'Pembimbing Siswa (PS)',
                'email' => 'ps@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 4,
            ],
            [
                'name' => 'Guru Pembimbing',
                'email' => 'guru@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 5,
            ],
            [
                'name' => 'Laboran Komputer',
                'email' => 'laboran@sekolah.sch.id',
                'password' => Hash::make('password123'),
                'role_id' => 6,
            ],
        ];

        foreach ($dummyUsers as $u) {
            User::create($u);
        }
    }
}
