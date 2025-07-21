<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KekuatanSinyalController;
use App\Http\Controllers\LaporanMasyarakatController;
use App\Http\Controllers\PengukuranSinyalController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WilayahController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::post('/laporanMasyarakat/create', [WelcomeController::class, 'storeReport'])->name('laporan.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('laporanMasyarakat', [LaporanMasyarakatController::class, 'index'])->name('laporan.index');
    route::resource('permission', PermissionController::class);
    route::resource('role', RoleController::class);
    route::resource('user', UserController::class);
    route::resource('wilayah', WilayahController::class);
    route::resource('kekuatanSinyal', KekuatanSinyalController::class);
    route::resource('provider', ProviderController::class);
    route::resource('pengukuranSinyal', PengukuranSinyalController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
