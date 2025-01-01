import { getDailyChallenge } from "@/data/db";
import { DailyChallenge } from "@/data/definitions";
import Game from "@/ui/Game";
import { getCurrentUTCDate } from "@/utils/date";
import { Suspense } from "react";

export default async function Page() {
  let dailyChallange: DailyChallenge =
    await getDailyChallenge(getCurrentUTCDate());

  return (
    <main>
      <Suspense>
        <Game dailyChallenge={dailyChallange} />
      </Suspense>
    </main>
  );
}
