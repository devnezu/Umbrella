import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { LayoutDashboard, FileText, Users, Settings, Calendar, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const location = useLocation();

  const getMenuItems = () => {
    const role = user?.role || user?.tipo;
    
    if (role === 'admin' || role === 'coordenacao') {
      return [
        { to: '/coordenacao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/coordenacao/calendarios', icon: Calendar, label: 'Calendários' },
        { to: '/coordenacao/relatorios', icon: BarChart3, label: 'Relatórios' },
        { to: '/coordenacao/usuarios', icon: Users, label: 'Usuários' },
        { to: '/configuracoes', icon: Settings, label: 'Configurações' },
      ];
    }

    return [
      { to: '/professor/dashboard', icon: LayoutDashboard, label: 'Meus Calendários' },
      { to: '/professor/novo', icon: FileText, label: 'Novo Calendário' },
      { to: '/configuracoes', icon: Settings, label: 'Configurações' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Calendário</p>
              <p className="text-xs text-muted-foreground">Avaliativo</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* User */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user?.nome?.charAt(0) || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.nome}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {user?.role === 'admin' ? 'Admin' : user?.role === 'coordenacao' ? 'Coordenação' : 'Professor'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
        })}
      </nav>

      {/* Toggle */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Recolher
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
