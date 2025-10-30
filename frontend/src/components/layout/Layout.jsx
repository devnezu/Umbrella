import React from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        "md:ml-64",
        sidebarCollapsed && "md:ml-20"
      )}>
        <MobileHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;