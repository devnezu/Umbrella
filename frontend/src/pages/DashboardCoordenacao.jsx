import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Download, Search, FileText, Clock, AlertCircle, Send, Printer } from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';
import { Spinner } from '../components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const TURMAS = [
  '6ºA', '6ºB', '6ºC', '6ºD', '7ºA', '7ºB', '7ºC', '8ºA', '8ºB', '8ºC', '8ºD', '9ºA', '9ºB', '9ºC', '9ºD',
  '1ºEM-A', '1ºEM-B', '2ºEM-A', '2ºEM-B', '3ºEM-A', '3ºEM-B'
];

const DashboardCoordenacao = () => {
  const navigate = useNavigate();
  const [calendarios, setCalendarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ajusteDialog, setAjusteDialog] = useState({ open: false, calendarioId: null });
  const [exportDialog, setExportDialog] = useState({ 
    open: false, 
    turma: '', 
    bimestre: '2', 
    ano: new Date().getFullYear() 
  });
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [calData, statsData] = await Promise.all([
        calendarioService.listar(),
        calendarioService.estatisticas()
      ]);
      setCalendarios(calData);
      setStats(statsData);
    } catch (error) {
      toast.error('Erro ao carregar dados', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      await calendarioService.aprovar(id);
      toast.success('Calendário aprovado!', {
        description: 'O professor foi notificado'
      });
      carregarDados();
    } catch (error) {
      toast.error('Erro ao aprovar calendário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    }
  };

  const handleSolicitarAjuste = async () => {
    if (!comentario.trim()) {
      toast.error('Digite um comentário', {
        description: 'Informe o motivo do ajuste'
      });
      return;
    }

    try {
      setSubmitting(true);
      await calendarioService.solicitarAjuste(ajusteDialog.calendarioId, comentario);
      toast.success('Ajuste solicitado!', {
        description: 'O professor receberá o feedback'
      });
      setAjusteDialog({ open: false, calendarioId: null });
      setComentario('');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao solicitar ajuste', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportTurma = async () => {
    if (!exportDialog.turma) {
      toast.error('Selecione uma turma');
      return;
    }
    
    try {
      setSubmitting(true);
      toast.info('Gerando PDF consolidado...', { description: 'Isso pode levar alguns segundos.' });
      
      const blob = await calendarioService.gerarPDFTurma(
        exportDialog.turma, 
        parseInt(exportDialog.bimestre), 
        exportDialog.ano
      );
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Calendario_${exportDialog.turma}_${exportDialog.bimestre}Bim.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download iniciado!');
      setExportDialog({ ...exportDialog, open: false });
    } catch (error) {
      toast.error('Erro ao exportar', {
        description: error.response?.data?.mensagem || 'Verifique se há calendários aprovados para esta turma.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async (cal) => {
    try {
      toast.info('Gerando PDF...', {
        description: 'Aguarde alguns instantes'
      });
      const blob = await calendarioService.gerarPDF(cal.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendario_${cal.turma}_${cal.disciplina}_${cal.bimestre}bim.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    }
  };

  const filteredCalendarios = calendarios.filter(cal => {
    const matchesSearch = cal.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cal.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cal.professor?.nome.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Painel da Coordenação</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e aprove calendários avaliativos
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setExportDialog({ ...exportDialog, open: true })}>
            <Printer className="mr-2 h-4 w-4" />
            Baixar Calendário da Turma
          </Button>
        </div>

        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-3xl font-bold mt-2">{stats.enviado}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Impressão</p>
                  <p className="text-3xl font-bold mt-2">{stats.necessitaImpressao}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Download className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por turma, disciplina ou professor..."
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

        {filteredCalendarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum calendário encontrado</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar seus filtros de busca'
                : 'Não há calendários cadastrados no momento'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCalendarios.map((cal) => (
              <div
                key={cal.id}
                className="rounded-lg border bg-card p-6 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-xl">{cal.turma} - {cal.disciplina}</h3>
                        <Badge
                          variant={
                            cal.status === 'aprovado'
                              ? 'default'
                              : cal.status === 'enviado'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="capitalize"
                        >
                          {cal.status}
                        </Badge>
                        {cal.necessitaImpressao && (
                          <Badge variant="outline" className="border-red-500 text-red-500">
                            Requer Impressão
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Professor: {cal.professor?.nome} • {cal.bimestre}º Bimestre • {cal.ano}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">AV1</p>
                      <p className="font-semibold">{formatarData(cal.av1.data)}</p>
                      <p className="text-xs text-muted-foreground">{cal.av1.instrumento}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">AV2</p>
                      <p className="font-semibold">{formatarData(cal.av2.data)}</p>
                      <p className="text-xs text-muted-foreground">{cal.av2.instrumento}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Consolidação</p>
                      <p className="font-semibold">{formatarData(cal.consolidacao.data)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/coordenacao/visualizar/${cal.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(cal)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    {cal.status === 'enviado' && (
                      <>
                        <Button size="sm" onClick={() => handleAprovar(cal.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAjusteDialog({ open: true, calendarioId: cal.id })}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Solicitar Ajuste
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={ajusteDialog.open} onOpenChange={(open) => setAjusteDialog({ ...ajusteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Ajuste</DialogTitle>
            <DialogDescription>
              Descreva as alterações necessárias para o professor
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Digite o motivo do ajuste solicitado..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setAjusteDialog({ open: false, calendarioId: null });
                setComentario('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSolicitarAjuste} disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportDialog.open} onOpenChange={(open) => setExportDialog({ ...exportDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Calendário da Turma</DialogTitle>
            <DialogDescription>
              Gera um PDF único com todas as matérias da turma selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select 
                value={exportDialog.turma} 
                onValueChange={(v) => setExportDialog({ ...exportDialog, turma: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TURMAS.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bimestre</label>
                <Select 
                  value={String(exportDialog.bimestre)} 
                  onValueChange={(v) => setExportDialog({ ...exportDialog, bimestre: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Bimestre</SelectItem>
                    <SelectItem value="2">2º Bimestre</SelectItem>
                    <SelectItem value="3">3º Bimestre</SelectItem>
                    <SelectItem value="4">4º Bimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ano</label>
                <Input 
                  type="number" 
                  value={exportDialog.ano} 
                  onChange={(e) => setExportDialog({ ...exportDialog, ano: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setExportDialog({ ...exportDialog, open: false })}
            >
              Cancelar
            </Button>
            <Button onClick={handleExportTurma} disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DashboardCoordenacao;