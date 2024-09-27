export const calculateDaysBetween = (start: Date, end: Date): number => {
  const startDate = toClearDate(start);
  const endDate = toClearDate(end || new Date());
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export const toClearDate = (date: string | Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}