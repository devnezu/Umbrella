import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/shared/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { Calendar, Plus, FileText, Clock } from 'lucide-react';
import Loading from '../components/shared/Loading';
import FormularioCalendario from '../components/professor/FormularioCalendario';
import { formatarData } from '../utils/dateHelpers';

const DashboardProfessor = () => {
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

  const getStatusBadge = (status) => {
    const variants = {
      rascunho: 'outline',
      enviado: 'warning',
      aprovado: 'success',
    };

    const labels = {
      rascunho: 'Rascunho',
      enviado: 'Enviado',
      aprovado: 'Aprovado',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto p-6">
          <FormularioCalendario
            calendario={selectedCalendario}
            onClose={handleFecharForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">
              Meus Calendários Avaliativos
            </h2>
            <p className="text-muted-foreground mt-1">
              Gerencie seus calendários de avaliações
            </p>
          </div>

          <Button onClick={handleNovo}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Calendário
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calendarios.length}</div>
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
                {calendarios.filter((c) => c.status === 'rascunho').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {calendarios.filter((c) => c.status === 'enviado').length}
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
                {calendarios.filter((c) => c.status === 'aprovado').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de calendários */}
        {calendarios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum calendário criado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro calendário avaliativo
              </p>
              <Button onClick={handleNovo}>
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
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
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

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AV1</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.av1.data)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AV2</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.av2.data)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Consolidação</p>
                        <p className="text-sm text-muted-foreground">
                          {formatarData(calendario.consolidacao.data)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {calendario.comentarioCoordenacao && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                      <p className="text-sm font-medium text-yellow-900 mb-1">
                        Comentário da Coordenação:
                      </p>
                      <p className="text-sm text-yellow-800">
                        {calendario.comentarioCoordenacao}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {calendario.status === 'rascunho' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(calendario)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await calendarioService.enviar(calendario._id);
                              toast.success('Calendário enviado com sucesso!');
                              carregarCalendarios();
                            } catch (error) {
                              toast.error('Erro ao enviar calendário');
                            }
                          }}
                        >
                          Enviar para Coordenação
                        </Button>
                      </>
                    )}

                    {calendario.status !== 'rascunho' && (
                      <Button
                        size="sm"
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
      </main>
    </div>
  );
};

export default DashboardProfessor;
