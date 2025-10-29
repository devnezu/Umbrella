import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { LogOut, Moon, Sun, Menu, Bell, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu + Title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page title (visible quando sidebar está recolhida em desktop) */}
            <div className={cn(
              'transition-opacity duration-200',
              !sidebarCollapsed && 'lg:opacity-0 lg:pointer-events-none'
            )}>
              <h1 className="text-lg font-semibold">
                Calendário Avaliativo
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notificações (placeholder) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              {/* Badge de notificação */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Settings */}
            <Link to="/configuracoes">
              <Button
                variant="ghost"
                size="icon"
                title="Configurações"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </Link>

            {/* User info - hidden on small screens */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user?.nome?.charAt(0) || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium leading-none">{user?.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {user?.role === 'admin' ? 'Administrador' :
                   user?.role === 'coordenacao' ? 'Coordenação' :
                   user?.role === 'professor' ? 'Professor' :
                   'Professor Substituto'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title="Sair"
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>

            {/* Mobile logout (icon only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sair"
              className="sm:hidden"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
