import { Wedstrijd } from './types';

const parseMatchDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
};

const getWeekStartAndEnd = (referenceDate = new Date()): { start: Date; end: Date } => {
  const start = new Date(referenceDate);
  const end = new Date(referenceDate);

  const dayOfWeek = referenceDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(referenceDate.getDate() - daysToMonday);
  start.setHours(0, 0, 0, 0);

  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Filters wedstrijden to only include matches from the current week (Monday to Sunday)
 */
export const filterWedstrijdenThisWeek = (wedstrijden: Wedstrijd[]): Wedstrijd[] => {
  const { start, end } = getWeekStartAndEnd();
  
  return wedstrijden.filter(wedstrijd => {
    const matchDate = parseMatchDate(wedstrijd.datum);
    return matchDate >= start && matchDate <= end;
  });
};

/**
 * Filters wedstrijden to only include matches starting from today onwards
 */
export const filterWedstrijdenUpcoming = (wedstrijden: Wedstrijd[]): Wedstrijd[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return wedstrijden.filter(wedstrijd => {
    const matchDate = parseMatchDate(wedstrijd.datum);
    return matchDate >= today;
  });
};

/**
 * Gets the start and end dates of the current week
 */
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  return getWeekStartAndEnd();
};

// English aliases for readability in newer code.
export const filterMatchesThisWeek = filterWedstrijdenThisWeek;
export const filterUpcomingMatches = filterWedstrijdenUpcoming;