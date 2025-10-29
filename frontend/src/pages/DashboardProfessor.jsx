import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { Plus, Calendar, Edit, Send, Eye } from 'lucide-react';
import { formatarData } from '../utils/dateHelpers';

const DashboardProfessor = () => {
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCalendarios();
  }, []);

  const carregarCalendarios = async () => {
    try {
      const data = await calendarioService.listar();
      setCalendarios(data);
    } catch (error) {
      toast.error('Erro ao carregar calendários');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async (id) => {
    try {
      await calendarioService.enviar(id);
      toast.success('Calendário enviado!');
      carregarCalendarios();
    } catch (error) {
      toast.error('Erro ao enviar');
    }
  };

  const stats = {
    total: calendarios.length,
    rascunho: calendarios.filter(c => c.status === 'rascunho').length,
    enviado: calendarios.filter(c => c.status === 'enviado').length,
    aprovado: calendarios.filter(c => c.status === 'aprovado').length,
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-96">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Calendários</h1>
            <p className="text-muted-foreground">Gerencie seus calendários avaliativos</p>
          </div>
          <Button onClick={() => navigate('/professor/novo')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Calendário
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rascunho}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enviado}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aprovado}</div>
            </CardContent>
          </Card>
        </div>

        {calendarios.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Nenhum calendário criado</h3>
              <p className="mb-4 text-muted-foreground">Crie seu primeiro calendário</p>
              <Button onClick={() => navigate('/professor/novo')}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Calendário
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                      </div>
                      <CardDescription>{cal.bimestre}º Bimestre • {cal.ano}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">AV1</p>
                      <p className="text-sm text-muted-foreground">{formatarData(cal.av1.data)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">AV2</p>
                      <p className="text-sm text-muted-foreground">{formatarData(cal.av2.data)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Consolidação</p>
                      <p className="text-sm text-muted-foreground">{formatarData(cal.consolidacao.data)}</p>
                    </div>
                  </div>

                  {cal.comentarioCoordenacao && (
                    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
                      <p className="text-sm font-medium">Comentário da Coordenação:</p>
                      <p className="text-sm text-muted-foreground">{cal.comentarioCoordenacao}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {cal.status === 'rascunho' ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button size="sm" onClick={() => handleEnviar(cal._id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
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

export default DashboardProfessor;
