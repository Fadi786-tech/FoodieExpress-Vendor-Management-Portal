import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Store, Package, ShoppingBag, BarChart3, Star, 
  Wallet, Users, Settings, LogOut, Menu, X, Bell
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const navItems = [
  { icon: Store, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Star, label: 'Reviews', path: '/reviews' },
  { icon: Wallet, label: 'Payouts', path: '/payouts' },
  { icon: Users, label: 'Staff', path: '/staff' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentVendorId, vendors, logout } = useStore();
  const navigate = useNavigate();

  const currentVendor = vendors.find((v) => v.id === currentVendorId);

  if (!currentVendor) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">FoodieExpress</h1>
          <p className="text-sm text-muted-foreground mt-1">Vendor Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {currentVendor.storeName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{currentVendor.storeName}</p>
              <p className="text-xs text-muted-foreground truncate w-32">{currentVendor.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b">
              <h1 className="text-xl font-bold text-primary">FoodieExpress</h1>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start text-red-600" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold hidden sm:block">
              Welcome back, {currentVendor.storeName}!
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentVendor.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium hidden sm:block">{currentVendor.isOpen ? 'Store Open' : 'Store Closed'}</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
