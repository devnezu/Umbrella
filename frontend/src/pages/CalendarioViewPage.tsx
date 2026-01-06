// frontend/src/pages/CalendarioViewPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { 
  ArrowLeft, Download, CheckCircle, XCircle, Edit, AlertTriangle, 
  Calendar, FileText, Eye, FileCheck 
} from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';
import { Spinner } from '../components/ui/spinner';
import PDFPreview from '../components/calendario/PDFPreview';

const CalendarioViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    carregarCalendario();
  }, [id]);

  const carregarCalendario = async () => {
    try {
      const data = await calendarioService.buscarPorId(id);
      setCalendario(data);
    } catch (error) {
      toast.error('Erro ao carregar calendário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async () => {
    try {
      setSubmitting(true);
      await calendarioService.aprovar(id);
      toast.success('Calendário aprovado!', {
        description: 'O professor foi notificado'
      });
      navigate('/coordenacao/dashboard');
    } catch (error) {
      toast.error('Erro ao aprovar calendário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setSubmitting(false);
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
      await calendarioService.solicitarAjuste(id, comentario);
      toast.success('Ajuste solicitado!', {
        description: 'O professor receberá o feedback'
      });
      navigate('/coordenacao/dashboard');
    } catch (error) {
      toast.error('Erro ao solicitar ajuste', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info('Gerando PDF...', {
        description: 'Aguarde alguns instantes'
      });
      const blob = await calendarioService.gerarPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendario_${calendario.turma}_${calendario.disciplina}_${calendario.bimestre}bim.pdf`;
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

  const isCoordination = user?.role === 'admin' || user?.role === 'coordenacao';
  const canEdit = calendario?.status === 'rascunho' && !isCoordination;
  const canApprove = calendario?.status === 'enviado' && isCoordination;

  if (loading) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </Layout>
    );
  }

  if (!calendario) return null;

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        {/* Header Reorganizado */}
        <div className="space-y-4">
          {/* Linha 1: Botão Voltar + Título */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">
                  {calendario.turma} - {calendario.disciplina}
                </h1>
                <Badge
                  variant={
                    calendario.status === 'aprovado'
                      ? 'default'
                      : calendario.status === 'enviado'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="capitalize"
                >
                  {calendario.status}
                </Badge>
                {calendario.necessitaImpressao && (
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    Requer Impressão
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {calendario.bimestre}º Bimestre • {calendario.ano} • {calendario.professor?.nome}
              </p>
            </div>
          </div>

          {/* Linha 2: Ações */}
          <div className="flex gap-2 flex-wrap">
            {canEdit && (
              <Button onClick={() => navigate(`/professor/editar/${id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Calendário
              </Button>
            )}
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Tabs para alternar entre Preview e Detalhes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="preview">
              <FileCheck className="mr-2 h-4 w-4" />
              Preview do PDF
            </TabsTrigger>
            <TabsTrigger value="detalhes">
              <Eye className="mr-2 h-4 w-4" />
              Detalhes
            </TabsTrigger>
          </TabsList>

          {/* Preview do PDF */}
          <TabsContent value="preview" className="mt-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <FileCheck className="h-4 w-4" />
                <span>Visualização de como o PDF será gerado</span>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <PDFPreview calendario={calendario} />
              </div>
            </div>
          </TabsContent>

          {/* Detalhes Estruturados */}
          <TabsContent value="detalhes" className="mt-6 space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Informações Básicas</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Turma</p>
                  <p className="text-lg font-semibold">{calendario.turma}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Disciplina</p>
                  <p className="text-lg font-semibold">{calendario.disciplina}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bimestre</p>
                  <p className="text-lg font-semibold">{calendario.bimestre}º Bimestre</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ano</p>
                  <p className="text-lg font-semibold">{calendario.ano}</p>
                </div>
                {calendario.professor && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Professor</p>
                    <p className="text-lg font-semibold">{calendario.professor.nome}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* AV1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-semibold">AV1 - Primeira Avaliação</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="text-lg font-semibold">{formatarData(calendario.av1.data)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Instrumento Avaliativo</p>
                  <p className="text-lg font-semibold">{calendario.av1.instrumento}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Conteúdo</p>
                  <p className="text-base leading-relaxed">{calendario.av1.conteudo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Critérios de Avaliação</p>
                  <p className="text-base leading-relaxed">{calendario.av1.criterios}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* AV2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h2 className="text-2xl font-semibold">AV2 - Segunda Avaliação</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="text-lg font-semibold">{formatarData(calendario.av2.data)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Instrumento Avaliativo</p>
                  <p className="text-lg font-semibold">{calendario.av2.instrumento}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Conteúdo</p>
                  <p className="text-base leading-relaxed">{calendario.av2.conteudo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Critérios de Avaliação</p>
                  <p className="text-base leading-relaxed">{calendario.av2.criterios}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Consolidação */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-2xl font-semibold">Consolidação de Notas</h2>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="text-lg font-semibold">{formatarData(calendario.consolidacao.data)}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Conteúdo</p>
                  <p className="text-base leading-relaxed">{calendario.consolidacao.conteudo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Critérios</p>
                  <p className="text-base leading-relaxed">{calendario.consolidacao.criterios}</p>
                </div>
              </div>
            </div>

            {calendario.observacoes && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Observações Gerais</h2>
                  <p className="text-base leading-relaxed">{calendario.observacoes}</p>
                </div>
              </>
            )}

            {calendario.comentarioCoordenacao && (
              <>
                <Separator />
                <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                        Comentário da Coordenação
                      </h3>
                      <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                        {calendario.comentarioCoordenacao}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Ações de Aprovação (apenas para coordenação) */}
        {canApprove && (
          <>
            <Separator />
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Ações de Aprovação</h2>
                <p className="text-sm text-muted-foreground">
                  Aprove ou solicite ajustes no calendário
                </p>
              </div>

              <Button onClick={handleAprovar} disabled={submitting} size="lg">
                {submitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Aprovando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Aprovar Calendário
                  </>
                )}
              </Button>

              <Separator />

              <div className="space-y-4">
                <p className="text-sm font-medium">Ou solicite ajustes:</p>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Digite o motivo do ajuste solicitado..."
                  className="min-h-[120px]"
                />
                <Button variant="outline" onClick={handleSolicitarAjuste} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Solicitar Ajuste
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CalendarioViewPage;