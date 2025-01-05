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

export const convertToDays = (input) => {
  const unit = input.slice(-1); // Последний символ - единица измерения
  const value = parseInt(input.slice(0, -1)); // Числовая часть
  const date = new Date();

  switch (unit) {
      case 'w': 
        date.setDate(date.getDate() - value * 7);
        break;
      case 'd': 
        date.setDate(date.getDate() - value);
        break;
      case 'y': 
        date.setFullYear(date.getFullYear() - value);
        break;
      case 'm': 
        date.setMonth(date.getMonth() - value);
        break;
      default: throw new Error('Unknown unit');
  }

  return date;
}