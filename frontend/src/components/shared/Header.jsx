import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary font-poppins">
              Calendário Avaliativo
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{user?.nome}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.tipo}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
