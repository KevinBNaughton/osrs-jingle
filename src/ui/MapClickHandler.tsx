"use client";

import { booleanPointInPolygon, polygon } from "@turf/turf";
import {
  Icon,
  LatLng,
  LatLngExpression,
  Map,
  PanOptions,
  PointExpression,
} from "leaflet";
import markerIconPng from "../../public/marker-icon.png";
import React, { Dispatch, SetStateAction, useState } from "react";
import { GeoJSON, Marker, useMapEvents } from "react-leaflet";
import geojsondata, { GeoJSONFeature } from "@/data/GeoJSON";
import {
  getDailyChallengePercentileAndIncrement,
  incrementSongCount,
} from "@/data/db";
import { calculateTimeDifference } from "@/utils/time";
import {
  calculateDistance,
  closePolygon,
  getCenterOfPolygon,
  getDistanceToPolygon,
} from "@/utils/clickHandler-utils";
import { featureMatchesSong } from "@/utils/geojson-utils";
import { toOurPixelCoordinates } from "@/utils/coordinate-utils";
import { formatDateToString, getCurrentUTCDate } from "@/utils/date";

export default function MapClickHandler({
  correctPolygonAction,
  correctPolygon,
  currentSong,
  guessResultAction,
  resultVisible,
  resultVisibleAction,
  resultsArray,
  resultsArrayAction,
  dailyChallengeIndex,
  dailyCompleteAction,
  startedGame,
  currentSongUiAction,
  percentileAction,
  startTime,
  timeTakenAction,
}: {
  correctPolygonAction: Dispatch<SetStateAction<GeoJSONFeature | null>>;
  correctPolygon: GeoJSONFeature | null;
  currentSong: string;
  guessResultAction: Dispatch<SetStateAction<number>>;
  resultVisible: boolean;
  resultVisibleAction: Dispatch<SetStateAction<boolean>>;
  resultsArrayAction: Dispatch<SetStateAction<number[]>>;
  resultsArray: number[];
  dailyChallengeIndex: number;
  dailyCompleteAction: Dispatch<SetStateAction<boolean>>;
  startedGame: boolean;
  currentSongUiAction: Dispatch<SetStateAction<string>>;
  percentileAction: Dispatch<SetStateAction<number>>;
  startTime: Date;
  timeTakenAction: Dispatch<SetStateAction<number>>;
}) {
  const [position, setPosition] = useState<LatLng | null>(null);
  let zoom = 0;
  let pan_options: PanOptions;
  let geojsonFeature: GeoJSONFeature;
  let center;
  const userGuessed = (
    geojsonFeature: GeoJSONFeature,
    center: LatLngExpression,
    resultVisibleAction: Dispatch<SetStateAction<boolean>>,
    correctPolygonAction: Dispatch<SetStateAction<GeoJSONFeature | null>>,
    map: Map,
  ) => {
    resultVisibleAction(true);
    correctPolygonAction(geojsonFeature);
    map.panTo(center, pan_options);
    currentSongUiAction(currentSong);
  };

  const calculatePoints = (distance: number) =>
    (1000 * 1) / Math.exp(0.0018 * distance);

  const map = useMapEvents({
    click: async (e) => {
      if (resultVisible || !startedGame) {
        return;
      }
      setPosition(e.latlng);

      zoom = map.getMaxZoom();
      const { x, y } = map.project(e.latlng, zoom);
      const ourPixelCoordsClickedPoint = [x, y];

      const clickedFeatures = geojsondata.features.filter(
        (feature: GeoJSONFeature) =>
          feature.geometry.coordinates.some((poly: number[][]) => {
            const transformedPoly = polygon([
              closePolygon(poly.map(toOurPixelCoordinates)),
            ]);
            return booleanPointInPolygon(
              ourPixelCoordsClickedPoint,
              transformedPoly,
            );
          }),
      );
      console.debug("Looking for song: ", currentSong);
      const correctFeature = geojsondata.features.find(
        featureMatchesSong(currentSong),
      );
      if (!correctFeature) {
        throw new Error("correctFeature not found");
      }
      const correctClickedFeature = clickedFeatures.find(
        featureMatchesSong(currentSong),
      );
      const resultsArrayTemp = resultsArray;

      if (correctClickedFeature) {
        guessResultAction(1000);
        resultsArrayTemp[dailyChallengeIndex] = 1000;
        resultsArrayAction(resultsArrayTemp);
        incrementSongCount(currentSong, true);
        resultVisibleAction(true);
        localStorage.setItem("dailyResults", JSON.stringify(resultsArray));
      } else {
        incrementSongCount(currentSong, false);
        const distanceToPolygon = Math.min(
          ...correctFeature.geometry.coordinates.map((polygon) =>
            getDistanceToPolygon(
              ourPixelCoordsClickedPoint,
              polygon.map(toOurPixelCoordinates),
            ),
          ),
        );
        const points = Math.round(calculatePoints(distanceToPolygon));
        guessResultAction(points);
        resultsArrayTemp[dailyChallengeIndex] = points;
        resultsArrayAction(resultsArrayTemp);
        localStorage.setItem("dailyResults", JSON.stringify(resultsArray));
      }
      if (resultsArray.length > 4) {
        timeTakenAction(calculateTimeDifference(startTime, new Date()));
        setTimeout(() => dailyCompleteAction(true), 1500);
        const utc_today: string = formatDateToString(getCurrentUTCDate());
        if (
          localStorage?.dailyComplete === undefined ||
          localStorage?.dailyComplete !== utc_today
        ) {
          localStorage.setItem("dailyComplete", utc_today);
          localStorage.setItem(
            "dailyTimeTaken",
            calculateTimeDifference(startTime, new Date()).toString(),
          );
          const dailyResultTotal = resultsArray.reduce(
            (total, result) => total + result,
            0,
          );
          const percentile = await getDailyChallengePercentileAndIncrement(
            dailyResultTotal ?? 0,
          );
          percentileAction(percentile);
        }
      } else {
        dailyCompleteAction(false);
      }
      // Create a GeoJSON feature for the nearest correct polygon
      const correctPolygon = correctFeature.geometry.coordinates.sort(
        (polygon1, polygon2) => {
          const c1 = getCenterOfPolygon(polygon1.map(toOurPixelCoordinates));
          const c2 = getCenterOfPolygon(polygon2.map(toOurPixelCoordinates));
          const d1 = calculateDistance(ourPixelCoordsClickedPoint, c1);
          const d2 = calculateDistance(ourPixelCoordsClickedPoint, c2);
          return d1 - d2;
        },
      )[0];
      const convertedCoordinates = correctPolygon // 1. their pixel coords
        .map(toOurPixelCoordinates) // 2. our pixel coords
        .map((coordinate) => map.unproject(coordinate as PointExpression, zoom)) // 3. leaflet { latlng }
        .map(({ lat, lng }) => [lng, lat]); // 4. leaflet [ latlng ]
      const geo_properties = {
        mapID: "",
        title: "",
        description: "",
        plane: 0,
      };
      geojsonFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [convertedCoordinates],
        },
        properties: geo_properties,
      };

      center = map.unproject(
        getCenterOfPolygon(
          correctPolygon // 1. their pixel coords
            .map(toOurPixelCoordinates), // 2. our pixel coords
        ) as PointExpression,
        zoom,
      );
      userGuessed(
        geojsonFeature,
        center,
        resultVisibleAction,
        correctPolygonAction,
        map,
      );
    },
  });

  return (
    <>
      {position && (
        <Marker
          position={position}
          icon={
            new Icon({
              iconUrl: markerIconPng.src,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        />
      )}
      {correctPolygon && (
        <GeoJSON
          data={correctPolygon}
          style={() => ({
            color: "#0d6efd", // Outline color
            fillColor: "#0d6efd", // Fill color
            weight: 5, // Outline thickness
            fillOpacity: 0.5, // Opacity of fill
            opacity: correctPolygon == null ? 0 : 1, // Opacity of outline
            transition: "all 2000ms",
          })}
        />
      )}
    </>
  );
}
