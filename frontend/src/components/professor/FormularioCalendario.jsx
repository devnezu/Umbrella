import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import calendarioService from '../../services/calendarioService';
import { toast } from 'sonner';
import { ArrowLeft, Save, Send } from 'lucide-react';

const TURMAS = [
  '6ºA', '6ºB', '6ºC', '6ºD',
  '7ºA', '7ºB', '7ºC',
  '8ºA', '8ºB', '8ºC', '8ºD',
  '9ºA', '9ºB', '9ºC', '9ºD',
  '1ºEM-A', '1ºEM-B', '2ºEM-A', '2ºEM-B', '3ºEM-A', '3ºEM-B'
];

const INSTRUMENTOS = [
  'Prova Impressa',
  'Atividade',
  'Lista de Exercícios',
  'Trabalho',
  'Apresentação'
];

const FormularioCalendario = ({ calendario, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turma: '',
    disciplina: user?.disciplinas?.[0] || '',
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
    if (calendario) {
      setFormData({
        turma: calendario.turma,
        disciplina: calendario.disciplina,
        bimestre: calendario.bimestre,
        ano: calendario.ano,
        av1: {
          data: calendario.av1.data?.split('T')[0] || '',
          instrumento: calendario.av1.instrumento,
          conteudo: calendario.av1.conteudo,
          criterios: calendario.av1.criterios
        },
        av2: {
          data: calendario.av2.data?.split('T')[0] || '',
          instrumento: calendario.av2.instrumento,
          conteudo: calendario.av2.conteudo,
          criterios: calendario.av2.criterios
        },
        consolidacao: {
          data: calendario.consolidacao.data?.split('T')[0] || '',
          conteudo: calendario.consolidacao.conteudo,
          criterios: calendario.consolidacao.criterios
        },
        observacoes: calendario.observacoes || ''
      });
    }
  }, [calendario]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSalvar = async (enviar = false) => {
    try {
      setLoading(true);

      if (calendario) {
        await calendarioService.atualizar(calendario._id, formData);
        if (enviar) {
          await calendarioService.enviar(calendario._id);
          toast.success('Calendário atualizado e enviado com sucesso!');
        } else {
          toast.success('Calendário atualizado com sucesso!');
        }
      } else {
        const created = await calendarioService.criar(formData);
        if (enviar) {
          await calendarioService.enviar(created._id);
          toast.success('Calendário criado e enviado com sucesso!');
        } else {
          toast.success('Calendário criado como rascunho!');
        }
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(error.response?.data?.mensagem || 'Erro ao salvar calendário');
    } finally {
      setLoading(false);
    }
  };

  const isViewOnly = calendario && calendario.status !== 'rascunho';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle>
              {calendario ? (isViewOnly ? 'Visualizar Calendário' : 'Editar Calendário') : 'Novo Calendário'}
            </CardTitle>
            <CardDescription>
              Preencha todas as informações do calendário avaliativo
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="turma">Turma</Label>
            <select
              id="turma"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.turma}
              onChange={(e) => handleChange('turma', e.target.value)}
              disabled={loading || isViewOnly}
              required
            >
              <option value="">Selecione...</option>
              {user?.turmas?.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="disciplina">Disciplina</Label>
            <select
              id="disciplina"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.disciplina}
              onChange={(e) => handleChange('disciplina', e.target.value)}
              disabled={loading || isViewOnly}
              required
            >
              <option value="">Selecione...</option>
              {user?.disciplinas?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="bimestre">Bimestre</Label>
            <select
              id="bimestre"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.bimestre}
              onChange={(e) => handleChange('bimestre', parseInt(e.target.value))}
              disabled={loading || isViewOnly}
              required
            >
              <option value={1}>1º Bimestre</option>
              <option value={2}>2º Bimestre</option>
              <option value={3}>3º Bimestre</option>
              <option value={4}>4º Bimestre</option>
            </select>
          </div>

          <div>
            <Label htmlFor="ano">Ano</Label>
            <Input
              id="ano"
              type="number"
              value={formData.ano}
              onChange={(e) => handleChange('ano', parseInt(e.target.value))}
              disabled={loading || isViewOnly}
              required
            />
          </div>
        </div>

        {/* AV1 */}
        <div className="border rounded-lg p-4 bg-primary-50">
          <h3 className="text-lg font-semibold mb-4 text-primary">AV1 - Primeira Etapa</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="av1-data">Data</Label>
                <Input
                  id="av1-data"
                  type="date"
                  value={formData.av1.data}
                  onChange={(e) => handleChange('av1.data', e.target.value)}
                  disabled={loading || isViewOnly}
                  required
                />
              </div>

              <div>
                <Label htmlFor="av1-instrumento">Instrumento Avaliativo</Label>
                <select
                  id="av1-instrumento"
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                  value={formData.av1.instrumento}
                  onChange={(e) => handleChange('av1.instrumento', e.target.value)}
                  disabled={loading || isViewOnly}
                  required
                >
                  {INSTRUMENTOS.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="av1-conteudo">Conteúdo/Habilidades</Label>
              <Textarea
                id="av1-conteudo"
                placeholder="Ex: Substantivos, adjetivos e verbos. Leitura e interpretação de textos narrativos."
                value={formData.av1.conteudo}
                onChange={(e) => handleChange('av1.conteudo', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="av1-criterios">Critérios de Avaliação</Label>
              <Textarea
                id="av1-criterios"
                placeholder="Ex: Compreensão dos conceitos (40%), interpretação de texto (40%), ortografia (20%)"
                value={formData.av1.criterios}
                onChange={(e) => handleChange('av1.criterios', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* AV2 */}
        <div className="border rounded-lg p-4 bg-secondary-50">
          <h3 className="text-lg font-semibold mb-4 text-secondary-700">AV2 - Segunda Etapa</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="av2-data">Data</Label>
                <Input
                  id="av2-data"
                  type="date"
                  value={formData.av2.data}
                  onChange={(e) => handleChange('av2.data', e.target.value)}
                  disabled={loading || isViewOnly}
                  required
                />
              </div>

              <div>
                <Label htmlFor="av2-instrumento">Instrumento Avaliativo</Label>
                <select
                  id="av2-instrumento"
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                  value={formData.av2.instrumento}
                  onChange={(e) => handleChange('av2.instrumento', e.target.value)}
                  disabled={loading || isViewOnly}
                  required
                >
                  {INSTRUMENTOS.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="av2-conteudo">Conteúdo/Habilidades</Label>
              <Textarea
                id="av2-conteudo"
                placeholder="Descreva o conteúdo da segunda avaliação..."
                value={formData.av2.conteudo}
                onChange={(e) => handleChange('av2.conteudo', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="av2-criterios">Critérios de Avaliação</Label>
              <Textarea
                id="av2-criterios"
                placeholder="Descreva os critérios de avaliação..."
                value={formData.av2.criterios}
                onChange={(e) => handleChange('av2.criterios', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Consolidação */}
        <div className="border rounded-lg p-4 bg-success-50">
          <h3 className="text-lg font-semibold mb-4 text-success-700">
            Consolidação da Aprendizagem - Recuperação
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cons-data">Data</Label>
              <Input
                id="cons-data"
                type="date"
                value={formData.consolidacao.data}
                onChange={(e) => handleChange('consolidacao.data', e.target.value)}
                disabled={loading || isViewOnly}
                required
                className="max-w-xs"
              />
            </div>

            <div>
              <Label htmlFor="cons-conteudo">Conteúdo/Habilidades</Label>
              <Textarea
                id="cons-conteudo"
                placeholder="Descreva o conteúdo da consolidação..."
                value={formData.consolidacao.conteudo}
                onChange={(e) => handleChange('consolidacao.conteudo', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="cons-criterios">Critérios de Avaliação</Label>
              <Textarea
                id="cons-criterios"
                placeholder="Descreva os critérios de avaliação..."
                value={formData.consolidacao.criterios}
                onChange={(e) => handleChange('consolidacao.criterios', e.target.value)}
                disabled={loading || isViewOnly}
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="observacoes">Observações (opcional)</Label>
          <Textarea
            id="observacoes"
            placeholder="Observações adicionais..."
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            disabled={loading || isViewOnly}
            rows={2}
          />
        </div>

        {/* Botões */}
        {!isViewOnly && (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSalvar(false)}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>

            <Button
              onClick={() => handleSalvar(true)}
              disabled={loading}
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar para Coordenação'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormularioCalendario;
