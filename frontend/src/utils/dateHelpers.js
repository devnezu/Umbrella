import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data) => {
  if (!data) return '';
  try {
    // Garante que trabalhamos com string YYYY-MM-DD
    const dateString = typeof data === 'string' ? data : data.toISOString();
    
    // Quebra a string para pegar ano, mês e dia puros
    const [year, month, day] = dateString.split('T')[0].split('-');
    
    // Cria a data usando os componentes locais (Mês no JS começa em 0)
    // Isso força a data a ser exatamente o que está escrito, sem fuso
    const localDate = new Date(year, month - 1, day);
    
    return format(localDate, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return '';
  }
};

export const formatarDataISO = (data) => {
  if (!data) return '';
  try {
    const dateString = typeof data === 'string' ? data : data.toISOString();
    return dateString.split('T')[0];
  } catch {
    return '';
  }
};