import dayjs from 'dayjs';

export const formatTime = (time?: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(time ?? new Date()).format(format);
};
