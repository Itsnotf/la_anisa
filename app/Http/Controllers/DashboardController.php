<?php

namespace App\Http\Controllers;

use App\Models\PengukuranSinyal;
use App\Models\Provider;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $totalPengukuran = PengukuranSinyal::count();
        $totalWilayah = Wilayah::count();
        $totalProvider = Provider::count();
        $totalUser = User::count();


        $pengukuranPerProvider = PengukuranSinyal::query()
            ->join('providers', 'pengukuran_sinyals.provider_id', '=', 'providers.id')
            ->select('providers.name', DB::raw('count(*) as total'))
            ->groupBy('providers.name')
            ->orderBy('total', 'desc')
            ->get();


        $distribusiKekuatan = PengukuranSinyal::query()
            ->join('kekuatan_sinyals', 'pengukuran_sinyals.kekuatan_id', '=', 'kekuatan_sinyals.id')
            ->select('kekuatan_sinyals.name', DB::raw('count(*) as total'))
            ->groupBy('kekuatan_sinyals.name')
            ->get();


        $aktivitasTerbaru = PengukuranSinyal::with(['wilayah', 'provider', 'kekuatan'])
            ->latest()
            ->take(5)
            ->get();

        $dataPeta = PengukuranSinyal::with('wilayah', 'provider', 'kekuatan')->get()->filter(function ($item) {
            return $item->wilayah && $item->wilayah->latitude && $item->wilayah->longitude;
        })->values();


        return Inertia::render('dashboard', [
            'stats' => [
                'totalPengukuran' => $totalPengukuran,
                'totalWilayah' => $totalWilayah,
                'totalProvider' => $totalProvider,
                'totalUser' => $totalUser,
            ],
            'charts' => [
                'pengukuranPerProvider' => $pengukuranPerProvider,
                'distribusiKekuatan' => $distribusiKekuatan,
            ],
            'aktivitasTerbaru' => $aktivitasTerbaru,
            'dataPeta' => $dataPeta,
        ]);
    }
}
