const GMT_PH = 8;

export const getDateTime = (gmtOffset: number = GMT_PH): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
  return new Date(utc + 3600000 * gmtOffset); // Return as Date object
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
