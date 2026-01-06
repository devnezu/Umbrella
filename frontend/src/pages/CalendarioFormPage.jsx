import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import calendarioService from '../services/calendarioService';
import gradeHorariaService from '../services/gradeHorariaService';
import PDFPreview from '../components/calendario/PDFPreview';
import { toast } from 'sonner';
import { Save, ArrowLeft, FileText, CheckCircle, BookOpen, Eye, AlertTriangle, CalendarX } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { Separator } from '../components/ui/separator';
import { formatarData } from '../utils/dateHelpers';

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
  const [gradeMap, setGradeMap] = useState({});
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
    carregarGrade();
  }, [id]);

  const carregarGrade = async () => {
    try {
      const response = await gradeHorariaService.getGrade();
      const map = {};
      if (response.data) {
        response.data.forEach(item => {
          map[`${item.turma}-${item.disciplina}`] = item.dias;
        });
      }
      setGradeMap(map);
    } catch (error) {
      console.error('Erro ao carregar grade:', error);
    }
  };

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
      toast.error('Erro ao carregar calendário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
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
        toast.success('Calendário atualizado!', {
          description: 'Suas alterações foram salvas'
        });
      } else {
        await calendarioService.criar(formData);
        toast.success('Calendário criado!', {
          description: 'Seu calendário foi criado com sucesso'
        });
      }
      navigate('/professor/dashboard');
    } catch (error) {
      toast.error(id ? 'Erro ao atualizar' : 'Erro ao criar', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const checkDiaAula = (dataStr) => {
    if (!dataStr || !formData.turma || !formData.disciplina) return true;
    
    const key = `${formData.turma}-${formData.disciplina}`;
    const diasPermitidos = gradeMap[key];
    
    if (!diasPermitidos || diasPermitidos.length === 0) return true; // Ignora se não tiver grade configurada

    // Ajuste de fuso horário simples para pegar o dia correto
    const date = new Date(dataStr);
    // getDay() usa hora local do browser. O input type=date retorna YYYY-MM-DD.
    // new Date('2023-10-27') retorna UTC 00:00. Se browser for -3, vira dia anterior.
    // Melhor usar:
    const [y, m, d] = dataStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d); // Mês é 0-indexado
    const diaSemana = dateObj.getDay(); // 0=Dom, 1=Seg...
    
    return diasPermitidos.includes(diaSemana);
  };

  const WarningDiaInvalido = () => (
    <div className="flex items-center gap-1 text-amber-600 text-xs mt-1.5 font-medium animate-in slide-in-from-top-1">
      <CalendarX className="h-3.5 w-3.5" />
      <span>Dia sem aula nesta turma (verifique sua grade)</span>
    </div>
  );

  if (loading && id) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/professor/dashboard')}
            className="self-start"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {id ? 'Editar Calendário' : 'Novo Calendário'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {id ? 'Atualize as informações do calendário' : 'Preencha os dados e veja o preview'}
            </p>
          </div>
        </div>

        {/* Layout responsivo com 1 ou 2 colunas */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Coluna Esquerda - Formulário */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold">Informações Básicas</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma *</Label>
                    <Input
                      id="turma"
                      value={formData.turma}
                      onChange={(e) => handleChange('turma', e.target.value)}
                      placeholder="Ex: 9º Ano A"
                      required
                      className={!checkDiaAula(formData.av1.data) ? "border-amber-500 focus-visible:ring-amber-500" : ""}
                    />
                    {!checkDiaAula(formData.av1.data) && <WarningDiaInvalido />}
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
                    <Select value={String(formData.bimestre)} onValueChange={(value) => handleChange('bimestre', parseInt(value))}>
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
              </div>

              <Separator />

              {/* AV1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-semibold">AV1 - Primeira Avaliação</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="av1Data">Data *</Label>
                    <Input
                      id="av1Data"
                      type="date"
                      value={formData.av1.data}
                      onChange={(e) => handleNestedChange('av1', 'data', e.target.value)}
                      required
                      className={!checkDiaAula(formData.av1.data) ? "border-amber-500 focus-visible:ring-amber-500" : ""}
                    />
                    {!checkDiaAula(formData.av1.data) && <WarningDiaInvalido />}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="av1Instrumento">Instrumento *</Label>
                    <Select value={formData.av1.instrumento} onValueChange={(value) => handleNestedChange('av1', 'instrumento', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTOS.map(inst => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="av1Conteudo">Conteúdo *</Label>
                  <Textarea
                    id="av1Conteudo"
                    value={formData.av1.conteudo}
                    onChange={(e) => handleNestedChange('av1', 'conteudo', e.target.value)}
                    placeholder="Descreva o conteúdo"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="av1Criterios">Critérios *</Label>
                  <Textarea
                    id="av1Criterios"
                    value={formData.av1.criterios}
                    onChange={(e) => handleNestedChange('av1', 'criterios', e.target.value)}
                    placeholder="Critérios de avaliação"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* AV2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg sm:text-xl font-semibold">AV2 - Segunda Avaliação</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="av2Data">Data *</Label>
                    <Input
                      id="av2Data"
                      type="date"
                      value={formData.av2.data}
                      onChange={(e) => handleNestedChange('av2', 'data', e.target.value)}
                      required
                      className={!checkDiaAula(formData.av2.data) ? "border-amber-500 focus-visible:ring-amber-500" : ""}
                    />
                    {!checkDiaAula(formData.av2.data) && <WarningDiaInvalido />}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="av2Instrumento">Instrumento *</Label>
                    <Select value={formData.av2.instrumento} onValueChange={(value) => handleNestedChange('av2', 'instrumento', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTOS.map(inst => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="av2Conteudo">Conteúdo *</Label>
                  <Textarea
                    id="av2Conteudo"
                    value={formData.av2.conteudo}
                    onChange={(e) => handleNestedChange('av2', 'conteudo', e.target.value)}
                    placeholder="Descreva o conteúdo"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="av2Criterios">Critérios *</Label>
                  <Textarea
                    id="av2Criterios"
                    value={formData.av2.criterios}
                    onChange={(e) => handleNestedChange('av2', 'criterios', e.target.value)}
                    placeholder="Critérios de avaliação"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Consolidação */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg sm:text-xl font-semibold">Consolidação</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consolidacaoData">Data *</Label>
                  <Input
                    id="consolidacaoData"
                    type="date"
                    value={formData.consolidacao.data}
                    onChange={(e) => handleNestedChange('consolidacao', 'data', e.target.value)}
                    required
                    className={!checkDiaAula(formData.consolidacao.data) ? "border-amber-500 focus-visible:ring-amber-500 max-w-xs" : "max-w-xs"}
                  />
                  {!checkDiaAula(formData.consolidacao.data) && <WarningDiaInvalido />}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consolidacaoConteudo">Conteúdo *</Label>
                  <Textarea
                    id="consolidacaoConteudo"
                    value={formData.consolidacao.conteudo}
                    onChange={(e) => handleNestedChange('consolidacao', 'conteudo', e.target.value)}
                    placeholder="Processo de consolidação"
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
                    placeholder="Critérios de consolidação"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Actions - Sticky em mobile também */}
              <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
                <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {id ? 'Atualizar' : 'Criar Calendário'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/professor/dashboard')}
                  disabled={loading}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

          {/* Coluna Direita - Preview (oculto em mobile) */}
          <div className="hidden lg:block lg:sticky lg:top-4 h-fit">
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <h3 className="font-semibold">Preview</h3>
              </div>

              <Separator />

              {/* Preview Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-bold">
                    {formData.turma || 'Turma'}
                  </h3>
                  <Badge variant="outline">
                    {formData.bimestre}º Bim
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {formData.disciplina || 'Disciplina'}
                </p>
                <p className="text-sm text-muted-foreground">Ano: {formData.ano}</p>
              </div>

              <Separator />

              {/* Preview AV1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <h4 className="font-semibold text-sm">AV1</h4>
                </div>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {formData.av1.data ? formatarData(formData.av1.data) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instrumento:</span>
                    <span className="font-medium">{formData.av1.instrumento}</span>
                  </div>
                  {formData.av1.conteudo && (
                    <div>
                      <span className="text-muted-foreground">Conteúdo:</span>
                      <p className="text-xs mt-1 line-clamp-2">{formData.av1.conteudo}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preview AV2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-600" />
                  <h4 className="font-semibold text-sm">AV2</h4>
                </div>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {formData.av2.data ? formatarData(formData.av2.data) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instrumento:</span>
                    <span className="font-medium">{formData.av2.instrumento}</span>
                  </div>
                  {formData.av2.conteudo && (
                    <div>
                      <span className="text-muted-foreground">Conteúdo:</span>
                      <p className="text-xs mt-1 line-clamp-2">{formData.av2.conteudo}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preview Consolidação */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                  <h4 className="font-semibold text-sm">Consolidação</h4>
                </div>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {formData.consolidacao.data ? formatarData(formData.consolidacao.data) : '-'}
                    </span>
                  </div>
                  {formData.consolidacao.conteudo && (
                    <div>
                      <span className="text-muted-foreground">Conteúdo:</span>
                      <p className="text-xs mt-1 line-clamp-2">{formData.consolidacao.conteudo}</p>
                    </div>
                  )}
                </div>
              </div>

              {formData.observacoes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Observações</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {formData.observacoes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarioFormPage;