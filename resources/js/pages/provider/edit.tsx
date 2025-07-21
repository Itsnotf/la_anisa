import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Provider } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

interface Props {
    provider: Provider;
}

export default function EditProvider({ provider }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: provider.name,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/provider/${provider.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Provider', href: '/provider' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Provider" />
            <div className="m-4 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit Provider</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Provider</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Telkomsel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Update'}
                            </Button>
                            <Link href="/provider" className="w-fit">
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
