import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <Link to="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
