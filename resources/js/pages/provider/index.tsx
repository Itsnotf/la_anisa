import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Provider, type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProviderColumns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Provider',
        href: '/provider',
    },
];


interface Props {
    providers: Provider[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function ProviderIndex({ providers, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState<number | null>(null);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };
    const canEdit = can('edit-provider', auth);
    const canDelete = can('delete-provider', auth);
    const canCreate = can('create-provider', auth);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setProviderToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (providerToDelete) {
            destroy(`/provider/${providerToDelete}`, {
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
            <Head title="Providers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={ProviderColumns(canEdit, canDelete, handleDelete)} data={providers} page="provider" canCreate={canCreate} />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Delete Provider</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this provider?</p>
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
