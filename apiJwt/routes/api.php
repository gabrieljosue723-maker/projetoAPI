<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::prefix('produtos')->group(function () {
        Route::get('/', [ProdutosController::class, 'index']);
        Route::get('/show/{id}', [ProdutosController::class, 'show']);
        Route::post('/store', [ProdutosController::class, 'store']);
        Route::put('/update/{id}', [ProdutosController::class, 'update']);
        Route::delete('/delete/{id}', [ProdutosController::class, 'destroy']);
        Route::get('/produtosDeletados', [ProdutosController::class, 'produtosDeletados']);
        Route::patch('/restore/{id}', [ProdutosController::class, 'restaurar']);
        Route::delete('/deletarPermanente/{id}', [ProdutosController::class, 'deletarPermanente']);
    });
});

