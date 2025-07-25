<?php

namespace App\Http\Controllers;

use App\Models\KekuatanSinyal;
use App\Models\Laporan;
use App\Models\PengukuranSinyal;
use App\Models\Provider;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Menampilkan halaman utama dengan peta dan filter.
     */
     public function index(Request $request)
    {
        $request->validate([
            'provider_id' => 'nullable|integer|exists:providers,id',
            'kekuatan_id' => 'nullable|integer|exists:kekuatan_sinyals,id',
            'wilayah_id'  => 'nullable|integer|exists:wilayahs,id',
        ]);

        $dataPetaQuery = PengukuranSinyal::query()
            ->with(['wilayah', 'provider', 'kekuatan']);

        $dataPetaQuery
            ->when($request->input('provider_id'), function ($query, $providerId) {
                $query->where('provider_id', $providerId);
            })
            ->when($request->input('kekuatan_id'), function ($query, $kekuatanId) {
                $query->where('kekuatan_id', $kekuatanId);
            })
            ->when($request->input('wilayah_id'), function ($query, $wilayahId) {
                $selectedWilayah = Wilayah::find($wilayahId);
                if ($selectedWilayah) {
                    $query->whereHas('wilayah', function ($q) use ($selectedWilayah) {
                        $q->where('kabupaten', $selectedWilayah->kabupaten); // <-- DISESUAIKAN
                    });
                }
            });

        $dataPeta = $dataPetaQuery->get()->filter(function ($item) {
            return $item->wilayah && $item->wilayah->latitude && $item->wilayah->longitude;
        })->values();

        $uniqueWilayahs = Wilayah::select('id', 'kabupaten') // <-- DISESUAIKAN
                                ->groupBy('kabupaten', 'id')      // <-- DISESUAIKAN
                                ->orderBy('kabupaten', 'asc')     // <-- DISESUAIKAN
                                ->get();

        return Inertia::render('welcome', [
            'dataPeta'        => $dataPeta,
            'providers'       => Provider::all(['id', 'name']),
            'wilayahs'        => $uniqueWilayahs,
            'kekuatanSinyals' => KekuatanSinyal::all(['id', 'name']),
            'filters'         => $request->only(['provider_id', 'kekuatan_id', 'wilayah_id']),
            'flash'           => [
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
