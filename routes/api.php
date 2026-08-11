<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\WeddingsController;
use App\Http\Controllers\Api\CustomisationController;
use App\Http\Controllers\Api\JewelleryController;
use App\Http\Controllers\Api\EventsController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;

Route::prefix('v1')->group(function () {
    
    // ===================================
    // 1. Auth Endpoints
    // ===================================
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // ===================================
    // 2. Home Feed & Dynamic Collections
    // ===================================
    Route::get('/home/feed', [HomeController::class, 'getFeed']);
    Route::get('/home/collections', [HomeController::class, 'getCollections']);

    // ===================================
    // 3. Weddings Hub
    // ===================================
    Route::get('/weddings/hub', [WeddingsController::class, 'getHub']);
    Route::post('/bookings/consultation', [WeddingsController::class, 'bookConsultation']);

    // ===================================
    // 4. Customisation Atelier
    // ===================================
    Route::get('/customisation/studios', [CustomisationController::class, 'getStudios']);
    Route::get('/customisation/options', [CustomisationController::class, 'getOptions']);

    // ===================================
    // 5. High Jewellery Vault
    // ===================================
    Route::get('/jewellery/hub', [JewelleryController::class, 'getHub']);
    Route::get('/jewellery/products', [JewelleryController::class, 'getProducts']);

    // ===================================
    // 6. Events & VIP Passbook
    // ===================================
    Route::get('/events', [EventsController::class, 'getEvents']);

    // ===================================
    // 7. Products Catalog & Categories
    // ===================================
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);


    // ===================================
    // Authenticated Protected Routes
    // ===================================
    Route::middleware('auth:api')->group(function () {
        // Customisation Requests & Orders
        Route::post('/customisation/requests', [CustomisationController::class, 'submitRequest']);
        Route::get('/customisation/orders', [CustomisationController::class, 'getOrders']);

        // VIP Event RSVPs
        Route::post('/events/rsvp', [EventsController::class, 'rsvp']);
        Route::get('/events/my-passes', [EventsController::class, 'getMyPasses']);

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/add', [CartController::class, 'add']);
        Route::put('/cart/items/{id}', [CartController::class, 'update']);
        Route::delete('/cart/items/{id}', [CartController::class, 'remove']);

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

        // Orders & Addresses
        Route::get('/user/orders', [OrderController::class, 'index']);
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/user/addresses', [AddressController::class, 'index']);
        Route::post('/user/addresses', [AddressController::class, 'store']);
    });
});