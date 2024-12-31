import { getDailyChallenge } from "@/data/db";
import { DailyChallenge } from "@/data/definitions";
import Game from "@/ui/Game";
import { Suspense } from "react";

export default async function Page() {
  let dailyChallange: DailyChallenge = await getDailyChallenge("todo");

  return (
    <main>
      <Suspense>
        <Game dailyChallenge={dailyChallange} />
      </Suspense>
    </main>
  );
}
