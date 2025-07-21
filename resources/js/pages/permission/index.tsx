import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PermissionColumns } from './columns';
import { DataTable } from '@/components/DataTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

interface Props {
    permissions: Permission[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Permissions({ permissions, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };
    const canEdit = can('edit-permission', auth);
    const canDelete = can('delete-permission', auth);
    const canCreate = can('create-permission', auth);


    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setPermissionToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (permissionToDelete) {
            destroy(`/permission/${permissionToDelete}`, {
                onSuccess: () => {
                    setOpen(false);
                },
            });
        }
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <DataTable columns={PermissionColumns(canEdit, canDelete, handleDelete)} data={permissions} page='permission' canCreate={canCreate}/>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Delete Permission</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this permission?</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button color="destructive" onClick={confirmDelete}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
