import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    roles: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Wilayah {
    id: number;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
}

export interface Provider {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface KekuatanSinyal {
    id: number;
    name: string;
    deskripsi: string;
    created_at: string;
    updated_at: string;
}

export interface PengukuranSinyal {
    id: number;
    wilayah_id: number;
    provider_id: number;
    kekuatan_id: number;
    tanggal_pengukuran: string;
    catatan: string | null;
    created_at: string;
    updated_at: string;
    wilayah: Wilayah;
    provider: Provider;
    kekuatan: KekuatanSinyal;
}

export interface LaporanMasyarakat {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}
