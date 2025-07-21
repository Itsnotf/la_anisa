<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengukuranSinyal extends Model
{
    use HasFactory;

    protected $fillable = [
        'wilayah_id',
        'provider_id',
        'kekuatan_id',
        'tanggal_pengukuran',
        'catatan',
    ];

    public function wilayah()
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function kekuatan()
    {
        return $this->belongsTo(KekuatanSinyal::class);
    }
}
