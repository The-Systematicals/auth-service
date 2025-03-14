const GMT_PH = 8;

export const getDateTime = (gmtOffset: number = GMT_PH): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
  return new Date(utc + 3600000 * gmtOffset); // Return as Date object
};

export const getDateTimeAddMinutes = (minutes: number): Date => {
  const now = getDateTime(); // Get current time with GMT offset
  return new Date(now.getTime() + minutes * 60000); // Add minutes
};

export const getDateTimeRemaining = (
  expirationDate: Date,
  gmtOffset: number = GMT_PH,
): { isMinute: boolean; value: number } => {
  const now = getDateTime(gmtOffset); // Get current time with GMT offset
  const diffMs = expirationDate.getTime() - now.getTime(); // Difference in milliseconds

  if (diffMs <= 0) return { isMinute: true, value: 0 }; // Already expired

  const diffSec = Math.ceil(diffMs / 1000);
  const diffMin = Math.ceil(diffMs / 60000);

  return diffMin > 1 ? { isMinute: true, value: diffMin } : { isMinute: false, value: diffSec };
};

export const setDateStandard = (date: string | Date, gmtOffset: number = GMT_PH): string => {
  const d = new Date(date);
  d.setUTCMinutes(d.getUTCMinutes() + gmtOffset * 60); // Adjust to the specified GMT offset

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
