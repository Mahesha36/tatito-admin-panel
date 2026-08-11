<?php
/**
 * TATITO FASHIONS — Static Front-End Router
 * NEW: Serves the customer-facing front-end directly.
 * The front-end and admin panel are static HTML/JS apps (public/admin, public/frontend).
 * Backend (Laravel API) will be connected later — until then, no PHP framework needed.
 *
 * PREV (original Laravel bootstrap — commented out, will be restored when backend is connected):
 *
 * use Illuminate\Foundation\Application;
 * use Illuminate\Http\Request;
 *
 * define('LARAVEL_START', microtime(true));
 *
 * // Determine if the application is in maintenance mode...
 * if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
 *     require $maintenance;
 * }
 *
 * // Register the Composer autoloader...
 * require __DIR__.'/../vendor/autoload.php';
 *
 * // Bootstrap Laravel and handle the request...
 * // @var Application $app
 * $app = require_once __DIR__.'/../bootstrap/app.php';
 *
 * $app->handleRequest(Request::capture());
 */

// NEW: Route root URL to the frontend index page
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serve existing files in public/ directly (admin, frontend, assets, etc.)
if ($path !== '/' && $path !== '' && file_exists(__DIR__ . $path)) {
    return false; // Let the web server handle existing static files
}

// Root path → frontend home page
if ($path === '/' || $path === '') {
    header('Location: /frontend/index.html');
    exit;
}

// Any other path → try frontend, then 404
$frontendFile = __DIR__ . '/frontend' . $path;
if (file_exists($frontendFile)) {
    header('Location: /frontend' . $path);
    exit;
}

// Fallback 404
http_response_code(404);
header('Location: /frontend/404.html');
exit;
