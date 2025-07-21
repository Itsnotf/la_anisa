import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { KekuatanSinyal, PengukuranSinyal, Provider, SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { lazy, Suspense, useEffect } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const LaporanSchema = z.object({
    title: z.string().min(1, 'Judul laporan harus diisi.'),
    description: z.string().min(1, 'Deskripsi laporan harus diisi.'),
});

interface Props {
    dataPeta: PengukuranSinyal[];
    providers: Provider[];
    kekuatanSinyals: KekuatanSinyal[];
    filters: {
        provider_id?: string;
        kekuatan_id?: string;
    };
    flash: {
        success?: string;
    };
}

const DynamicSignalMap = lazy(() => import('@/components/maps/SignalMap'));

const pickBy = (obj: object) =>
    Object.entries(obj)
        .filter(([, value]) => value)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export default function Welcome({ dataPeta, providers, kekuatanSinyals, filters: initialFilters, flash }: Props) {
    const { auth } = usePage<SharedData>().props;

    const form = useReactHookForm<z.infer<typeof LaporanSchema>>({
        resolver: zodResolver(LaporanSchema),
        defaultValues: { title: '', description: '' },
    });

    const { data: filters, setData } = useForm({
        provider_id: initialFilters.provider_id || '',
        kekuatan_id: initialFilters.kekuatan_id || '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    function handleFilterChange(key: 'provider_id' | 'kekuatan_id', value: string) {
        setData(key, value);
    }

    function applyFilters() {
        router.get(route('home'), pickBy(filters), {
            preserveState: true,
            replace: true,
        });
    }

    function resetFilters() {
        router.get(route('home'), {}, {
            preserveState: true,
            replace: true,
        });
    }

    function onSubmitLaporan(values: z.infer<typeof LaporanSchema>) {
        router.post(route('laporan.store'), values, {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title="Peta Sebaran Sinyal" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
                <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Link href={route('home')} className="text-xl font-bold">
                            SignalMap
                        </Link>
                        <nav>
                            <Button asChild variant="outline">
                                <Link href={auth.user ? route('dashboard') : route('login')}>
                                    {auth.user ? 'Dashboard' : 'Admin Login'}
                                </Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto grid grid-cols-1 gap-8 p-4 lg:grid-cols-3">
                    <aside className="space-y-8 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filter Data Peta</CardTitle>
                                <CardDescription>Saring titik pengukuran berdasarkan kriteria di bawah ini.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Provider</Label>
                                    <Select value={filters.provider_id} onValueChange={(v) => handleFilterChange('provider_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Semua Provider" /></SelectTrigger>
                                        <SelectContent>
                                            {providers.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Kekuatan Sinyal</Label>
                                    <Select value={filters.kekuatan_id} onValueChange={(v) => handleFilterChange('kekuatan_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Semua Sinyal" /></SelectTrigger>
                                        <SelectContent>
                                            {kekuatanSinyals.map(k => <SelectItem key={k.id} value={k.id.toString()}>{k.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={resetFilters} variant="outline" className="w-full">Reset</Button>
                                    <Button onClick={applyFilters} className="w-full">Terapkan Filter</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Buat Laporan</CardTitle>
                                <CardDescription>Menemukan sinyal yang tidak akurat atau ingin memberi masukan? Sampaikan di sini.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmitLaporan)} className="space-y-4">
                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Judul Laporan</FormLabel>
                                                <FormControl><Input placeholder="Contoh: Sinyal lemah di area X" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="description" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deskripsi</FormLabel>
                                                <FormControl><Textarea placeholder="Jelaskan laporan Anda secara detail..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                                            {form.formState.isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </aside>

                    <section className="lg:col-span-2">
                        <Card className="h-[60vh] lg:h-full">
                             <Suspense fallback={<div className="flex h-full items-center justify-center">Memuat Peta...</div>}>
                                <DynamicSignalMap  data={dataPeta} />
                            </Suspense>
                        </Card>
                    </section>
                </main>
            </div>
        </>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>;
}
