import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    deskripsi: z.string().min(1, 'Deskripsi is required'),
});

export default function CreateKekuatanSinyal() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            deskripsi: '',
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.post(`/kekuatanSinyal`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'KekuatanSinyal', href: '/kekuatanSinyal' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create KekuatanSinyal" />
            <div className="m-4 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Create KekuatanSinyal</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Kekuatan Sinyal</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: 3G" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deskripsi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi Kekuatan Sinyal</FormLabel>
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
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Create'}
                            </Button>
                            <Link href="/kekuatanSinyal" className="w-fit">
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
