import { Bell, Search, User, Globe, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center flex-1 gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            placeholder="Search orders, products..."
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 px-2 py-1.5 md:px-3 rounded-md">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">EN / UR</span>
          <span className="sm:hidden">EN</span>
        </button>
        <button className="relative rounded-full p-1 text-gray-400 hover:text-gray-500">
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-2 md:pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <User className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user?.name || "Burger Joint"}</p>
            <p className="text-xs text-gray-500">Vendor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
