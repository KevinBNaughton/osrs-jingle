import { useEffect, useState } from "react";
import { getStatistics } from "@/data/db";

export default function GuessCount() {
  const [guessCount, setGuessCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const statistics = await getStatistics();
      setGuessCount(statistics.guesses);
    }, 2000);

    return () => clearInterval(interval);
  }, []); // empty dependency array ensures useEffect runs only once on mount

  return guessCount;
}
