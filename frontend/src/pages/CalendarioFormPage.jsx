import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import calendarioService from '../services/calendarioService';
import PDFPreview from '../components/calendario/PDFPreview';
import { toast } from 'sonner';
import { Save, ArrowLeft, FileText, CheckCircle, BookOpen, Eye, AlertTriangle } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';

const INSTRUMENTOS = [
  'Prova Impressa',
  'Atividade',
  'Lista de Exercícios',
  'Trabalho',
  'Apresentação',
  'E-Class'
];

// Componente Auxiliar para Label Obrigatória
const RequiredLabel = ({ children }) => (
  <Label className="flex items-center gap-1">
    {children} <span className="text-red-500 font-bold">*</span>
  </Label>
);

const CalendarioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turma: '',
    disciplina: '',
    bimestre: 2,
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
        // CORREÇÃO AQUI: split('T')[0] para pegar a data crua do banco sem conversão de fuso
        av1: {
          ...data.av1,
          data: data.av1.data ? data.av1.data.split('T')[0] : ''
        },
        av2: {
          ...data.av2,
          data: data.av2.data ? data.av2.data.split('T')[0] : ''
        },
        consolidacao: {
          ...data.consolidacao,
          data: data.consolidacao.data ? data.consolidacao.data.split('T')[0] : ''
        }
      });
    } catch (error) {
      toast.error('Erro ao carregar dados');
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
        toast.success('Calendário atualizado com sucesso!');
      } else {
        await calendarioService.criar(formData);
        toast.success('Calendário criado com sucesso!');
      }
      navigate('/professor/dashboard');
    } catch (error) {
      toast.error('Erro ao salvar', {
        description: error.response?.data?.mensagem || 'Verifique os campos obrigatórios'
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

  if (loading && id) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-[1920px] mx-auto animate-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/professor/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {id ? 'Editar Calendário' : 'Novo Calendário'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Preencha os campos obrigatórios marcados com <span className="text-red-500 font-bold">*</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/professor/dashboard')}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Calendário
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Lado Esquerdo: Formulário */}
          <div className="space-y-6 pb-20">
            
            {/* Card Identificação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Identificação da Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <RequiredLabel>Turma</RequiredLabel>
                  <Input 
                    value={formData.turma} 
                    onChange={(e) => handleChange('turma', e.target.value)} 
                    placeholder="Ex: 6ºA" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Disciplina</RequiredLabel>
                  <Input 
                    value={formData.disciplina} 
                    onChange={(e) => handleChange('disciplina', e.target.value)} 
                    placeholder="Ex: Matemática" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Bimestre</RequiredLabel>
                  <Select value={String(formData.bimestre)} onValueChange={(v) => handleChange('bimestre', parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(b => (
                        <SelectItem key={b} value={String(b)}>{b}º Bimestre</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Ano</RequiredLabel>
                  <Input 
                    type="number" 
                    value={formData.ano} 
                    onChange={(e) => handleChange('ano', parseInt(e.target.value))} 
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* AV1 */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AV1 - Primeira Avaliação
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Peso: 10,0</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-6 pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <RequiredLabel>Data da Avaliação</RequiredLabel>
                    <Input 
                      type="date" 
                      value={formData.av1.data} 
                      onChange={(e) => handleNestedChange('av1', 'data', e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel>Instrumento</RequiredLabel>
                    <Select value={formData.av1.instrumento} onValueChange={(v) => handleNestedChange('av1', 'instrumento', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTOS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Fonte de Estudo (Conteúdo)</RequiredLabel>
                  <Textarea 
                    value={formData.av1.conteudo} 
                    onChange={(e) => handleNestedChange('av1', 'conteudo', e.target.value)}
                    placeholder="Ex: Capítulos 1 a 3, páginas 10-45. Tópicos importantes..."
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">Descreva o material de estudo para o aluno.</p>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Critérios de Avaliação</RequiredLabel>
                  <Textarea 
                    value={formData.av1.criterios} 
                    onChange={(e) => handleNestedChange('av1', 'criterios', e.target.value)}
                    placeholder="Ex: Clareza, domínio do conteúdo, normas da ABNT..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* AV2 */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AV2 - Segunda Avaliação
                  </CardTitle>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Peso: 10,0</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-6 pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <RequiredLabel>Data da Avaliação</RequiredLabel>
                    <Input 
                      type="date" 
                      value={formData.av2.data} 
                      onChange={(e) => handleNestedChange('av2', 'data', e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel>Instrumento</RequiredLabel>
                    <Select value={formData.av2.instrumento} onValueChange={(v) => handleNestedChange('av2', 'instrumento', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTOS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Fonte de Estudo (Conteúdo)</RequiredLabel>
                  <Textarea 
                    value={formData.av2.conteudo} 
                    onChange={(e) => handleNestedChange('av2', 'conteudo', e.target.value)}
                    placeholder="Ex: Lista de exercícios do portal, Capítulos 4 e 5..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Critérios de Avaliação</RequiredLabel>
                  <Textarea 
                    value={formData.av2.criterios} 
                    onChange={(e) => handleNestedChange('av2', 'criterios', e.target.value)}
                    placeholder="Ex: Resolução correta, raciocínio lógico..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* REC */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-600 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Recuperação Bimestral
                  </CardTitle>
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700">Peso: 10,0</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-6 pt-6">
                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <span className="font-semibold">Atenção:</span> O texto padrão "PLANO DE ESTUDO E CONSOLIDAÇÃO..." será inserido automaticamente no PDF em vermelho. Preencha apenas se houver conteúdo específico.
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <RequiredLabel>Data da Recuperação</RequiredLabel>
                    <Input 
                      type="date" 
                      value={formData.consolidacao.data} 
                      onChange={(e) => handleNestedChange('consolidacao', 'data', e.target.value)} 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <RequiredLabel>Fonte de Estudo (Conteúdo da REC)</RequiredLabel>
                  <Textarea 
                    value={formData.consolidacao.conteudo} 
                    onChange={(e) => handleNestedChange('consolidacao', 'conteudo', e.target.value)}
                    placeholder="Liste os conteúdos que serão cobrados na prova de recuperação."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Critérios Específicos (Opcional)</Label>
                  <Textarea 
                    value={formData.consolidacao.criterios} 
                    onChange={(e) => handleNestedChange('consolidacao', 'criterios', e.target.value)}
                    placeholder="Se houver critérios específicos além do padrão..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lado Direito: Preview Fixo */}
          <div className="hidden lg:block sticky top-6 space-y-4">
            <div className="bg-card border rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Pré-visualização em Tempo Real</span>
                </div>
                <Badge variant="outline" className="text-xs">PDF</Badge>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-zinc-100 shadow-inner">
                 <div className="p-2 border-b flex justify-center items-center gap-2 bg-zinc-200/50">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Simulação do Resultado Final</span>
                 </div>
                 <div className="overflow-auto max-h-[calc(100vh-200px)] p-4 flex justify-center bg-zinc-500/5">
                   <div className="w-full max-w-[210mm] bg-white shadow-2xl scale-95 origin-top transform transition-transform">
                      <PDFPreview calendario={formData} />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarioFormPage;