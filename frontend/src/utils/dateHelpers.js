import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data) => {
  if (!data) return '';
  try {
    const date = typeof data === 'string' ? parseISO(data) : data;
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return '';
  }
};

export const formatarDataISO = (data) => {
  if (!data) return '';
  try {
    const date = typeof data === 'string' ? parseISO(data) : data;
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};
