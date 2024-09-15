export const calculateDaysBetween = (start: Date, end: Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end || new Date());
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}