import { DailyChallenge } from "@/data/definitions";

export default function getJingleNumber(dailyChallenge: DailyChallenge) {
  const dailyChallengeDate = dailyChallenge.date;
  const currentDate = new Date(dailyChallengeDate);
  // TODO - Change first jingle daily date to an ENV variable for a release date?
  const targetDate = new Date("2024-02-16");
  return (currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24);
}
