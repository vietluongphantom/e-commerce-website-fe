import { format } from 'date-fns';

export const formatDate = (dateArray) => {
  if (!dateArray) return 'N/A';
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return format(date, 'dd-MM-yyyy HH:mm:ss');
};
