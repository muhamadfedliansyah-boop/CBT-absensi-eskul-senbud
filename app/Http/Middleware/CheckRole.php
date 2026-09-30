<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu.');
        }

        $user = Auth::user();

        // If no specific role requested, allow authenticated user
        if (empty($roles)) {
            return $next($request);
        }

        // Check if user has any of the authorized roles
        if ($user->hasRole($roles)) {
            return $next($request);
        }

        // If unauthorized via JSON / API
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Forbidden. Anda tidak memiliki akses ke resource ini.',
            ], 403);
        }

        // Redirect to custom Inertia Forbidden page with context
        $userRoleName = $user->role ? $user->role->name : 'Tidak Diketahui';

        // Map the allowed role aliases to friendly names
        $roleLabels = [
            'admin'       => 'Administrator Kesiswaan',
            'koordinator' => 'Koordinator Kesiswaan',
            'instruktur'  => 'Instruktur Eskul & Senbud',
            'pembina'     => 'Pembina Ekstrakurikuler',
            'ps'          => 'Pembimbing Siswa (PS)',
            'pembimbing'  => 'Pembimbing Siswa',
            'guru'        => 'Guru / Wali Kelas',
            'laboran'     => 'Laboran',
        ];

        $requiredRoleLabels = collect($roles)->map(fn($r) => $roleLabels[$r] ?? ucfirst($r))->all();

        return Inertia::render('Errors/Forbidden', [
            'userRole'      => $userRoleName,
            'requiredRoles' => $requiredRoleLabels,
            'attemptedUrl'  => $request->path(),
            'dashboardUrl'  => '/dashboard',
        ])->toResponse($request)->setStatusCode(403);
    }
}
