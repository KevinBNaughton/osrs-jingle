import geojsondata, { GeoJSONFeature } from "../data/GeoJSON";
import { toOurPixelCoordinates } from "@/utils/coordinate-utils";
import { decodeHTML } from "@/utils/string-utils";
import { songNamesArray } from "@/data/definitions";

function isFeatureVisibleOnMap(feature: GeoJSONFeature) {
  return feature.geometry.coordinates.some((polygon: number[][]) =>
    polygon.every((point: number[]) => {
      const [, y] = toOurPixelCoordinates(point);
      return y > 0;
    }),
  );
}

export function getRandomSong(
  playedSongs: Set<string> = new Set([]),
  playedSongsOrder: string[] = [],
): string {
  const visibleFeatures = geojsondata.features.filter(isFeatureVisibleOnMap);
  while (true) {
    const randomFeature: GeoJSONFeature = visibleFeatures.sort(
      () => Math.random() - Math.random(),
    )[0];
    let match = randomFeature.properties.title.match(/>(.*?)</);
    if (match) {
      const randomSongName = decodeHTML(match[1]);
      if (playedSongs.has(randomSongName)) {
        continue;
      }
      updatePlayedSongs(randomSongName, playedSongs, playedSongsOrder);
      return decodeHTML(match[1]);
    }
    console.error(
      "Feature: ",
      randomFeature.properties.title,
      " in GeoJSON misconfigured!",
    );
    break;
  }
  console.warn("Using backup songNamesArray...");
  const randomSongName =
    songNamesArray[Math.floor(Math.random() * songNamesArray.length)];
  updatePlayedSongs(randomSongName, playedSongs, playedSongsOrder);
  return randomSongName;
}

function updatePlayedSongs(
  newSongName: string,
  playedSongs: Set<string>,
  playedSongsOrder: string[],
): void {
  playedSongsOrder.push(newSongName);
  // If limit is reached, remove the oldest song
  if (playedSongsOrder.length > 100) {
    // Change val based on how many songs should be shown without dupes
    const oldestSong: string | undefined = playedSongsOrder.shift();
    if (oldestSong) {
      playedSongs.delete(oldestSong);
    }
  }
  playedSongs.add(newSongName);
}
