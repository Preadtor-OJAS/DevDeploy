"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AppWindow, Rocket, Activity, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
const navItems = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  href: '/dashboard'
}, {
  icon: AppWindow,
  label: 'Applications',
  href: '/applications'
}, {
  icon: Rocket,
  label: 'Deployments',
  href: '/deploy'
}, {
  icon: Activity,
  label: 'Monitoring',
  href: '/monitoring'
}, {
  icon: FileText,
  label: 'Logs',
  href: '/logs'
}, {
  icon: Settings,
  label: 'Settings',
  href: '/settings'
}];
export function Sidebar() {
  const pathname = usePathname();
  return <aside className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          DevDeploy
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(item => {
        const isActive = pathname === item.href;
        return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>;
      })}
      </nav>
    </aside>;
}