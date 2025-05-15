import { FC, ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { isOpen, toggleSidebar, closeSidebar } = useMobileSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Mobile header */}
      <div className="md:hidden bg-gray-900 dark:bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="font-semibold text-xl flex items-center">
          <span className="mr-2">🚗</span>
          GaragePilot
        </h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />

        {/* Main content */}
        <div className="flex flex-col md:ml-64 flex-1 overflow-auto bg-background">
          <div className="hidden md:flex justify-end p-4 pr-6">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
