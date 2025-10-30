import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

import LoginPage from './pages/LoginPage';
import DashboardProfessor from './pages/DashboardProfessor';
import DashboardCoordenacao from './pages/DashboardCoordenacao';
import UsuariosPage from './pages/UsuariosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import CalendarioFormPage from './pages/CalendarioFormPage';
import CalendarioViewPage from './pages/CalendarioViewPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Spinner } from './components/ui/spinner';

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role;
  if (role === 'admin' || role === 'coordenacao') {
    return <Navigate to="/coordenacao/dashboard" replace />;
  }
  return <Navigate to="/professor/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton expand={false} />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/professor/dashboard"
              element={
                <ProtectedRoute requiredRole="professor">
                  <DashboardProfessor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/professor/novo"
              element={
                <ProtectedRoute requiredRole="professor">
                  <CalendarioFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/professor/editar/:id"
              element={
                <ProtectedRoute requiredRole="professor">
                  <CalendarioFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/professor/visualizar/:id"
              element={
                <ProtectedRoute requiredRole="professor">
                  <CalendarioViewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coordenacao/visualizar/:id"
              element={
                <ProtectedRoute requiredRole={['admin', 'coordenacao']}>
                  <CalendarioViewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coordenacao/dashboard"
              element={
                <ProtectedRoute requiredRole={['admin', 'coordenacao']}>
                  <DashboardCoordenacao />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coordenacao/usuarios"
              element={
                <ProtectedRoute requiredRole={['admin', 'coordenacao']}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <ConfiguracoesPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;