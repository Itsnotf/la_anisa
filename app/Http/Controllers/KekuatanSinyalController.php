<?php

namespace App\Http\Controllers;

use App\Models\KekuatanSinyal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KekuatanSinyalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('kekuatan-sinyal/index', [
            'kekuatanSinyals' => KekuatanSinyal::all(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('kekuatan-sinyal/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        KekuatanSinyal::create($validated);

        return redirect()->route('kekuatanSinyal.index')->with('success', 'Kekuatan Sinyal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(KekuatanSinyal $kekuatanSinyal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('kekuatan-sinyal/edit', [
            'kekuatanSinyal' => KekuatanSinyal::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kekuatanSinyal = KekuatanSinyal::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        $kekuatanSinyal->update($validated);

        return redirect()->route('kekuatanSinyal.index')->with('success', 'Kekuatan Sinyal updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kekuatanSinyal = KekuatanSinyal::findOrFail($id);
        $kekuatanSinyal->delete();

        return redirect()->route('kekuatanSinyal.index')->with('success', 'Kekuatan Sinyal deleted successfully.');
    }
}
