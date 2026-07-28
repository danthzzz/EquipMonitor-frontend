import { format as fnsFormat, differenceInDays as fnsDifferenceInDays, subDays as fnsSubDays, addYears as fnsAddYears, parse as fnsParse, addDays as fnsAddDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date, pattern = 'dd/MM/yy') => {
  if (!date) return '';
  return fnsFormat(new Date(date), pattern, { locale: ptBR });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return fnsFormat(new Date(date), 'dd/MM/yy HH:mm', { locale: ptBR });
};

export const getDifferenceInDays = (dateLeft, dateRight) => {
  return fnsDifferenceInDays(new Date(dateLeft), new Date(dateRight));
};

export const subtractDays = (date, amount) => {
  return fnsSubDays(new Date(date), amount);
};

export const additionDays = (date, amount) => {
  return fnsAddDays(new Date(date), amount);
};

export const additionYears = (date, amount) => {
  return fnsAddYears(new Date(date), amount);
};

export const parseMonthYear = (monthStr) => {
  return fnsParse(monthStr, 'MMM/yy', new Date(), { locale: ptBR });
};
