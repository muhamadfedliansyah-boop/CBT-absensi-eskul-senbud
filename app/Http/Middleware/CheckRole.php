<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // If unauthorized
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Forbidden. Anda tidak memiliki akses ke resource ini.',
            ], 403);
        }

        abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengakses halaman ini.');
    }
}
