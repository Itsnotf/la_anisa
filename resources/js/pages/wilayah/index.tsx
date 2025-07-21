import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Wilayah, type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { WilayahColumns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wilayah',
        href: '/wilayah',
    },
];


interface Props {
    wilayahs: Wilayah[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function WilayahIndex({ wilayahs, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [wilayahToDelete, setWilayahToDelete] = useState<number | null>(null);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };
    const canEdit = can('edit-wilayah', auth);
    const canDelete = can('delete-wilayah', auth);
    const canCreate = can('create-wilayah', auth);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setWilayahToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (wilayahToDelete) {
            destroy(`/wilayah/${wilayahToDelete}`, {
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
            <Head title="Wilayahs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={WilayahColumns(canEdit, canDelete, handleDelete)} data={wilayahs} page="wilayah" canCreate={canCreate} />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Delete Wilayah</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this wilayah?</p>
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
