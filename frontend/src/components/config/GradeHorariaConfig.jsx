import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import gradeHorariaService from '../../services/gradeHorariaService';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { CalendarDays, Save } from 'lucide-react';
import { Label } from '../ui/label';

const DAYS = [
  { id: 1, label: 'Seg' },
  { id: 2, label: 'Ter' },
  { id: 3, label: 'Qua' },
  { id: 4, label: 'Qui' },
  { id: 5, label: 'Sex' }
];

const GradeHorariaConfig = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gradeMap, setGradeMap] = useState({});

  useEffect(() => {
    fetchGrade();
  }, []);

  const fetchGrade = async () => {
    try {
      const response = await gradeHorariaService.getGrade();
      // response.data é array de { turma, disciplina, dias: [] }
      const map = {};
      if (response.data) {
        response.data.forEach(item => {
          map[`${item.turma}-${item.disciplina}`] = item.dias;
        });
      }
      setGradeMap(map);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar grade horária');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (turma, disciplina, dayId) => {
    const key = `${turma}-${disciplina}`;
    const currentDays = gradeMap[key] || [];
    
    let newDays;
    if (currentDays.includes(dayId)) {
      newDays = currentDays.filter(d => d !== dayId);
    } else {
      newDays = [...currentDays, dayId];
    }
    
    setGradeMap(prev => ({
      ...prev,
      [key]: newDays
    }));
  };

  const handleSave = async (turma, disciplina) => {
    const key = `${turma}-${disciplina}`;
    const dias = gradeMap[key] || [];
    
    try {
      setSaving(true);
      await gradeHorariaService.updateGrade({
        turma,
        disciplina,
        dias
      });
      toast.success(`Grade de ${turma} salva!`);
    } catch (error) {
      toast.error('Erro ao salvar grade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4"><Spinner /></div>;

  if (!user.turmas || user.turmas.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Você não possui turmas vinculadas ao seu perfil. Entre em contato com a coordenação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Grade Horária</CardTitle>
            <CardDescription>
              Marque os dias da semana em que você leciona em cada turma para ativar a validação de datas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {user.disciplinas?.map(disciplina => (
          <div key={disciplina} className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              {disciplina}
            </h3>
            
            <div className="grid gap-3">
              {user.turmas.map(turma => {
                const key = `${turma}-${disciplina}`;
                const selectedDays = gradeMap[key] || [];
                
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-muted/20 gap-4">
                    <div className="font-medium min-w-[80px]">{turma}</div>
                    
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(day => (
                        <div 
                          key={day.id} 
                          className={`
                            flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer transition-colors
                            ${selectedDays.includes(day.id) 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'bg-background hover:bg-muted text-muted-foreground'}
                          `}
                          onClick={() => handleToggleDay(turma, disciplina, day.id)}
                        >
                          <span className="text-xs font-bold">{day.label}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleSave(turma, disciplina)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {(!user.disciplinas || user.disciplinas.length === 0) && (
           <p className="text-muted-foreground">Nenhuma disciplina vinculada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GradeHorariaConfig;
