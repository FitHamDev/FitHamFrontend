import { Wedstrijd } from './types';

/**
 * Filters wedstrijden to only include matches from the current week (Monday to Sunday)
 */
export const filterWedstrijdenThisWeek = (wedstrijden: Wedstrijd[]): Wedstrijd[] => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const endOfWeek = new Date(now);
  
  // Set to start of week (Monday)
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday is 0, Monday is 1
  startOfWeek.setDate(now.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Set to end of week (Sunday)
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return wedstrijden.filter(wedstrijd => {
    const [day, month, year] = wedstrijd.datum.split("/");
    const matchDate = new Date(`${year}-${month}-${day}`);
    return matchDate >= startOfWeek && matchDate <= endOfWeek;
  });
};

/**
 * Filters wedstrijden to only include matches starting from today onwards
 */
export const filterWedstrijdenUpcoming = (wedstrijden: Wedstrijd[]): Wedstrijd[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return wedstrijden.filter(wedstrijd => {
    const [day, month, year] = wedstrijd.datum.split("/");
    const matchDate = new Date(`${year}-${month}-${day}`);
    return matchDate >= today;
  });
};

/**
 * Gets the start and end dates of the current week
 */
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  // Set to start of week (Monday)
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(now.getDate() - daysToMonday);
  start.setHours(0, 0, 0, 0);
  
  // Set to end of week (Sunday)
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};