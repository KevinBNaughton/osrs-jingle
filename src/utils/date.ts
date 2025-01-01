export function getCurrentUTCDate(): Date {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function formatDateToString(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}
