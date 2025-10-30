import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { Plus, Calendar, Edit, Send, Eye, Search, Clock, CheckCircle2, FileText, TrendingUp } from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';
import { Spinner } from '../components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const DashboardProfessor = () => {
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    carregarCalendarios();
  }, []);

  const carregarCalendarios = async () => {
    try {
      const data = await calendarioService.listar();
      setCalendarios(data);
    } catch (error) {
      toast.error('Erro ao carregar calendários', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async (id) => {
    try {
      await calendarioService.enviar(id);
      toast.success('Calendário enviado!', {
        description: 'A coordenação receberá sua solicitação'
      });
      carregarCalendarios();
    } catch (error) {
      toast.error('Erro ao enviar calendário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    }
  };

  const stats = {
    total: calendarios.length,
    rascunho: calendarios.filter(c => c.status === 'rascunho').length,
    enviado: calendarios.filter(c => c.status === 'enviado').length,
    aprovado: calendarios.filter(c => c.status === 'aprovado').length,
  };

  const filteredCalendarios = calendarios.filter(cal => {
    const matchesSearch = cal.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cal.disciplina.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Spinner className="h-8 w-8" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Meus Calendários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus calendários avaliativos
            </p>
          </div>
          <Button onClick={() => navigate('/professor/novo')} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Novo Calendário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rascunhos</p>
                <p className="text-3xl font-bold mt-2">{stats.rascunho}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Edit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enviados</p>
                <p className="text-3xl font-bold mt-2">{stats.enviado}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                <p className="text-3xl font-bold mt-2">{stats.aprovado}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por turma ou disciplina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendários */}
        {filteredCalendarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum calendário encontrado</h3>
            <p className="mb-6 text-muted-foreground max-w-sm">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar seus filtros de busca'
                : 'Comece criando seu primeiro calendário avaliativo'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => navigate('/professor/novo')} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Calendário
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCalendarios.map((cal) => (
              <div
                key={cal._id}
                className="rounded-lg border bg-card p-6 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{cal.turma}</h3>
                        <Badge
                          variant={
                            cal.status === 'aprovado'
                              ? 'default'
                              : cal.status === 'enviado'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="capitalize text-xs"
                        >
                          {cal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cal.disciplina}</p>
                      <p className="text-xs text-muted-foreground">
                        {cal.bimestre}º Bimestre • {cal.ano}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AV1:</span>
                      <span className="font-medium">{formatarData(cal.av1.data)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AV2:</span>
                      <span className="font-medium">{formatarData(cal.av2.data)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consolidação:</span>
                      <span className="font-medium">{formatarData(cal.consolidacao.data)}</span>
                    </div>
                  </div>

                  {cal.comentarioCoordenacao && (
                    <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3">
                      <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                        Ajuste Solicitado
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-300 line-clamp-2">
                        {cal.comentarioCoordenacao}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {cal.status === 'rascunho' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/professor/editar/${cal._id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEnviar(cal._id)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Enviar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/professor/visualizar/${cal._id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardProfessor;