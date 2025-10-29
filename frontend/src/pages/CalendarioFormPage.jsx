import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import calendarioService from '../services/calendarioService';
import { toast } from 'sonner';
import { Save, ArrowLeft } from 'lucide-react';

const INSTRUMENTOS = [
  'Prova Impressa',
  'Atividade',
  'Lista de Exercícios',
  'Trabalho',
  'Apresentação'
];

const CalendarioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turma: '',
    disciplina: '',
    bimestre: 1,
    ano: new Date().getFullYear(),
    av1: {
      data: '',
      instrumento: 'Prova Impressa',
      conteudo: '',
      criterios: ''
    },
    av2: {
      data: '',
      instrumento: 'Prova Impressa',
      conteudo: '',
      criterios: ''
    },
    consolidacao: {
      data: '',
      conteudo: '',
      criterios: ''
    },
    observacoes: ''
  });

  useEffect(() => {
    if (id) {
      carregarCalendario();
    }
  }, [id]);

  const carregarCalendario = async () => {
    try {
      setLoading(true);
      const data = await calendarioService.buscarPorId(id);
      setFormData({
        ...data,
        av1: {
          ...data.av1,
          data: data.av1.data ? new Date(data.av1.data).toISOString().split('T')[0] : ''
        },
        av2: {
          ...data.av2,
          data: data.av2.data ? new Date(data.av2.data).toISOString().split('T')[0] : ''
        },
        consolidacao: {
          ...data.consolidacao,
          data: data.consolidacao.data ? new Date(data.consolidacao.data).toISOString().split('T')[0] : ''
        }
      });
    } catch (error) {
      toast.error('Erro ao carregar calendário');
      navigate('/professor/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await calendarioService.atualizar(id, formData);
        toast.success('Calendário atualizado!');
      } else {
        await calendarioService.criar(formData);
        toast.success('Calendário criado!');
      }
      navigate('/professor/dashboard');
    } catch (error) {
      toast.error(id ? 'Erro ao atualizar' : 'Erro ao criar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  if (loading && id) {
    return <Layout>
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/professor/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {id ? 'Editar Calendário' : 'Novo Calendário'}
            </h1>
            <p className="text-muted-foreground">
              Preencha as informações do calendário avaliativo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados gerais do calendário avaliativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="turma">Turma *</Label>
                  <Input
                    id="turma"
                    value={formData.turma}
                    onChange={(e) => handleChange('turma', e.target.value)}
                    placeholder="Ex: 9º Ano A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disciplina">Disciplina *</Label>
                  <Input
                    id="disciplina"
                    value={formData.disciplina}
                    onChange={(e) => handleChange('disciplina', e.target.value)}
                    placeholder="Ex: Matemática"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bimestre">Bimestre *</Label>
                  <select
                    id="bimestre"
                    value={formData.bimestre}
                    onChange={(e) => handleChange('bimestre', parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value={1}>1º Bimestre</option>
                    <option value={2}>2º Bimestre</option>
                    <option value={3}>3º Bimestre</option>
                    <option value={4}>4º Bimestre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano *</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => handleChange('ano', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Gerais</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  placeholder="Observações gerais sobre o calendário"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AV1 */}
          <Card>
            <CardHeader>
              <CardTitle>AV1 - Primeira Avaliação</CardTitle>
              <CardDescription>Informações sobre a primeira avaliação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="av1Data">Data *</Label>
                  <Input
                    id="av1Data"
                    type="date"
                    value={formData.av1.data}
                    onChange={(e) => handleNestedChange('av1', 'data', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="av1Instrumento">Instrumento Avaliativo *</Label>
                  <select
                    id="av1Instrumento"
                    value={formData.av1.instrumento}
                    onChange={(e) => handleNestedChange('av1', 'instrumento', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {INSTRUMENTOS.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="av1Conteudo">Conteúdo *</Label>
                <Textarea
                  id="av1Conteudo"
                  value={formData.av1.conteudo}
                  onChange={(e) => handleNestedChange('av1', 'conteudo', e.target.value)}
                  placeholder="Descreva o conteúdo que será avaliado (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av1Criterios">Critérios de Avaliação *</Label>
                <Textarea
                  id="av1Criterios"
                  value={formData.av1.criterios}
                  onChange={(e) => handleNestedChange('av1', 'criterios', e.target.value)}
                  placeholder="Descreva os critérios de avaliação (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* AV2 */}
          <Card>
            <CardHeader>
              <CardTitle>AV2 - Segunda Avaliação</CardTitle>
              <CardDescription>Informações sobre a segunda avaliação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="av2Data">Data *</Label>
                  <Input
                    id="av2Data"
                    type="date"
                    value={formData.av2.data}
                    onChange={(e) => handleNestedChange('av2', 'data', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="av2Instrumento">Instrumento Avaliativo *</Label>
                  <select
                    id="av2Instrumento"
                    value={formData.av2.instrumento}
                    onChange={(e) => handleNestedChange('av2', 'instrumento', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {INSTRUMENTOS.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="av2Conteudo">Conteúdo *</Label>
                <Textarea
                  id="av2Conteudo"
                  value={formData.av2.conteudo}
                  onChange={(e) => handleNestedChange('av2', 'conteudo', e.target.value)}
                  placeholder="Descreva o conteúdo que será avaliado (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av2Criterios">Critérios de Avaliação *</Label>
                <Textarea
                  id="av2Criterios"
                  value={formData.av2.criterios}
                  onChange={(e) => handleNestedChange('av2', 'criterios', e.target.value)}
                  placeholder="Descreva os critérios de avaliação (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Consolidação */}
          <Card>
            <CardHeader>
              <CardTitle>Consolidação de Notas</CardTitle>
              <CardDescription>Informações sobre a consolidação das avaliações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consolidacaoData">Data *</Label>
                <Input
                  id="consolidacaoData"
                  type="date"
                  value={formData.consolidacao.data}
                  onChange={(e) => handleNestedChange('consolidacao', 'data', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consolidacaoConteudo">Conteúdo *</Label>
                <Textarea
                  id="consolidacaoConteudo"
                  value={formData.consolidacao.conteudo}
                  onChange={(e) => handleNestedChange('consolidacao', 'conteudo', e.target.value)}
                  placeholder="Descreva o processo de consolidação (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consolidacaoCriterios">Critérios *</Label>
                <Textarea
                  id="consolidacaoCriterios"
                  value={formData.consolidacao.criterios}
                  onChange={(e) => handleNestedChange('consolidacao', 'criterios', e.target.value)}
                  placeholder="Descreva os critérios de consolidação (mínimo 10 caracteres)"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/professor/dashboard')}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CalendarioFormPage;
