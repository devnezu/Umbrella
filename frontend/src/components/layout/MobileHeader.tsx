import React from 'react';
import { Button } from '../ui/button';
import { Menu, GraduationCap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MobileHeader = () => {
  const { toggleMobileSidebar } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:hidden shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">ScholarSync</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default MobileHeader;