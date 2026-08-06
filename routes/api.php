<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1/auth')->group(function () {

    Route::post('/send-otp', [AuthController::class, 'sendOtp']);

    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

});
Route::middleware('auth:api')->group(function () {
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });
});