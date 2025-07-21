import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Auth, PengukuranSinyal, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClipboardList, MapPin, TowerControl, Users } from 'lucide-react';
import { ProviderChart } from '@/components/charts/ProviderChart';
import { Badge } from '@/components/ui/badge';
import { lazy, Suspense } from 'react';
import { StrengthDistributionChart } from '@/components/charts/StrengthDistributionChart';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Stats {
    totalPengukuran: number;
    totalWilayah: number;
    totalProvider: number;
    totalUser: number;
}

interface ChartData {
    name: string;
    total: number;
}

interface Props {
    auth: Auth;
    stats: Stats;
    charts: {
        pengukuranPerProvider: ChartData[];
        distribusiKekuatan: ChartData[];
    };
    aktivitasTerbaru: PengukuranSinyal[];
    dataPeta: PengukuranSinyal[];
}

const DynamicSignalMap = lazy(() => import('@/components/maps/SignalMap'));


export default function Dashboard({ auth, stats, charts, aktivitasTerbaru, dataPeta }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="teaxt-2xl font-bold">Selamat Datang, {auth.user.name}!</h1>
                    <p className="text-muted-foreground">Berikut adalah ringkasan dari sistem pemetaan sinyal Anda.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengukuran</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalPengukuran}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Wilayah</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalWilayah}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Provider</CardTitle>
                            <TowerControl className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalProvider}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalUser}</div></CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardContent className="h-[450px] p-0">
                            <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Memuat Peta...</div>}>
                                <DynamicSignalMap data={dataPeta} />
                            </Suspense>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Pengukuran per Provider</CardTitle></CardHeader>
                        <CardContent>
                            <ProviderChart data={charts.pengukuranPerProvider} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Aktivitas Pengukuran Terbaru</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {aktivitasTerbaru.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{item.wilayah?.desa}, {item.wilayah?.kecamatan}</span>
                                            <span className="text-sm text-muted-foreground">{item.provider?.name} - {item.tanggal_pengukuran}</span>
                                        </div>
                                        <Badge variant="outline">{item.kekuatan?.name}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Distribusi Kekuatan Sinyal</CardTitle></CardHeader>
                        <CardContent>
                            <StrengthDistributionChart data={charts.distribusiKekuatan} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
