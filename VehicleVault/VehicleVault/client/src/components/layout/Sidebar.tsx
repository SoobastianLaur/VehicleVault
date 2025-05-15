import { FC } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  Bell, 
  BarChart2, 
  Settings, 
  User
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { href: "/customers", label: "Customers", icon: <Users className="mr-3 h-5 w-5" /> },
    { href: "/vehicles", label: "Vehicles", icon: <Car className="mr-3 h-5 w-5" /> },
    { href: "/service-records", label: "Service Records", icon: <Wrench className="mr-3 h-5 w-5" /> },
    { href: "/reminders", label: "Reminders", icon: <Bell className="mr-3 h-5 w-5" /> },
    { href: "/reports", label: "Reports", icon: <BarChart2 className="mr-3 h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-800 dark:bg-gray-900 transition-transform duration-300 ease-in-out md:static md:z-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Title */}
        <div className="flex h-16 items-center justify-center bg-gray-900 dark:bg-gray-950">
          <h1 className="text-white font-semibold text-xl flex items-center">
            <Car className="mr-2 h-6 w-6" />
            GaragePilot
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link 
                  href={item.href}
                  onClick={closeSidebar}
                >
                  <div 
                    className={cn(
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      isActive(item.href)
                        ? "bg-gray-900 dark:bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {item.label === "Reminders" && (
                      <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-amber-500 text-white">
                        5
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <User className="text-gray-300 h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Mechanic</p>
                <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
