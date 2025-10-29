import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { ArrowLeft, Download, CheckCircle, XCircle, Edit } from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';

const CalendarioViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    carregarCalendario();
  }, [id]);

  const carregarCalendario = async () => {
    try {
      const data = await calendarioService.buscarPorId(id);
      setCalendario(data);
    } catch (error) {
      toast.error('Erro ao carregar calendário');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async () => {
    try {
      await calendarioService.aprovar(id);
      toast.success('Calendário aprovado!');
      navigate('/coordenacao/dashboard');
    } catch (error) {
      toast.error('Erro ao aprovar');
    }
  };

  const handleSolicitarAjuste = async () => {
    if (!comentario.trim()) {
      toast.error('Digite um comentário para solicitar ajuste');
      return;
    }

    try {
      await calendarioService.solicitarAjuste(id, comentario);
      toast.success('Ajuste solicitado!');
      navigate('/coordenacao/dashboard');
    } catch (error) {
      toast.error('Erro ao solicitar ajuste');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info('Gerando PDF...');
      const blob = await calendarioService.gerarPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendario_${calendario.turma}_${calendario.disciplina}_${calendario.bimestre}bim.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF baixado!');
    } catch (error) {
      toast.error('Erro ao gerar PDF');
    }
  };

  const isCoordination = user?.role === 'admin' || user?.role === 'coordenacao';
  const canEdit = calendario?.status === 'rascunho' && !isCoordination;
  const canApprove = calendario?.status === 'enviado' && isCoordination;

  if (loading) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!calendario) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Calendário Avaliativo</h1>
                <Badge
                  variant={
                    calendario.status === 'aprovado'
                      ? 'default'
                      : calendario.status === 'enviado'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {calendario.status}
                </Badge>
                {calendario.necessitaImpressao && (
                  <Badge variant="outline">Impressão</Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {calendario.turma} - {calendario.disciplina}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <Button variant="outline" onClick={() => navigate(`/professor/editar/${id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Turma</p>
                <p className="text-base font-medium">{calendario.turma}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disciplina</p>
                <p className="text-base font-medium">{calendario.disciplina}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bimestre</p>
                <p className="text-base font-medium">{calendario.bimestre}º Bimestre</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ano</p>
                <p className="text-base font-medium">{calendario.ano}</p>
              </div>
              {calendario.professor && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Professor</p>
                  <p className="text-base font-medium">{calendario.professor.nome}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AV1 */}
        <Card>
          <CardHeader>
            <CardTitle>AV1 - Primeira Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="text-base font-medium">{formatarData(calendario.av1.data)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Instrumento Avaliativo</p>
                <p className="text-base font-medium">{calendario.av1.instrumento}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conteúdo</p>
              <p className="text-base">{calendario.av1.conteudo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critérios de Avaliação</p>
              <p className="text-base">{calendario.av1.criterios}</p>
            </div>
          </CardContent>
        </Card>

        {/* AV2 */}
        <Card>
          <CardHeader>
            <CardTitle>AV2 - Segunda Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="text-base font-medium">{formatarData(calendario.av2.data)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Instrumento Avaliativo</p>
                <p className="text-base font-medium">{calendario.av2.instrumento}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conteúdo</p>
              <p className="text-base">{calendario.av2.conteudo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critérios de Avaliação</p>
              <p className="text-base">{calendario.av2.criterios}</p>
            </div>
          </CardContent>
        </Card>

        {/* Consolidação */}
        <Card>
          <CardHeader>
            <CardTitle>Consolidação de Notas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data</p>
              <p className="text-base font-medium">{formatarData(calendario.consolidacao.data)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conteúdo</p>
              <p className="text-base">{calendario.consolidacao.conteudo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critérios</p>
              <p className="text-base">{calendario.consolidacao.criterios}</p>
            </div>
          </CardContent>
        </Card>

        {/* Observações Gerais */}
        {calendario.observacoes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{calendario.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Comentário da Coordenação */}
        {calendario.comentarioCoordenacao && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                Comentário da Coordenação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{calendario.comentarioCoordenacao}</p>
            </CardContent>
          </Card>
        )}

        {/* Ações de Aprovação (apenas para coordenação) */}
        {canApprove && (
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
              <CardDescription>Aprove ou solicite ajustes no calendário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleAprovar}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar Calendário
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Ou solicite ajustes:</p>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Digite o motivo do ajuste solicitado..."
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button variant="outline" onClick={handleSolicitarAjuste}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Solicitar Ajuste
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CalendarioViewPage;
