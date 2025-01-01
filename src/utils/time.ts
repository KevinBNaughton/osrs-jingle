// Returns Time differnce in milliseconds.
export function calculateTimeDifference(
  startTime: Date,
  endTime: Date,
): number {
  const differenceInMilliseconds = Math.floor(
    endTime.valueOf() - startTime.valueOf(),
  );
  return differenceInMilliseconds;
}

export function formatMilliseconds(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
}
