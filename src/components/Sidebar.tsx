import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  BarChart3,
  Star,
  CreditCard,
  Settings,
  LogOut,
  Users,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Store Operations", href: "/operations", icon: Store },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-xl md:shadow-none">
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-orange-600">FoodieExpress</span>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-md">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4">
        <button onClick={handleLogout} className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
