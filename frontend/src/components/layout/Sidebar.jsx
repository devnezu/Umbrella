import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Users, Settings, PanelLeftClose,
  PanelLeftOpen, Moon, Sun, LogOut, GraduationCap, Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const {
    theme, toggleTheme, sidebarCollapsed, toggleSidebar,
    isMobileSidebarOpen, setIsMobileSidebarOpen
  } = useTheme();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Atalho de teclado 'P' para focar na barra de pesquisa
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Verifica se a tecla 'P' foi pressionada e não está em um input/textarea
      if (e.key === 'p' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getMenuCategories = () => {
    const role = user?.role;

    if (role === 'admin' || role === 'coordenacao') {
      return [
        {
          title: 'Gerenciamento',
          items: [
            { to: '/coordenacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/coordenacao/usuarios', icon: Users, label: 'Usuários' },
          ]
        },
        {
          title: 'Sistema',
          items: [
            { to: '/configuracoes', icon: Settings, label: 'Configurações' },
          ]
        }
      ];
    }

    return [
      {
        title: 'Acadêmico',
        items: [
          { to: '/professor/dashboard', icon: LayoutDashboard, label: 'Calendários' },
        ]
      },
      {
        title: 'Sistema',
        items: [
          { to: '/configuracoes', icon: Settings, label: 'Configurações' },
        ]
      }
    ];
  };

  const menuCategories = getMenuCategories();

  const handleLinkClick = () => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r relative">
      {/* Header - Espaço para logo futura */}
      <div className="flex h-16 items-center justify-center px-4">
        {/* Espaço reservado para logo */}
      </div>

      {/* Barra de Pesquisa com efeito de profundidade */}
      <div className="px-3 pb-4">
        <div className="relative bg-muted/50 dark:bg-muted/30 rounded-lg border border-border/50">
          <div className="relative flex items-center">
            <Search className={cn(
              "absolute h-4 w-4 text-muted-foreground transition-all",
              sidebarCollapsed ? "left-1/2 -translate-x-1/2" : "left-3"
            )} />
            {!sidebarCollapsed && (
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Pesquisar... (P)"
                className="pl-9 bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
              />
            )}
            {sidebarCollapsed && (
              <div className="w-full h-9 flex items-center justify-center cursor-pointer" onClick={toggleSidebar}>
                <span className="sr-only">Pesquisar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-4">
          {menuCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category.title}
                </h3>
              )}
              {sidebarCollapsed && categoryIndex > 0 && (
                <div className="my-2 border-t border-border" />
              )}
              <div className="space-y-1">
                {category.items.map((item) => {
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
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3 space-y-3">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg bg-gradient-to-br from-muted/80 to-muted/50 p-2.5 border border-border/50",
          sidebarCollapsed && "justify-center p-2"
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md">
            {user?.nome?.charAt(0) || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.nome}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Logout Action */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? "icon" : "default"}
                onClick={logout}
                className={cn(
                  "w-full hover:bg-destructive/10 hover:text-destructive transition-colors",
                  sidebarCollapsed && "h-9 w-9"
                )}
              >
                <LogOut className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Sair</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={sidebarCollapsed ? "right" : "top"}>
              Sair
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

        {/* Floating Action Buttons na borda da sidebar */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 flex flex-col gap-3 z-50">
          {/* Theme Toggle Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 rounded-full shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all hover:scale-110 border-2 border-background"
                >
                  {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Sidebar Toggle Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 rounded-full shadow-lg bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transition-all hover:scale-110 border-2 border-background"
                >
                  {sidebarCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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