import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className={cn(
        'flex flex-col min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      )}>
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer (opcional) */}
        <footer className="border-t border-border py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Calendário Avaliativo - Colégio Adventista de Cotia © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
