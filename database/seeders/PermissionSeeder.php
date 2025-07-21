<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'create-user',
            'edit-user',
            'delete-user',
            'show-user',
            'create-role',
            'edit-role',
            'delete-role',
            'show-role',
            'create-permission',
            'edit-permission',
            'delete-permission',
            'show-permission',
            'create-wilayah',
            'edit-wilayah',
            'delete-wilayah',
            'show-wilayah',
            'create-provider',
            'edit-provider',
            'delete-provider',
            'show-provider',
            'create-kekuatanSinyal',
            'edit-kekuatanSinyal',
            'delete-kekuatanSinyal',
            'show-kekuatanSinyal',
            'create-pengukuranSinyal',
            'edit-pengukuranSinyal',
            'delete-pengukuranSinyal',
            'show-pengukuranSinyal',
            'show-laporanMasyarakat',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
