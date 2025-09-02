'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  History,
  LayoutGrid,
  ListOrdered,
  Loader2,
  Stethoscope,
  UsersRound,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { useClinic } from '@/hooks/use-clinic-store';
import { DashboardHeader } from '@/components/dashboard-header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, hydrated, setHydrated } = useClinic();
  
  useEffect(() => {
    // This effect ensures we check for the role only after the store has been rehydrated from localStorage
    if (typeof window !== 'undefined' && !hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);
  
  useEffect(() => {
    if (hydrated && !userRole) {
      router.replace('/login');
    }
  }, [userRole, hydrated, router]);

  const receptionistNav = useMemo(() => [
    { href: '/dashboard', label: 'Token Queue', icon: ListOrdered },
    { href: '/dashboard/patients', label: 'Patients', icon: UsersRound },
    { href: '/dashboard/billing', label: 'Billing', icon: FileText },
    { href: '/dashboard/logs', label: 'Action Logs', icon: History },
  ], []);

  const doctorNav = useMemo(() => [
    { href: '/dashboard', label: 'Token Queue', icon: ListOrdered },
    { href: '/dashboard/records', label: 'Visit Records', icon: Stethoscope },
    { href: '/dashboard/logs', label: 'Action Logs', icon: History },
  ], []);

  const navItems = userRole === 'doctor' ? doctorNav : receptionistNav;
  
  if (!hydrated || !userRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold">ClinicFlow</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href);
                  }}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Future implementation for user profile/settings */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
