import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { Calendar, Plus, FileText, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import Loading from '../components/shared/Loading';
import FormularioCalendario from '../components/professor/FormularioCalendario';
import { formatarData } from '../utils/dateHelpers';

const DashboardProfessorNew = () => {
  const { user } = useAuth();
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCalendario, setSelectedCalendario] = useState(null);

  useEffect(() => {
    carregarCalendarios();
  }, []);

  const carregarCalendarios = async () => {
    try {
      setLoading(true);
      const data = await calendarioService.listar();
      setCalendarios(data);
    } catch (error) {
      console.error('Erro ao carregar calendários:', error);
      toast.error('Erro ao carregar calendários');
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setSelectedCalendario(null);
    setShowForm(true);
  };

  const handleEditar = (calendario) => {
    setSelectedCalendario(calendario);
    setShowForm(true);
  };

  const handleFecharForm = () => {
    setShowForm(false);
    setSelectedCalendario(null);
    carregarCalendarios();
  };

  const handleEnviar = async (id) => {
    try {
      await calendarioService.enviar(id);
      toast.success('Calendário enviado com sucesso!');
      carregarCalendarios();
    } catch (error) {
      toast.error('Erro ao enviar calendário');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      rascunho: { variant: 'outline', icon: AlertCircle, label: 'Rascunho', color: 'text-gray-600' },
      enviado: { variant: 'warning', icon: Clock, label: 'Enviado', color: 'text-warning' },
      aprovado: { variant: 'success', icon: CheckCircle, label: 'Aprovado', color: 'text-success' },
    };

    const { variant, icon: Icon, label, color } = config[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${color}`} />
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (showForm) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <FormularioCalendario
            calendario={selectedCalendario}
            onClose={handleFecharForm}
          />
        </div>
      </Layout>
    );
  }

  const stats = {
    total: calendarios.length,
    rascunho: calendarios.filter(c => c.status === 'rascunho').length,
    enviado: calendarios.filter(c => c.status === 'enviado').length,
    aprovado: calendarios.filter(c => c.status === 'aprovado').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Calendários Avaliativos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus calendários de avaliações
            </p>
          </div>

          <Button onClick={handleNovo} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Calendário
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">calendários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rascunhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.rascunho}</div>
              <p className="text-xs text-muted-foreground mt-1">em edição</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.enviado}</div>
              <p className="text-xs text-muted-foreground mt-1">aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.aprovado}</div>
              <p className="text-xs text-muted-foreground mt-1">finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de calendários */}
        {calendarios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum calendário criado</h3>
              <p className="text-muted-foreground mb-6">
                Comece criando seu primeiro calendário avaliativo
              </p>
              <Button onClick={handleNovo} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Criar Calendário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {calendarios.map((calendario) => (
              <Card key={calendario._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">
                          {calendario.turma} - {calendario.disciplina}
                        </CardTitle>
                        {getStatusBadge(calendario.status)}
                      </div>
                      <CardDescription>
                        {calendario.bimestre}º Bimestre • {calendario.ano}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">AV1</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.av1.data)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {calendario.av1.instrumento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">AV2</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.av2.data)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {calendario.av2.instrumento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Consolidação</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.consolidacao.data)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {calendario.comentarioCoordenacao && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-warning-foreground mb-1">
                        Comentário da Coordenação:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {calendario.comentarioCoordenacao}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {calendario.status === 'rascunho' && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleEditar(calendario)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleEnviar(calendario._id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar para Coordenação
                        </Button>
                      </>
                    )}

                    {calendario.status !== 'rascunho' && (
                      <Button
                        variant="outline"
                        onClick={() => handleEditar(calendario)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardProfessorNew;
