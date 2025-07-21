<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanMasyarakatController extends Controller
{
    public function index(){
        return Inertia::render('laporan-masyarakat/index', [
            'laporanMasyarakats' => Laporan::all(),
             'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }
}
