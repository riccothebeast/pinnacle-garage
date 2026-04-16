<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\MpesaController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public endpoints
Route::get('/products',      [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/orders',       [OrderController::class, 'store']);
Route::post('/mpesa/stkpush', [MpesaController::class, 'stkPush']);

// Admin-only endpoints (protected by Sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/products',           [ProductController::class, 'store']);
    Route::put('/products/{id}',       [ProductController::class, 'update']);
    Route::delete('/products/{id}',    [ProductController::class, 'destroy']);
});
