import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

import LoginPage from './pages/LoginPage';
import DashboardProfessor from './pages/DashboardProfessor';
import DashboardCoordenacao from './pages/DashboardCoordenacao';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.tipo === 'professor') {
    return <Navigate to="/professor/dashboard" replace />;
  }

  if (user?.tipo === 'coordenacao') {
    return <Navigate to="/coordenacao/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas do Professor */}
          <Route
            path="/professor/dashboard"
            element={
              <ProtectedRoute requiredType="professor">
                <DashboardProfessor />
              </ProtectedRoute>
            }
          />

          {/* Rotas da Coordenação */}
          <Route
            path="/coordenacao/dashboard"
            element={
              <ProtectedRoute requiredType="coordenacao">
                <DashboardCoordenacao />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
