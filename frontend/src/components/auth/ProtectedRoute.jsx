import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = user?.role || user?.tipo;
  
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole.includes(userRole) : userRole === requiredRole;
    if (!allowed) return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
