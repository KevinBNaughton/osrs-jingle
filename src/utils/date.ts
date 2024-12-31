export function getCurrentUTCDate() {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  console.debug(
    "YY MM DD - ",
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return date;
}
