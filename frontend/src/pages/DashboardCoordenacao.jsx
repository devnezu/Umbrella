import React, { useState, useEffect } from 'react';
import Header from '../components/shared/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import pdfService from '../services/pdfService';
import { toast } from 'sonner';
import { FileText, Download, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import Loading from '../components/shared/Loading';
import { formatarData } from '../utils/dateHelpers';

const DashboardCoordenacao = () => {
  const [calendarios, setCalendarios] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [calendData, statsData] = await Promise.all([
        calendarioService.listar(),
        calendarioService.estatisticas()
      ]);
      setCalendarios(calendData);
      setEstatisticas(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      await calendarioService.aprovar(id);
      toast.success('Calendário aprovado!');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao aprovar calendário');
    }
  };

  const handleSolicitarAjuste = async (id) => {
    const comentario = prompt('Digite o comentário para o professor:');
    if (comentario) {
      try {
        await calendarioService.solicitarAjuste(id, comentario);
        toast.success('Ajuste solicitado!');
        carregarDados();
      } catch (error) {
        toast.error('Erro ao solicitar ajuste');
      }
    }
  };

  const handleDownloadPDF = async (id, turma, disciplina) => {
    try {
      const blob = await pdfService.gerarPDFIndividual(id);
      pdfService.downloadPDF(blob, `calendario_${turma}_${disciplina}.pdf`);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      rascunho: { variant: 'outline', icon: AlertCircle, label: 'Rascunho' },
      enviado: { variant: 'warning', icon: AlertCircle, label: 'Pendente' },
      aprovado: { variant: 'success', icon: CheckCircle, label: 'Aprovado' }
    };

    const { variant, icon: Icon, label } = config[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const calendariosFiltrados = calendarios.filter(c => {
    if (filtroStatus === 'todos') return true;
    return c.status === filtroStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
            Painel da Coordenação
          </h2>
          <p className="text-muted-foreground">
            Gerencie todos os calendários avaliativos
          </p>
        </div>

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rascunhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {estatisticas.rascunho}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {estatisticas.enviado}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aprovados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {estatisticas.aprovado}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Precisam Impressão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {estatisticas.necessitaImpressao}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={filtroStatus === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
              </Button>
              <Button
                variant={filtroStatus === 'enviado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroStatus('enviado')}
              >
                Pendentes
              </Button>
              <Button
                variant={filtroStatus === 'aprovado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroStatus('aprovado')}
              >
                Aprovados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de calendários */}
        <div className="space-y-4">
          {calendariosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum calendário encontrado</h3>
                <p className="text-muted-foreground">
                  {filtroStatus === 'todos'
                    ? 'Não há calendários cadastrados'
                    : `Não há calendários com status "${filtroStatus}"`}
                </p>
              </CardContent>
            </Card>
          ) : (
            calendariosFiltrados.map((calendario) => (
              <Card key={calendario._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          {calendario.turma} - {calendario.disciplina}
                        </CardTitle>
                        {getStatusBadge(calendario.status)}
                        {calendario.necessitaImpressao && (
                          <Badge variant="outline" className="bg-blue-50">
                            Impressão
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Professor: {calendario.professor?.nome} • {calendario.bimestre}º Bimestre • {calendario.ano}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">AV1</p>
                      <p className="text-sm text-muted-foreground">
                        {formatarData(calendario.av1.data)} • {calendario.av1.instrumento}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">AV2</p>
                      <p className="text-sm text-muted-foreground">
                        {formatarData(calendario.av2.data)} • {calendario.av2.instrumento}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Consolidação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatarData(calendario.consolidacao.data)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPDF(calendario._id, calendario.turma, calendario.disciplina)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>

                    {calendario.status === 'enviado' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAprovar(calendario._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSolicitarAjuste(calendario._id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Solicitar Ajuste
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardCoordenacao;
