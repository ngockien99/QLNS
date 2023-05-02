<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TimekeepingController;
use App\Http\Controllers\Api\AcademicLevelController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\LevelController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\SpecicalizeController;
use App\Http\Controllers\Api\UserController;

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

  Route::get('get-time-sheet', [TimekeepingController::class, 'getTimeSheet']);

  // User
  Route::group(['prefix' => 'user'], function(){
    Route::get('list', [UserController::class, 'listUser']);
    Route::get('detail', [UserController::class, 'detailUser']);
    Route::put('update', [UserController::class, 'updateRole']);
    Route::delete('delete', [UserController::class, 'deleteUser']);
    Route::post('create', [UserController::class, 'createUser']);
  });

  // Academic level
  // Route::group(['prefix' => 'academic'], function(){
  //   Route::get('list', [AcademicLevelController::class, 'listAcademic']);
  //   Route::put('update', [AcademicLevelController::class, 'updateAcademic']);
  //   Route::delete('delete', [AcademicLevelController::class, 'deleteAcademic']);
  //   Route::post('create', [AcademicLevelController::class, 'createAcademic']);
  // });

  Route::group(['prefix' => 'contract'], function(){
    Route::get('list', [ContractController::class, 'listContract']);
    Route::get('detail', [ContractController::class, 'detailContract']);
    Route::post('update', [ContractController::class, 'updateContract']);
    Route::delete('delete', [ContractController::class, 'deleteContract']);
    Route::post('create', [ContractController::class, 'createContract']);
  });

  Route::group(['prefix' => 'department'], function(){
    Route::get('list', [DepartmentController::class, 'listDepartment']);
    Route::get('detail', [DepartmentController::class, 'detailDepartment']);
    Route::put('update', [DepartmentController::class, 'updateDepartment']);
    Route::delete('delete', [DepartmentController::class, 'deleteDepartment']);
    Route::post('create', [DepartmentController::class, 'createDepartment']);
  });

  Route::group(['prefix' => 'level'], function(){
    Route::get('list', [LevelController::class, 'listLevel']);
    Route::put('update', [LevelController::class, 'updateLevel']);
    Route::delete('delete', [LevelController::class, 'deleteLevel']);
    Route::post('create', [LevelController::class, 'createLevel']);
  });

  Route::group(['prefix' => 'position'], function(){
    Route::get('list', [PositionController::class, 'listPosition']);
    Route::put('update', [PositionController::class, 'updatePosition']);
    Route::delete('delete', [PositionController::class, 'deletePosition']);
    Route::post('create', [PositionController::class, 'createPosition']);
  });

  Route::group(['prefix' => 'payroll'], function(){
    Route::get('list', [PayrollController::class, 'listPayroll']);
    Route::get('detail', [PayrollController::class, 'detailPayroll']);
    Route::put('update', [PayrollController::class, 'updatePayroll']);
    Route::delete('delete', [PayrollController::class, 'deletePayroll']);
    Route::post('create', [PayrollController::class, 'createPayroll']);
  });

  Route::group(['prefix' => 'specialize'], function(){
    Route::get('list', [SpecicalizeController::class, 'listSpecialize']);
    Route::put('update', [SpecicalizeController::class, 'updateSpecialize']);
    Route::delete('delete', [SpecicalizeController::class, 'deleteSpecialize']);
    Route::post('create', [SpecicalizeController::class, 'createSpecialize']);
  });
});

// Route::post('checkin', [TimekeepingController::class, 'checkin']);
Route::group(['middleware' => 'jwt.refresh'], function(){
  Route::get('auth/refresh', [AuthController::class, 'refresh']);
});