<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        $middleware->alias([
            'role'                      => \App\Http\Middleware\CheckRole::class,
            'only.instruktur.register'  => \App\Http\Middleware\EnsureOnlyInstrukturRegistration::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Handle 403 Forbidden — render halaman Inertia khusus
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() === 403 && !$request->expectsJson() && !$request->is('api/*')) {
                $message = $e->getMessage() ?: 'Anda tidak memiliki izin untuk mengakses halaman ini.';

                return Inertia::render('Errors/Forbidden', [
                    'userRole'      => $request->user()?->role?->name ?? 'Tidak Diketahui',
                    'requiredRoles' => [],
                    'attemptedUrl'  => $request->path(),
                    'dashboardUrl'  => '/dashboard',
                    'message'       => $message,
                ])->toResponse($request)->setStatusCode(403);
            }

            // Handle 404 Not Found — render halaman Inertia khusus
            if ($e->getStatusCode() === 404 && !$request->expectsJson() && !$request->is('api/*')) {
                return Inertia::render('Errors/NotFound', [
                    'attemptedUrl' => $request->path(),
                    'dashboardUrl' => '/dashboard',
                ])->toResponse($request)->setStatusCode(404);
            }
        });
    })->create();
