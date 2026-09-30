<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Tampilkan Halaman Login
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Login');
    }

    /**
     * Proses Login Pengguna dengan OWASP Proteksi
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email:rfc,dns,filter'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email resmi sekolah / NIP wajib diisi.',
            'email.email' => 'Format email resmi tidak valid.',
            'password.required' => 'Password keamanan wajib diisi.',
        ]);

        // OWASP: Trim input & prevent session fixation
        $credentials['email'] = strtolower(trim($credentials['email']));

        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']], $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'))->with('success', 'Selamat datang kembali, ' . Auth::user()->name);
        }

        return back()->withErrors([
            'email' => 'Email resmi atau password keamanan yang Anda masukkan tidak sesuai.',
        ])->onlyInput('email');
    }

    /**
     * Tampilkan Halaman Register (Hanya untuk Instruktur / Pembina)
     */
    public function showRegisterForm()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Register');
    }

    /**
     * Proses Registrasi Akun Baru (Strictly Locked to Role Instruktur)
     */
    public function register(Request $request)
    {
        // OWASP Input Validation & Password Policy
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:150', 'regex:/^[a-zA-Z\s\.,\'-]+$/'],
            'email' => ['required', 'string', 'email:rfc,filter', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->numbers(),
            ],
            'terms' => ['accepted'],
        ], [
            'name.required' => 'Nama lengkap dan gelar wajib diisi.',
            'name.regex' => 'Nama hanya boleh mengandung huruf, spasi, dan tanda gelar.',
            'email.required' => 'Email resmi sekolah wajib diisi.',
            'email.email' => 'Format email resmi tidak valid.',
            'email.unique' => 'Email resmi ini sudah terdaftar. Silakan gunakan email lain atau login.',
            'password.required' => 'Password keamanan wajib diisi.',
            'password.min' => 'Password minimal harus 8 karakter.',
            'password.letters' => 'Password harus mengandung huruf.',
            'password.numbers' => 'Password harus mengandung setidaknya satu angka.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'terms.accepted' => 'Anda harus menyetujui ketentuan akun SIBAS.',
        ]);

        // OWASP: Find or verify the Instruktur Role ID
        $instrukturRole = Role::where('name', 'like', '%instruktur%')->first();
        $roleId = $instrukturRole ? $instrukturRole->id : 3;

        // Create the user with sanitized data & strictly forced Instruktur role
        User::create([
            'name' => strip_tags(trim($validated['name'])),
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'role_id' => $roleId, // Strictly Instruktur
        ]);

        // Strict Requirement: Redirect to Login page (NOT home) with friendly notification
        return redirect()->route('login')->with('success', 'Pendaftaran akun Instruktur berhasil! Akun Anda telah dibuat. Silakan login untuk melanjutkan.');
    }

    /**
     * Proses Logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Anda telah berhasil keluar dari sistem.');
    }
}
