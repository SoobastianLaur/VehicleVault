import { useState, useEffect } from "react";
import { useIsMobile as useMobile } from "@/hooks/use-mobile";

export function useMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Close sidebar when transitioning from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return { isOpen, toggleSidebar, closeSidebar };
}
