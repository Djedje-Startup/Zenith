// utils/dateHelpers.ts
import { format, parse, isValid, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formatage
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr, { locale: fr });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}h${minutes}`;
};

export const formatTimeRange = (start: string, end: string): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Jour de la semaine
export const getDayName = (date: string | Date, short: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, short ? 'EEE' : 'EEEE', { locale: fr });
};

export const getDayNumber = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDate();
};

// Mois
export const getMonthName = (month: number, short: boolean = false): string => {
  const date = new Date(2024, month, 1);
  return format(date, short ? 'MMM' : 'MMMM', { locale: fr });
};

export const getMonthYear = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: fr });
};

// Vérifications
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

export const isPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

export const isFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};

// Calculs
export const getDaysDifference = (start: string | Date, end: string | Date): number => {
  const startObj = typeof start === 'string' ? new Date(start) : start;
  const endObj = typeof end === 'string' ? new Date(end) : end;
  return differenceInDays(endObj, startObj);
};

// Année scolaire
export const getCurrentAcademicYear = (): { start: number; end: number } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Année scolaire commence en septembre (mois 8)
  if (month >= 8) {
    return { start: year, end: year + 1 };
  }
  return { start: year - 1, end: year };
};

// Durée
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}`;
};