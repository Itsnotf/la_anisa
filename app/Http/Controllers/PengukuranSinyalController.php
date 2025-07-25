<?php

namespace App\Http\Controllers;

use App\Models\KekuatanSinyal;
use App\Models\PengukuranSinyal;
use App\Models\Provider;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengukuranSinyalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'kecamatan' => 'nullable|string',
            'kabupaten' => 'nullable|string',
            'provider_id' => 'nullable|integer|exists:providers,id',
            'kekuatan_id' => 'nullable|integer|exists:kekuatan_sinyals,id',
            'tanggal_mulai' => 'nullable',
            'tanggal_selesai' => 'nullable',
        ]);

        $pengukuranSinyals = $this->buildPengukuranSinyalQuery($request)->get();


        return Inertia::render('pengukuran-sinyal/index', [
            'pengukuranSinyals' => $pengukuranSinyals,
            'providers' => Provider::all(),
            'kekuatanSinyals' => KekuatanSinyal::all(),
            'allKecamatans' => Wilayah::select('kecamatan')->distinct()->pluck('kecamatan'),
            'allKabupatens' => Wilayah::select('kabupaten')->distinct()->pluck('kabupaten'),
            'filters' => $request->only(['kecamatan', 'kabupaten', 'provider_id', 'kekuatan_id', 'tanggal_mulai', 'tanggal_selesai']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    private function buildPengukuranSinyalQuery(Request $request)
    {
        $pengukuran = PengukuranSinyal::query()
            ->with(['wilayah', 'provider', 'kekuatan'])
            ->when($request->input('provider_id'), function ($query, $providerId) {
                $query->where('provider_id', $providerId);
            })
            ->when($request->input('kekuatan_id'), function ($query, $kekuatanId) {
                $query->where('kekuatan_id', $kekuatanId);
            })
            ->when($request->input('kecamatan'), function ($query, $kecamatan) {
                $query->whereHas('wilayah', function ($q) use ($kecamatan) {
                    $q->where('kecamatan', $kecamatan);
            });
            })
            ->when($request->input('kabupaten'), function ($query, $kabupaten) {
                $query->whereHas('wilayah', function ($q) use ($kabupaten) {
                    $q->where('kabupaten', $kabupaten);
                });
            })
            ->when($request->input('tanggal_mulai'), function ($query, $tanggalMulai) {
                $query->whereRaw("STR_TO_DATE(tanggal_pengukuran, '%d/%m/%Y') >= STR_TO_DATE(?, '%d/%m/%Y')", [$tanggalMulai]);
            })
            ->when($request->input('tanggal_selesai'), function ($query, $tanggalSelesai) {
                $query->whereRaw("STR_TO_DATE(tanggal_pengukuran, '%d/%m/%Y') <= STR_TO_DATE(?, '%d/%m/%Y')", [$tanggalSelesai]);
            });

            // dd($pengukuran->toSql(), $pengukuran->getBindings());
        return $pengukuran;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pengukuran-sinyal/create', [
            'wilayahs' => Wilayah::all(),
            'providers' => Provider::all(),
            'kekuatanSinyals' => KekuatanSinyal::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'wilayah_id' => 'required|exists:wilayahs,id',
            'provider_id' => 'required|exists:providers,id',
            'kekuatan_id' => 'required|exists:kekuatan_sinyals,id',
            'tanggal_pengukuran' => 'required',
            'catatan' => 'nullable|string|max:1000',
        ]);

        PengukuranSinyal::create($validated);

        return redirect()->route('pengukuranSinyal.index')->with('success', 'Pengukuran Sinyal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PengukuranSinyal $pengukuranSinyal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('pengukuran-sinyal/edit', [
            'pengukuranSinyal' => PengukuranSinyal::findOrFail($id),
            'wilayahs' => Wilayah::all(),
            'providers' => Provider::all(),
            'kekuatanSinyals' => KekuatanSinyal::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pengukuranSinyal = PengukuranSinyal::findOrFail($id);

        $validated = $request->validate([
            'wilayah_id' => 'required|exists:wilayahs,id',
            'provider_id' => 'required|exists:providers,id',
            'kekuatan_id' => 'required|exists:kekuatan_sinyals,id',
            'tanggal_pengukuran' => 'required',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $pengukuranSinyal->update($validated);

        return redirect()->route('pengukuranSinyal.index')->with('success', 'Pengukuran Sinyal updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengukuranSinyal = PengukuranSinyal::findOrFail($id);
        $pengukuranSinyal->delete();

        return redirect()->route('pengukuranSinyal.index')->with('success', 'Pengukuran Sinyal deleted successfully.');
    }

    public function downloadPdf(Request $request)
    {
        $request->validate([
            'kecamatan' => 'nullable|string',
            'kabupaten' => 'nullable|string',
            'provider_id' => 'nullable|integer|exists:providers,id',
            'kekuatan_id' => 'nullable|integer|exists:kekuatan_sinyals,id',
            'tanggal_mulai' => 'nullable',
            'tanggal_selesai' => 'nullable',
        ]);

        $laporanData = $this->buildPengukuranSinyalQuery($request)->get();

        // dd($laporanData->toArray());

        $pdf = Pdf::loadView('reports.pengukuran_sinyal_pdf', [
            'data' => $laporanData,
            'filters' => $request->all()
        ]);
        $pdf->setPaper('a4', 'landscape');

        $fileName = 'laporan-pengukuran-sinyal-' . date('Y-m-d') . '.pdf';
        return $pdf->download($fileName);
    }
}
