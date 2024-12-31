"use client";

import { CRS, latLng, LatLngBounds, LeafletEvent, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { GeoJSONFeature } from "@/data/GeoJSON";
import MapClickHandler from "@/ui/MapClickHandler";
import React from "react";
import handleMapMoveEnd from "@/utils/handleMapMoveEnd";
import dynamic from "next/dynamic";

export default function RunescapeMap({
  correctPolygonAction,
  correctPolygon,
  currentSong,
  guessResultAction,
  resultVisibleAction,
  resultVisible,
  resultsArrayAction,
  resultsArray,
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
  resultVisibleAction: Dispatch<SetStateAction<boolean>>;
  resultVisible: boolean;
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
  const outerBounds = new LatLngBounds(latLng(-78, 0), latLng(0, 136.696));
  const [map, setMap] = useState<Map | null>(null);
  const time = useMemo(() => new Date().getTime(), []);

  useEffect(() => {
    if (map) {
      map.addEventListener("moveend", (_event: LeafletEvent) => {
        handleMapMoveEnd(map, outerBounds);
      });
    }
    return () => {
      if (map) {
        map.removeEventListener("moveend", (_event: LeafletEvent) => {
          handleMapMoveEnd(map, outerBounds);
        });
      }
    };
  });

  return (
    <div
      style={
        {
          // display: "flex",
          // justifyContent: "center",
        }
      }
    >
      <MapContainer
        ref={setMap}
        key={time}
        center={[-35, 92.73]}
        zoom={5}
        maxZoom={6}
        minZoom={4}
        style={{
          position: "fixed",
          height: "100vh",
          width: "100%",
        }}
        maxBounds={outerBounds}
        maxBoundsViscosity={1}
        crs={CRS.Simple}
      >
        <MapClickHandler
          correctPolygonAction={correctPolygonAction}
          correctPolygon={correctPolygon}
          currentSong={currentSong}
          guessResultAction={guessResultAction}
          resultVisible={resultVisible}
          resultVisibleAction={resultVisibleAction}
          resultsArray={resultsArray}
          resultsArrayAction={resultsArrayAction}
          dailyChallengeIndex={dailyChallengeIndex}
          dailyCompleteAction={dailyCompleteAction}
          startedGame={startedGame}
          currentSongUiAction={currentSongUiAction}
          percentileAction={percentileAction}
          startTime={startTime}
          timeTakenAction={timeTakenAction}
        />
        <TileLayer attribution="offline" url={`/rsmap-tiles/{z}/{x}/{y}.png`} />
      </MapContainer>
    </div>
  );
}
