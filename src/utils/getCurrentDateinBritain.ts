export default function getCurrentDateInBritain() {
  const now = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/London",
  });
  const formattedDate = dateFormatter.format(now);
  const [day, month, year] = formattedDate.split("/");
  return `${year}-${month}-${day}`;
}
