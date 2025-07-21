import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { can } from '@/utils/permission';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, ClipboardPaste, Key, LayoutGrid, MapPin, ShieldCheck, Signal, TowerControl, User } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        can('show-user', auth) && {
            title: 'Users',
            href: '/user',
            icon: User,
        },
        can('show-permission', auth) && {
            title: 'Permission',
            href: '/permission',
            icon: Key,
        },
        can('show-role', auth) && {
            title: 'Role',
            href: '/role',
            icon: ShieldCheck,
        },
        can('show-wilayah', auth) && {
            title: 'Wilayah',
            href: '/wilayah',
            icon: MapPin,
        },
        can('show-provider', auth) && {
            title: 'Provider',
            href: '/provider',
            icon: TowerControl,
        },
        can('show-kekuatanSinyal', auth) && {
            title: 'Kekuatan Sinyal',
            href: '/kekuatanSinyal',
            icon: Signal,
        },
        can('show-pengukuranSinyal', auth) && {
            title: 'Pengukuran Sinyal',
            href: '/pengukuranSinyal',
            icon: ClipboardList,
        },
        can('show-laporanMasyarakat', auth) && {
            title: 'Laporan Masyarakat',
            href: '/laporanMasyarakat',
            icon: ClipboardPaste,
        },
    ].filter(Boolean) as NavItem[];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
