export function getCurrentUTCDate() {
  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
