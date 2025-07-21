<?php

namespace App\Http\Controllers;

use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WilayahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         return Inertia::render('wilayah/index', [
            'wilayahs' => Wilayah::all(),
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
        return Inertia::render('wilayah/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'desa' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        Wilayah::create($validated);

        return redirect()->route('wilayah.index')->with('success', 'Wilayah created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Wilayah $wilayah)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('wilayah/edit', [
            'wilayah' =>  Wilayah::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $wilayah = Wilayah::findOrFail($id);

        $validated = $request->validate([
            'desa' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        $wilayah->update($validated);

        return redirect()->route('wilayah.index')->with('success', 'Wilayah updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $wilayah = Wilayah::findOrFail($id);
        $wilayah->delete();

        return redirect()->route('wilayah.index')->with('success', 'Wilayah deleted successfully.');
    }
}
