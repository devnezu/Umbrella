import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  GraduationCap, LogIn, UserPlus, Calendar, Shield, 
  Sparkles, Eye, EyeOff, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '../components/ui/spinner';
import authService from '../services/authService';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [registerData, setRegisterData] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(loginData.email, loginData.senha);
      toast.success(`Bem-vindo, ${data.user.nome.split(' ')[0]}!`, {
        description: 'Login realizado com sucesso.'
      });
      
      const userRole = data.user.role;
      if (userRole === 'admin' || userRole === 'coordenacao') {
        navigate('/coordenacao/dashboard');
      } else {
        navigate('/professor/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.mensagem || 'Verifique suas credenciais e tente novamente.';
      toast.error('Falha na autenticação', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authService.solicitarRegistro(registerData);
      toast.success('Solicitação enviada!', {
        description: data.mensagem || 'Aguarde a aprovação da coordenação.'
      });
      setRegisterData({ nome: '', email: '', senha: '' });
    } catch (error) {
      const msg = error.response?.data?.mensagem || 'Erro ao processar solicitação.';
      setError(msg);
      toast.error('Erro no cadastro', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-[55%] relative bg-zinc-900 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/alunos.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 to-blue-900/80" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">ScholarSync</h1>
              <p className="text-blue-100 text-sm font-medium">Gestão Educacional Inteligente</p>
            </div>
          </div>

          <div className="space-y-8 max-w-lg">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-white">
                Simplifique a gestão de calendários escolares
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Centralize avaliações, otimize processos pedagógicos e melhore a comunicação entre coordenação e professores.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                <Calendar className="h-6 w-6 mb-3 text-blue-200" />
                <div className="font-semibold text-white">Organização</div>
                <div className="text-sm text-blue-200">Cronogramas claros</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                <Shield className="h-6 w-6 mb-3 text-blue-200" />
                <div className="font-semibold text-white">Segurança</div>
                <div className="text-sm text-blue-200">Acesso controlado</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-blue-200/80">
            &copy; 2025 ScholarSync. Todos os direitos reservados.
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background">
        <div className="w-full max-w-[400px] space-y-8 animate-in">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo</h2>
            <p className="text-muted-foreground">
              Gerencie suas atividades acadêmicas com eficiência.
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      required
                      disabled={loading}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base font-medium mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Acessar Sistema
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-nome">Nome Completo</Label>
                  <Input
                    id="register-nome"
                    placeholder="João Silva"
                    value={registerData.nome}
                    onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="register-senha"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.senha}
                      onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                      required
                      disabled={loading}
                      minLength={6}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <Button type="submit" className="w-full h-11 text-base font-medium mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>
              
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50 mt-4">
                <h4 className="text-xs font-semibold mb-1 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Importante
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Novos cadastros requerem aprovação manual da coordenação antes que o acesso ao sistema seja liberado.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;