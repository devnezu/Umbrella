import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  GraduationCap, LogIn, UserPlus, Calendar, CheckCircle, 
  Shield, Sparkles, Eye, EyeOff, Clock, FileText 
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
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(loginData.email, loginData.senha);
      toast.success('Bem-vindo ao ScholarSync!', {
        description: `Olá, ${data.user.nome}!`
      });
      
      const userRole = data.user.role;
      if (userRole === 'admin' || userRole === 'coordenacao') {
        navigate('/coordenacao/dashboard');
      } else {
        navigate('/professor/dashboard');
      }
    } catch (error) {
      toast.error('Erro ao fazer login', {
        description: error.response?.data?.mensagem || 'Verifique suas credenciais'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.solicitarRegistro(registerData);
      toast.success('Solicitação enviada!', {
        description: data.mensagem || 'Aguarde aprovação da coordenação'
      });
      setRegisterData({ nome: '', email: '', senha: '' });
    } catch (error) {
      toast.error('Erro ao criar conta', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center p-12 text-white flex-col justify-between relative overflow-hidden"
        style={{ backgroundImage: "url('/alunos.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ScholarSync</h1>
              <p className="text-blue-100 text-sm">Gestão Educacional Inteligente</p>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Organize seus calendários avaliativos
              </h2>
              <p className="text-blue-100 text-lg">
                Plataforma completa para gestão de avaliações, facilitando o trabalho 
                de professores e coordenadores pedagógicos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="h-8 w-8 mb-3" />
                <div className="font-semibold">Calendários</div>
                <div className="text-sm text-blue-100">Organizados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Sparkles className="h-8 w-8 mb-3" />
                <div className="font-semibold">Interface</div>
                <div className="text-sm text-blue-100">Intuitiva</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <FileText className="h-8 w-8 mb-3" />
                <div className="font-semibold">Relatórios</div>
                <div className="text-sm text-blue-100">Detalhados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Shield className="h-8 w-8 mb-3" />
                <div className="font-semibold">Dados</div>
                <div className="text-sm text-blue-100">Seguros</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-100 text-sm">
            © 2025 ScholarSync. Desenvolvido com dedicação para educadores.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ScholarSync</span>
            </div>
            <p className="text-muted-foreground">Gestão Educacional Inteligente</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Conta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo de volta</CardTitle>
                  <CardDescription>
                    Entre com suas credenciais para acessar o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-senha">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-senha"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.senha}
                          onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                          required
                          disabled={loading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Criar nova conta</CardTitle>
                  <CardDescription>
                    Preencha os dados para solicitar acesso ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-nome">Nome Completo</Label>
                      <Input
                        id="register-nome"
                        placeholder="João Silva"
                        value={registerData.nome}
                        onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                        required
                        disabled={loading}
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
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mínimo de 6 caracteres
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Criar Conta
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 shrink-0" />
                      <p>Sua solicitação será analisada pela coordenação</p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;