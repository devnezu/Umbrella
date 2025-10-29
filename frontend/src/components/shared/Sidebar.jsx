import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const location = useLocation();

  // Menu items baseado em permissões/role
  const getMenuItems = () => {
    const baseItems = [
      {
        to: '/',
        icon: Home,
        label: 'Início',
        roles: ['admin', 'coordenacao', 'professor', 'professor_substituto']
      }
    ];

    if (user?.role === 'admin' || user?.role === 'coordenacao') {
      return [
        ...baseItems,
        {
          to: '/coordenacao/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard',
          roles: ['admin', 'coordenacao']
        },
        {
          to: '/coordenacao/calendarios',
          icon: Calendar,
          label: 'Calendários',
          roles: ['admin', 'coordenacao']
        },
        {
          to: '/coordenacao/relatorios',
          icon: BarChart3,
          label: 'Relatórios',
          roles: ['admin', 'coordenacao']
        },
        {
          to: '/coordenacao/usuarios',
          icon: Users,
          label: 'Usuários',
          roles: ['admin']
        },
        {
          to: '/configuracoes',
          icon: Settings,
          label: 'Configurações',
          roles: ['admin', 'coordenacao']
        }
      ];
    }

    // Professor
    return [
      ...baseItems,
      {
        to: '/professor/dashboard',
        icon: LayoutDashboard,
        label: 'Meus Calendários',
        roles: ['professor']
      },
      {
        to: '/professor/novo',
        icon: FileText,
        label: 'Novo Calendário',
        roles: ['professor']
      },
      {
        to: '/configuracoes',
        icon: Settings,
        label: 'Configurações',
        roles: ['professor']
      }
    ];
  };

  const menuItems = getMenuItems().filter(item =>
    !item.roles || item.roles.includes(user?.role || user?.tipo)
  );

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay para mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out',
          'bg-card border-r border-border shadow-lg',
          'flex flex-col',
          sidebarCollapsed ? 'w-20' : 'w-64',
          // Mobile: fora da tela quando colapsado
          'lg:translate-x-0',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Calendário</h2>
                <p className="text-xs text-muted-foreground">Avaliativo</p>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* User info */}
        <div className={cn(
          'p-4 border-b border-border',
          sidebarCollapsed && 'px-2'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shrink-0">
              {user?.nome?.charAt(0) || 'U'}
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nome}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.role === 'admin' ? 'Administrador' :
                   user?.role === 'coordenacao' ? 'Coordenação' :
                   user?.role === 'professor' ? 'Professor' :
                   'Professor Substituto'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-accent/10',
                  active && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  !active && 'text-foreground',
                  sidebarCollapsed && 'justify-center'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={cn('shrink-0', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle button */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full',
              sidebarCollapsed && 'px-0 justify-center'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-sm">Recolher</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Spacer para o conteúdo principal */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      />
    </>
  );
};

export default Sidebar;
