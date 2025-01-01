import { JINGLE_START_DATE } from "@/data/definitions";

export default function getJingleNumber(date: Date): number {
  // milliseconds in a day: 24 * 60 * 60 * 1000
  const oneDay = 86400000;
  return Math.round((date.getTime() - JINGLE_START_DATE.getTime()) / oneDay);
}
