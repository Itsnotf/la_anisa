'use client';

import { Button } from '@/components/ui/button';
import { LaporanMasyarakat, Provider, Wilayah } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';


export const LaporanMasyarakatColumns = (): ColumnDef<LaporanMasyarakat>[] => [
    {
        accessorKey: 'title',
        header: 'Judul',
    },
    {
        accessorKey: 'description',
        header: 'Deskripsi',
    },
];
