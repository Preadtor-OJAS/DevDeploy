import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from './notification-bell';
import { Button } from './ui/button';

export function Topbar() {
  return <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
        <UserButton afterSignOutUrl="/sign-in" />
        <Link href="/deploy">
          <Button>Deploy New App</Button>
        </Link>
      </div>
    </header>;
}