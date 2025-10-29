import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';

const DashboardCoordenacao = () => {
  const [calendarios, setCalendarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      toast.error('Erro ao aprovar');
    }
  };

  const handleSolicitarAjuste = async (id) => {
    const comentario = prompt('Digite o comentário:');
    if (!comentario) return;

    try {
      await calendarioService.solicitarAjuste(id, comentario);
      toast.success('Ajuste solicitado!');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao solicitar ajuste');
    }
  };

  if (loading) {
    return <Layout><div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel da Coordenação</h1>
          <p className="text-muted-foreground">Gerencie todos os calendários avaliativos</p>
        </div>

        {stats && (
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Rascunhos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rascunho}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.enviado}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Aprovados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.aprovado}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Impressão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.necessitaImpressao}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4">
          {calendarios.map((cal) => (
            <Card key={cal._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{cal.turma} - {cal.disciplina}</CardTitle>
                      <Badge variant={cal.status === 'aprovado' ? 'default' : cal.status === 'enviado' ? 'secondary' : 'outline'}>
                        {cal.status}
                      </Badge>
                      {cal.necessitaImpressao && <Badge variant="outline">Impressão</Badge>}
                    </div>
                    <CardDescription>
                      Professor: {cal.professor?.nome} • {cal.bimestre}º Bimestre • {cal.ano}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">AV1</p>
                    <p className="text-sm text-muted-foreground">{formatarData(cal.av1.data)} • {cal.av1.instrumento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">AV2</p>
                    <p className="text-sm text-muted-foreground">{formatarData(cal.av2.data)} • {cal.av2.instrumento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consolidação</p>
                    <p className="text-sm text-muted-foreground">{formatarData(cal.consolidacao.data)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  {cal.status === 'enviado' && (
                    <>
                      <Button size="sm" onClick={() => handleAprovar(cal._id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSolicitarAjuste(cal._id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Solicitar Ajuste
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardCoordenacao;
