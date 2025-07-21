import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Wilayah } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';


interface Props {
    wilayah: Wilayah;
}

const formSchema = z.object({
    desa: z.string().min(1, 'Desa is required'),
    kecamatan: z.string().min(1, 'Kecamatan is required'),
    kabupaten: z.string().min(1, 'Kabupaten is required'),
    latitude: z.number().min(1, 'Latitude is required'),
    longitude: z.number().min(1, 'Longitude is required'),
});

export default function EditWilayah({ wilayah }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            desa: wilayah.desa,
            kecamatan: wilayah.kecamatan,
            kabupaten: wilayah.kabupaten,
            latitude: wilayah.latitude,
            longitude: wilayah.longitude,
        },
    });

    const { handleSubmit } = methods;


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/wilayah/${wilayah.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Wilayah', href: '/wilayah' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Wilayah" />
            <div className="m-4 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit Wilayah</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="desa"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wilayah Desa</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="kecamatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wilayah Kecamatan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="kabupaten"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wilayah Kabupaten</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wilayah Latitude</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wilayah Longitude</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="submit" className="w-fit">
                                    Update
                                </Button>
                                <Link href='/wilayah'>
                                    <Button type="button">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
