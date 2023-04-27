<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TimekeepingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



//Login
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::group(['middleware' => 'jwt.auth'], function(){
  Route::post('auth/logout', [AuthController::class, 'logout']);
  Route::post('checkin', [TimekeepingController::class, 'checkin']);
  Route::post('checkout', [TimekeepingController::class, 'checkout']);
});
// Route::post('checkin', [TimekeepingController::class, 'checkin']);
Route::group(['middleware' => 'jwt.refresh'], function(){
  Route::get('auth/refresh', [AuthController::class, 'refresh']);
});