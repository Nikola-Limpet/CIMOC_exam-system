'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Key, 
  ClipboardCheck, 
  Settings, 
  LogOut, 
  MenuIcon, 
  X,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { authApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    label: 'Exams',
    href: '/exams',
    icon: <FileText className="h-5 w-5" />
  },
  {
    label: 'Access Keys',
    href: '/access-keys',
    icon: <Key className="h-5 w-5" />,
    adminOnly: true
  },
  {
    label: 'Submissions',
    href: '/submissions',
    icon: <ClipboardCheck className="h-5 w-5" />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  
  // Fetch current user data
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data } = await authApi.me()
        return data
      } catch (error) {
        router.push('/login')
        throw error
      }
    },
    retry: false,
  })

  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Close sidebar when path changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto border-r bg-background pt-5">
          <div className="flex items-center justify-center px-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam System</h1>
            </Link>
          </div>
          <Separator className="my-4" />
          <div className="flex-1 space-y-1 px-2">
            {navItems
              .filter(item => !item.adminOnly || isAdmin)
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-50 bg-black/80 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-5">
            <Link href="/dashboard">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam System</h1>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Separator />
          <div className="flex-1 space-y-1 px-2 py-4">
            {navItems
              .filter(item => !item.adminOnly || isAdmin)
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            <div className="flex items-center ml-auto space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
