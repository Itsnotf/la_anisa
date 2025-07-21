<?php

namespace App\Http\Controllers;

use App\Models\KekuatanSinyal;
use App\Models\Laporan;
use App\Models\PengukuranSinyal;
use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Menampilkan halaman utama dengan peta dan filter.
     */
    public function index(Request $request)
    {
        // Validasi filter
        $request->validate([
            'provider_id' => 'nullable|integer|exists:providers,id',
            'kekuatan_id' => 'nullable|integer|exists:kekuatan_sinyals,id',
        ]);

        // Query dasar untuk data peta
        $dataPetaQuery = PengukuranSinyal::query()
            ->with(['wilayah', 'provider', 'kekuatan']);

        // Terapkan filter jika ada
        $dataPetaQuery
            ->when($request->input('provider_id'), function ($query, $providerId) {
                $query->where('provider_id', $providerId);
            })
            ->when($request->input('kekuatan_id'), function ($query, $kekuatanId) {
                $query->where('kekuatan_id', $kekuatanId);
            });

        // Ambil data peta yang sudah difilter
        $dataPeta = $dataPetaQuery->get()->filter(function ($item) {
            return $item->wilayah && $item->wilayah->latitude && $item->wilayah->longitude;
        })->values();

        // dd($dataPeta);

        return Inertia::render('welcome', [
            'dataPeta' => $dataPeta,
            'providers' => Provider::all(['id', 'name']),
            'kekuatanSinyals' => KekuatanSinyal::all(['id', 'name']),
            'filters' => $request->only(['provider_id', 'kekuatan_id']),
            'flash' => [
                'success' => session('success'),
            ]
        ]);
    }

    /**
     * Menyimpan laporan baru dari pengguna publik.
     */
    public function storeReport(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Laporan::create($request->all());

        return back()->with('success', 'Laporan Anda telah berhasil dikirim. Terima kasih!');
    }
}
