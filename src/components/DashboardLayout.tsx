import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  Menu,
  X,
  Leaf
} from "lucide-react";

interface DashboardLayoutProps {
  userRole?: 'super_admin' | 'brand_owner' | 'customer';
}

export function DashboardLayout({ userRole = 'super_admin' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = {
    super_admin: [
      { name: 'Dashboard', href: '/admin', icon: Home },
      { name: 'Cannabis Brands', href: '/admin/brands', icon: Leaf },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: BarChart3 },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    brand_owner: [
      { name: 'Dashboard', href: '/brand', icon: Home },
      { name: 'Products', href: '/brand/products', icon: Package },
      { name: 'Orders', href: '/brand/orders', icon: ShoppingCart },
      { name: 'Customers', href: '/brand/customers', icon: Users },
      { name: 'Analytics', href: '/brand/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/brand/settings', icon: Settings },
    ],
    customer: [
      { name: 'Browse', href: '/shop', icon: Home },
      { name: 'Cart', href: '/cart', icon: ShoppingCart },
      { name: 'Orders', href: '/orders', icon: Package },
      { name: 'Profile', href: '/profile', icon: Users },
    ]
  };

  const currentNav = navigation[userRole];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-gradient-hero border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-foreground">
                  {userRole === 'super_admin' ? 'Admin Portal' : 
                   userRole === 'brand_owner' ? 'Brand Portal' : 'Cannabis Hub'}
                </h1>
                <p className="text-sm text-primary-foreground/70">
                  {userRole === 'super_admin' ? 'Platform Management' : 
                   userRole === 'brand_owner' ? 'Manage Your Store' : 'Order Cannabis'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {currentNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-green" 
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
              <div className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-primary-foreground">Welcome back!</p>
                <p className="text-xs">Platform v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}