import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { toast } from 'sonner';
import { Save, User, Moon, Sun, Shield, Mail, Briefcase, Info } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';

const ConfiguracoesPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSalvar = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.atualizarPerfil({ nome, email });
      updateUser(updatedUser);
      toast.success('Configurações salvas!', {
        description: 'Suas alterações foram aplicadas'
      });
    } catch (error) {
      toast.error('Erro ao salvar configurações', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas preferências e informações pessoais
          </p>
        </div>

        {/* Profile Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Perfil</h2>
            <p className="text-sm text-muted-foreground">
              Atualize suas informações pessoais
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Cargo no Sistema
            </Label>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium capitalize truncate">{user?.role}</p>
                <p className="text-xs text-muted-foreground">
                  Definido pela coordenação
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleSalvar} disabled={saving} size="lg" className="w-full sm:w-auto">
            {saving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>

        <Separator />

        {/* Appearance Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Aparência</h2>
            <p className="text-sm text-muted-foreground">
              Personalize a interface do sistema
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <Label className="text-sm sm:text-base">Tema da Interface</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tema {theme === 'dark' ? 'Escuro' : 'Claro'} ativado
                </p>
              </div>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="lg" className="w-full sm:w-auto">
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-5 w-5" />
                  Ativar Claro
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  Ativar Escuro
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* About Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Sobre</h2>
            <p className="text-sm text-muted-foreground">
              Informações sobre o ScholarSync
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ScholarSync é uma plataforma completa para gestão de calendários avaliativos, 
                  desenvolvida para facilitar o trabalho de professores e coordenadores pedagógicos 
                  em instituições de ensino.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Versão</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ano</span>
                <span className="font-medium">2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfiguracoesPage;