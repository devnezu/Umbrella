import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data) => {
  if (!data) return '';
  try {
    const date = typeof data === 'string' ? parseISO(data) : data;
    if (!isValid(date)) return '';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return '';
  }
};

export const formatarDataISO = (data) => {
  if (!data) return '';
  try {
    const date = typeof data === 'string' ? parseISO(data) : data;
    if (!isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

export const formatarDataHora = (data) => {
  if (!data) return '';
  try {
    const date = typeof data === 'string' ? parseISO(data) : data;
    if (!isValid(date)) return '';
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    return '';
  }
};
