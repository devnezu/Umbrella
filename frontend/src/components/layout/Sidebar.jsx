import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Users, Settings, ChevronLeft,
  ChevronRight, Moon, Sun, LogOut, GraduationCap
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const {
    theme, toggleTheme, sidebarCollapsed, toggleSidebar,
    isMobileSidebarOpen, setIsMobileSidebarOpen
  } = useTheme();
  const location = useLocation();

  const getMenuItems = () => {
    const role = user?.role;
    
    if (role === 'admin' || role === 'coordenacao') {
      return [
        { to: '/coordenacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/coordenacao/usuarios', icon: Users, label: 'Usuários' },
        { to: '/configuracoes', icon: Settings, label: 'Configurações' },
      ];
    }

    return [
      { to: '/professor/dashboard', icon: LayoutDashboard, label: 'Calendários' },
      { to: '/configuracoes', icon: Settings, label: 'Configurações' },
    ];
  };

  const menuItems = getMenuItems();

  const handleLinkClick = () => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight">ScholarSync</span>
          )}
        </Link>
        {!sidebarCollapsed && (
          <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8" onClick={toggleSidebar}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {sidebarCollapsed && (
          <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8" onClick={toggleSidebar}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            const button = (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <TooltipProvider key={item.to} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return button;
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3 space-y-3">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg bg-muted/50 p-2",
          sidebarCollapsed && "justify-center p-2"
        )}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
            {user?.nome?.charAt(0) || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.nome}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center gap-2",
          sidebarCollapsed && "flex-col"
        )}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={sidebarCollapsed ? "right" : "top"}>
                {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={logout} className="h-9 w-9">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={sidebarCollapsed ? "right" : "top"}>
                Sair
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 md:block",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;