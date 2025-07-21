'use client';

import { Button } from '@/components/ui/button';
import { Wilayah } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';


export const WilayahColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<Wilayah>[] => [
    {
        accessorKey: 'desa',
        header: 'Desa',
    },
    {
        accessorKey: 'kecamatan',
        header: 'Kecamatan',
    },
    {
        accessorKey: 'kabupaten',
        header: 'Kabupaten',
    },
    {
        accessorKey: 'latitude',
        header: 'Latitude',
    },
    {
        accessorKey: 'longitude',
        header: 'Longitude',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const wilayah = row.original;

            return (
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link href={`/wilayah/${wilayah.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(wilayah.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
