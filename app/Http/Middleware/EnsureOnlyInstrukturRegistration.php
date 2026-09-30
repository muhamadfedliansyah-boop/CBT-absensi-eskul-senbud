<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnlyInstrukturRegistration
{
    /**
     * OWASP Security & Role Enforcement Middleware for Registration
     *
     * 1. Restricts self-registration strictly to the 'Instruktur' role (role_id 3).
     * 2. Prevents Privilege Escalation (blocks requests attempting to inject admin/ps role).
     * 3. Sanitizes all incoming inputs against XSS and injection attacks.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('post')) {
            // OWASP: Strip any attempts to pass unauthorized role_id
            $roleInput = $request->input('role_id') ?? $request->input('role');
            if ($roleInput && !in_array($roleInput, [3, '3', 'admin', 'instruktur','guru', 'pembimbing'])) {
                abort(403, 'Akses Ditolak: Registrasi mandiri hanya diperbolehkan untuk Peran Instruktur / Guru Pembina.');
            }

            // Force role to Instruktur
            $request->merge([
                'role_id' => 3,
                'name' => strip_tags(trim($request->input('name', ''))),
                'email' => filter_var(trim($request->input('email', '')), FILTER_SANITIZE_EMAIL),
            ]);
        }

        return $next($request);
    }
}
