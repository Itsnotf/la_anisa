'use client';

import { Button } from '@/components/ui/button';
import { KekuatanSinyal, Wilayah } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';


export const KekuatanSinyalColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<KekuatanSinyal>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const kekuatanSinyal = row.original;

            return (
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link href={`/kekuatanSinyal/${kekuatanSinyal.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(kekuatanSinyal.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
