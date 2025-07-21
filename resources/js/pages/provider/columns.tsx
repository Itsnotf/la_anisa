'use client';

import { Button } from '@/components/ui/button';
import { Provider, Wilayah } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';


export const ProviderColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<Provider>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const provider = row.original;

            return (
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link href={`/provider/${provider.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(provider.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
