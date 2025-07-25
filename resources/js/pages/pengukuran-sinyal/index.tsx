import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { KekuatanSinyal, PengukuranSinyal, Provider, type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
// Impor ikon baru
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, FileDown, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PengukuranSinyalColumns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengukuran Sinyal',
        href: '/pengukuranSinyal',
    },
];

interface Props {
    pengukuranSinyals: PengukuranSinyal[];
    providers: Provider[];
    kekuatanSinyals: KekuatanSinyal[];
    allKecamatans: string[];
    allKabupatens: string[];
    filters: {
        kecamatan?: string;
        kabupaten?: string;
        provider_id?: string;
        kekuatan_id?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

const pickBy = (obj: object) =>
    Object.entries(obj)
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export default function PengukuranSinyalIndex({
    pengukuranSinyals,
    providers,
    kekuatanSinyals,
    allKecamatans,
    allKabupatens,
    filters: initialFilters,
    flash,
}: Props) {
    const [open, setOpen] = useState(false);
    const [pengukuranSinyalToDelete, setPengukuranSinyalToDelete] = useState<number | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        kecamatan: initialFilters.kecamatan || '',
        kabupaten: initialFilters.kabupaten || '',
        provider_id: initialFilters.provider_id || '',
        kekuatan_id: initialFilters.kekuatan_id || '',
        tanggal_mulai: initialFilters.tanggal_mulai ? new Date(initialFilters.tanggal_mulai.split('/').reverse().join('-')) : undefined,
        tanggal_selesai: initialFilters.tanggal_selesai ? new Date(initialFilters.tanggal_selesai.split('/').reverse().join('-')) : undefined,
    });

    const page = usePage().props as any;
    const auth = page.auth ?? { permissions: [] };
    const canEdit = can('edit-pengukuranSinyal', auth);
    const canDelete = can('delete-pengukuranSinyal', auth);
    const canCreate = can('create-pengukuranSinyal', auth);

    const { delete: destroy } = useForm();

    const applyFilters = () => {
        const formattedFilters = {
            ...filters,
            tanggal_mulai: filters.tanggal_mulai ? format(filters.tanggal_mulai, 'dd/MM/yyyy') : undefined,
            tanggal_selesai: filters.tanggal_selesai ? format(filters.tanggal_selesai, 'dd/MM/yyyy') : undefined,
        };

        router.get('/pengukuranSinyal', pickBy(formattedFilters), {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setFilters({
            kecamatan: '',
            kabupaten: '',
            provider_id: '',
            kekuatan_id: '',
            tanggal_mulai: undefined,
            tanggal_selesai: undefined,
        });
        router.get(
            '/pengukuranSinyal',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        setPengukuranSinyalToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (pengukuranSinyalToDelete) {
            destroy(`/pengukuranSinyal/${pengukuranSinyalToDelete}`, {
                onSuccess: () => setOpen(false),
            });
        }
    };

    const handleDownloadPdf = () => {
        const formattedFilters = {
            ...filters,
            tanggal_mulai: filters.tanggal_mulai ? format(filters.tanggal_mulai, 'dd/MM/yyyy') : undefined,
            tanggal_selesai: filters.tanggal_selesai ? format(filters.tanggal_selesai, 'dd/MM/yyyy') : undefined,
        };

        const queryParams = new URLSearchParams(pickBy(formattedFilters) as any).toString();
        const url = '/pengukuranSinyal/download-pdf?' + queryParams;

        window.open(url, '_blank');
    };

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PengukuranSinyals" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {isFilterOpen ? 'Sembunyikan' : 'Tampilkan'} Filter
                        {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                    </Button>
                </div>

                {isFilterOpen && (
                    <div className="animate-in fade-in-0 zoom-in-50 rounded-lg border p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <Select value={filters.kabupaten} onValueChange={(value) => setFilters((prev) => ({ ...prev, kabupaten: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kabupaten" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allKabupatens.map((kab) => (
                                        <SelectItem key={kab} value={kab}>
                                            {kab}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filters.kecamatan} onValueChange={(value) => setFilters((prev) => ({ ...prev, kecamatan: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allKecamatans.map((kec) => (
                                        <SelectItem key={kec} value={kec}>
                                            {kec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filters.provider_id} onValueChange={(value) => setFilters((prev) => ({ ...prev, provider_id: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {providers.map((p) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filters.kekuatan_id} onValueChange={(value) => setFilters((prev) => ({ ...prev, kekuatan_id: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kekuatan Sinyal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kekuatanSinyals.map((k) => (
                                        <SelectItem key={k.id} value={k.id.toString()}>
                                            {k.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('justify-start text-left font-normal', !filters.tanggal_mulai && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.tanggal_mulai ? (
                                            format(filters.tanggal_mulai, 'PPP', { locale: localeID })
                                        ) : (
                                            <span>Tanggal Mulai</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filters.tanggal_mulai}
                                        onSelect={(date) => setFilters((prev) => ({ ...prev, tanggal_mulai: date }))}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('justify-start text-left font-normal', !filters.tanggal_selesai && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.tanggal_selesai ? (
                                            format(filters.tanggal_selesai, 'PPP', { locale: localeID })
                                        ) : (
                                            <span>Tanggal Selesai</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filters.tanggal_selesai}
                                        onSelect={(date) => setFilters((prev) => ({ ...prev, tanggal_selesai: date }))}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="secondary" onClick={handleDownloadPdf}>
                                <FileDown className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                            <Button variant="outline" onClick={resetFilters}>
                                <X className="mr-2 h-4 w-4" /> Reset
                            </Button>
                            <Button onClick={applyFilters}>Filter</Button>
                        </div>
                    </div>
                )}

                <DataTable
                    columns={PengukuranSinyalColumns(canEdit, canDelete, handleDelete)}
                    data={pengukuranSinyals}
                    page="pengukuranSinyal"
                    canCreate={canCreate}
                />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Hapus Pengukuran Sinyal</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Apakah Anda yakin ingin menghapus data ini?</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
