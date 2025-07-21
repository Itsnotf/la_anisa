import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { KekuatanSinyal, PengukuranSinyal, Provider, Wilayah } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { format, parse} from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    wilayah_id: z.string().min(1, 'Wilayah harus dipilih'),
    provider_id: z.string().min(1, 'Provider harus dipilih'),
    kekuatan_id: z.string().min(1, 'Kekuatan sinyal harus dipilih'),
    tanggal_pengukuran: z.date({
        required_error: 'Tanggal pengukuran harus diisi.',
    }),
    catatan: z.string().optional(),
});

interface Props {
    pengukuranSinyal: PengukuranSinyal;
    wilayahs: Wilayah[];
    providers: Provider[];
    kekuatanSinyals: KekuatanSinyal[];
}

export default function CreatePengukuranSinyal({ wilayahs, providers, kekuatanSinyals, pengukuranSinyal }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            wilayah_id: pengukuranSinyal.wilayah_id?.toString() || '',
            provider_id: pengukuranSinyal.provider_id?.toString() || '',
            kekuatan_id: pengukuranSinyal.kekuatan_id?.toString() || '',
            tanggal_pengukuran: pengukuranSinyal.tanggal_pengukuran
            ? parse(pengukuranSinyal.tanggal_pengukuran, 'dd/MM/yyyy', new Date())
            : undefined,
            catatan: pengukuranSinyal.catatan || '',
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const formattedData = {
            ...data,
            tanggal_pengukuran: format(data.tanggal_pengukuran, 'dd/MM/yyyy'),
        };
        router.put(`/pengukuranSinyal/${pengukuranSinyal.id}`, formattedData);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'PengukuranSinyal', href: '/pengukuranSinyal' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit PengukuranSinyal" />
            <div className="m-4 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit PengukuranSinyal</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="wilayah_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Wilayah</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value
                                                        ? `${wilayahs.find((w) => w.id.toString() === field.value)?.desa}, ${wilayahs.find((w) => w.id.toString() === field.value)?.kecamatan}`
                                                        : 'Pilih Wilayah'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari wilayah..." />
                                                <CommandEmpty>Wilayah tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {wilayahs.map((wilayah) => (
                                                        <CommandItem
                                                            value={`${wilayah.desa}, ${wilayah.kecamatan}, ${wilayah.kabupaten}`}
                                                            key={wilayah.id}
                                                            onSelect={() => {
                                                                form.setValue('wilayah_id', wilayah.id.toString());
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    wilayah.id.toString() === field.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {wilayah.desa}, {wilayah.kecamatan}, {wilayah.kabupaten}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Provider</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value ? providers.find((p) => p.id.toString() === field.value)?.name : 'Pilih Provider'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari provider..." />
                                                <CommandEmpty>Provider tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {providers.map((provider) => (
                                                        <CommandItem
                                                            value={provider.name}
                                                            key={provider.id}
                                                            onSelect={() => {
                                                                form.setValue('provider_id', provider.id.toString());
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    provider.id.toString() === field.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {provider.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="kekuatan_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Kekuatan Sinyal</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value
                                                        ? kekuatanSinyals.find((k) => k.id.toString() === field.value)?.name
                                                        : 'Pilih Kekuatan Sinyal'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari kekuatan sinyal..." />
                                                <CommandEmpty>Kekuatan sinyal tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {kekuatanSinyals.map((kekuatan) => (
                                                        <CommandItem
                                                            value={kekuatan.name}
                                                            key={kekuatan.id}
                                                            onSelect={() => {
                                                                form.setValue('kekuatan_id', kekuatan.id.toString());
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    kekuatan.id.toString() === field.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {kekuatan.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tanggal_pengukuran"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Pengukuran</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                >
                                                    {field.value ? format(field.value, 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                locale={id}
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="catatan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan Pengukuran Sinyal</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Contoh: Sinyal sangat kuat di area terbuka, namun sedikit melemah di dalam ruangan..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Update'}
                            </Button>
                            <Link href="/pengukuranSinyal" className="w-fit">
                                <Button type="button" variant="outline">
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
