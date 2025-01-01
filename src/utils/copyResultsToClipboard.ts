import { formatMilliseconds } from "@/utils/time";

export function copyResultsToClipboard(
  resultsArray: number[],
  time_taken?: number,
  percentile?: number,
) {
  const sum = resultsArray.reduce((acc, result) => acc + result, 0);
  let resultsString = "";
  for (let i = 0; i < resultsArray.length; i++) {
    const result = resultsArray[i] || 0;
    resultsString +=
      result === 0 ? "0 🔴" : result === 1000 ? "1000 🟢" : result + " 🟡";
    if (i !== resultsArray.length - 1) {
      resultsString += "\n";
    }
  }

  if (percentile && time_taken) {
    navigator.clipboard.writeText(
      `I scored ${sum} on today's Jingle challenge! I finished in ${formatMilliseconds(time_taken)} and placed in the top ${percentile}%, can you beat me? https://osrs-jingle.kevinbnaughton.com\n\n` +
        resultsString,
    );
  } else {
    navigator.clipboard.writeText(
      `I scored ${sum} on today's Jingle challenge, can you beat me? https://osrs-jingle.kevinbnaughton.com\n\n` +
        resultsString,
    );
  }
}
