import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { KekuatanSinyal, Wilayah, type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KekuatanSinyalColumns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kekuatan Sinyal',
        href: '/kekuatanSinyal',
    },
];


interface Props {
    kekuatanSinyals: KekuatanSinyal[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function KekuatanSinyalIndex({ kekuatanSinyals, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [kekuatanSinyalToDelete, setKekuatanSinyalToDelete] = useState<number | null>(null);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };
    const canEdit = can('edit-kekuatanSinyal', auth);
    const canDelete = can('delete-kekuatanSinyal', auth);
    const canCreate = can('create-kekuatanSinyal', auth);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setKekuatanSinyalToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (kekuatanSinyalToDelete) {
            destroy(`/kekuatanSinyal/${kekuatanSinyalToDelete}`, {
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
            <Head title="KekuatanSinyals" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={KekuatanSinyalColumns(canEdit, canDelete, handleDelete)} data={kekuatanSinyals} page="kekuatanSinyal" canCreate={canCreate} />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Delete KekuatanSinyal</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this kekuatanSinyal?</p>
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
