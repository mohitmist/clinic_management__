'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useClinic } from '@/hooks/use-clinic-store';
import { useState, useEffect } from 'react';

export function DashboardHeader() {
  const pathname = usePathname();
  const { userName, userRole, logout } = useClinic();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDark);
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Token Queue';
      case '/dashboard/patients':
        return 'Patient Management';
      case '/dashboard/billing':
        return 'Billing';
      case '/dashboard/records':
        return 'Visit Records';
      case '/dashboard/logs':
        return 'Action Logs';
      default:
        return 'Dashboard';
    }
  };
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleName = () => {
    if (!userRole) return '';
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 font-headline text-xl font-semibold">{getPageTitle()}</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {getRoleName()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
