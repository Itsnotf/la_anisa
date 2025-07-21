import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { LaporanMasyarakat, type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LaporanMasyarakatColumns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Masyarakat',
        href: '/laporanMasyarakat',
    },
];

interface Props {
    laporanMasyarakats: LaporanMasyarakat[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function LaporanMasyarakatIndex({ laporanMasyarakats, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [laporanMasyarakatToDelete, setLaporanMasyarakatToDelete] = useState<number | null>(null);

    const canCreate = false;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LaporanMasyarakats" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={LaporanMasyarakatColumns()} data={laporanMasyarakats} page="laporanMasyarakat" canCreate={canCreate} />
            </div>
        </AppLayout>
    );
}
