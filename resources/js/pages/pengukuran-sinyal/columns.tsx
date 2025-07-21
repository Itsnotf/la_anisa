'use client';

import { Button } from '@/components/ui/button';
import { PengukuranSinyal, Wilayah } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';


export const PengukuranSinyalColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<PengukuranSinyal>[] => [
    {
        accessorKey: 'wilayah.desa',
        header: 'Desa',
    },
    {
        accessorKey: 'wilayah.kecamatan',
        header: 'Kecamatan',
    },
    {
        accessorKey: 'wilayah.kabupaten',
        header: 'Kabupaten',
    },
    {
        accessorKey: 'provider.name',
        header: 'Provider',
    },
    {
        accessorKey: 'kekuatan.name',
        header: 'Kekuatan Sinyal',
    },
    {
        accessorKey: 'tanggal_pengukuran',
        header: 'Tanggal Pengukuran',
    },
    {
        accessorKey: 'catatan',
        header: 'Catatan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const pengukuranSinyal = row.original;

            return (
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link href={`/pengukuranSinyal/${pengukuranSinyal.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(pengukuranSinyal.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
