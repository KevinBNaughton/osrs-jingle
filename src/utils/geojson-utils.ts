import { GeoJSONFeature } from "@/data/GeoJSON";
import { decodeHTML } from "./string-utils";

export const featureMatchesSong =
  (songName: string) => (feature: GeoJSONFeature) => {
    let match = feature.properties.title.match(/>(.*?)</);
    if (!match) {
      return false;
    }
    const featureSongName = decodeHTML(match[1]);
    return featureSongName === songName;
  };
