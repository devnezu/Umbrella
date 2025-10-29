import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.tipo === 'professor') {
        navigate('/professor/dashboard');
      } else if (user.tipo === 'coordenacao') {
        navigate('/coordenacao/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <LoginForm />;
};

export default LoginPage;
