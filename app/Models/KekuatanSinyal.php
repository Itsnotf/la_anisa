<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KekuatanSinyal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'deskripsi',
    ];

    public function pengukuranSinyals()
    {
        return $this->hasMany(PengukuranSinyal::class);
    }

}
