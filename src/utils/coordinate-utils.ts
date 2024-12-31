const SCALE_FACTOR: number = 3;
// Ours refers to the pixel coordinates of the map grid we're using
// Theirs refers to the pixel coordinates taken from osrs wiki music info GeoJSON
export function toOurPixelCoordinates(theirs: number[]): number[] {
  return [theirs[0] * SCALE_FACTOR - 3108, -(theirs[1] * SCALE_FACTOR) + 12450];
}
