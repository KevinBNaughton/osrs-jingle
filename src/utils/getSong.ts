import geojsondata, { GeoJSONFeature } from "../data/GeoJSON";
import { toOurPixelCoordinates } from "@/utils/coordinate-utils";
import { decodeHTML } from "@/utils/string-utils";
// let playedSongs = new Set();
// let playedSongsOrder: string[] = [];

export function isFeatureVisibleOnMap(feature: GeoJSONFeature) {
  return feature.geometry.coordinates.some((polygon: number[][]) =>
    polygon.every((point: number[]) => {
      const [, y] = toOurPixelCoordinates(point);
      return y > 0;
    }),
  );
}

export function getRandomSong(
  playedSongs: Set<string>,
  playedSongsOrder: string[],
) {
  let randomSongName = "";
  const visibleFeatures = geojsondata.features.filter(isFeatureVisibleOnMap);
  do {
    const randomFeature = visibleFeatures.sort(
      () => Math.random() - Math.random(),
    )[0];
    let match = randomFeature.properties.title.match(/>(.*?)</);
    if (match) {
      randomSongName = decodeHTML(match[1]);
    } else {
      console.error("woah!!!");
    }
  } while (playedSongs.has(randomSongName));
  updatePlayedSongs(randomSongName, playedSongs, playedSongsOrder);
  return randomSongName;
}

export const updatePlayedSongs = (
  newSongName: string,
  playedSongs: Set<string>,
  playedSongsOrder: string[],
) => {
  playedSongsOrder.push(newSongName);

  // If limit is reached, remove the oldest song
  if (playedSongsOrder.length > 100) {
    //change val based on how many songs should be shown without dupes
    const oldestSong: string = playedSongsOrder.shift() || "";
    playedSongs.delete(oldestSong);
  }

  playedSongs.add(newSongName);
};
