import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    desa: z.string().min(1, 'Desa is required'),
    kecamatan: z.string().min(1, 'Kecamatan is required'),
    kabupaten: z.string().min(1, 'Kabupaten is required'),
    latitude: z.coerce.number({ invalid_type_error: 'Latitude harus berupa angka' })
        .min(-90, 'Latitude minimal -90')
        .max(90, 'Latitude maksimal 90'),
    longitude: z.coerce.number({ invalid_type_error: 'Longitude harus berupa angka' })
        .min(-180, 'Longitude minimal -180')
        .max(180, 'Longitude maksimal 180'),
});

export default function CreateWilayah() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            desa: '',
            kecamatan: '',
            kabupaten: '',
            latitude: undefined,
            longitude: undefined,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.post(`/wilayah`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Wilayah', href: '/wilayah' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Wilayah" />
            <div className="m-4 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Create Wilayah</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="desa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wilayah Desa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Sukajaya" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kecamatan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wilayah Kecamatan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Sukarami" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kabupaten"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wilayah Kabupaten</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Palembang" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wilayah Latitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="-2.916947"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wilayah Longitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="104.745834"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Create'}
                            </Button>
                            <Link href="/wilayah">
                                <Button type="button" variant="outline">Back</Button>
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
