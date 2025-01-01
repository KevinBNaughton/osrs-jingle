export function getCurrentUTCDate(): Date {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function formatDateToString(date: Date): string {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/London",
  });
  const [day, month, year] = dateFormatter.format(date).split("/");
  return `${year}-${month}-${day}`;
}
