// Returns Time differnce in milliseconds.
export function calculateTimeDifference(
  startTime: Date,
  endTime: Date,
): number {
  const differenceInSeconds = Math.floor(
    (endTime.valueOf() - startTime.valueOf()) / 1000,
  );
  return differenceInSeconds;
  // const hours = Math.floor(differenceInSeconds / 3600);
  // const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  // const seconds = differenceInSeconds % 60;

  // const formattedTime = `${hours > 0 ? hours + ":" : ""}${minutes}:${
  //   seconds < 10 ? "0" : ""
  // }${seconds}`;
  // return formattedTime;
}
