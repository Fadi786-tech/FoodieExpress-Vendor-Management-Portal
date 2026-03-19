import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, Globe, Menu, Store, LogOut, Settings, ChevronDown, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState("EN");

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifications = [
    { id: 1, title: "New Order", message: "You have a new order #ORD-1030", time: "2 mins ago", unread: true },
    { id: 2, title: "Payment Received", message: "Payout for last week has been processed", time: "1 hour ago", unread: true },
    { id: 3, title: "Stock Alert", message: "Classic Cheeseburger is low on stock", time: "3 hours ago", unread: false },
  ];

  return (
    <header className="flex h-14 md:h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-3 md:px-6">
      <div className="flex items-center flex-1 gap-2 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="p-1.5 bg-orange-600 rounded-lg shadow-sm">
            <Store className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">FoodieExpress</span>
        </div>
        <div className="relative w-full max-w-md hidden md:block">
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
        {/* Language Selector */}
        <div className="relative" ref={languageRef}>
          <button 
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 px-2 py-1.5 md:px-3 rounded-md transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "EN" ? "English" : "Urdu"}</span>
            <span className="sm:hidden">{language}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <button
                onClick={() => { setLanguage("EN"); setShowLanguageMenu(false); }}
                className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>English</span>
                {language === "EN" && <Check className="h-4 w-4 text-orange-600" />}
              </button>
              <button
                onClick={() => { setLanguage("UR"); setShowLanguageMenu(false); }}
                className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>Urdu</span>
                {language === "UR" && <Check className="h-4 w-4 text-orange-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">Mark all as read</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors ${notif.unread ? 'bg-orange-50/30' : ''}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <span className="text-[10px] text-gray-500">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-4 py-2 text-center border-t">
                <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 md:gap-3 border-l border-gray-200 pl-2 md:pl-4 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-2 ring-white shadow-sm">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || "Burger Joint"}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Vendor Admin</p>
            </div>
            <ChevronDown className={`hidden md:block h-3 w-3 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-2 border-b mb-1 md:hidden">
                <p className="text-sm font-semibold text-gray-900">{user?.name || "Burger Joint"}</p>
                <p className="text-xs text-gray-500">Vendor Admin</p>
              </div>
              <button 
                onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button 
                onClick={() => { navigate("/operations"); setShowUserMenu(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Store Operations
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
