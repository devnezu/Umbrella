import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, senha);

      toast.success('Login realizado com sucesso!');

      // Redirecionar baseado no tipo de usuário
      if (data.user.tipo === 'professor') {
        navigate('/professor/dashboard');
      } else if (data.user.tipo === 'coordenacao') {
        navigate('/coordenacao/dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.response?.data?.mensagem || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Calendário Avaliativo</CardTitle>
          <CardDescription>
            Colégio Adventista de Cotia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@colegioadventista.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-md text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Credenciais de teste:</p>
            <p>Coordenação: josiane@colegioadventista.com / Admin@2025</p>
            <p>Professor: rosana@colegioadventista.com / Prof@2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
