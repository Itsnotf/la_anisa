'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

export const RoleColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<Role>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const role = row.original;

            return (
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link href={`/role/${role.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(role.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
