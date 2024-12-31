import React, { Dispatch, RefObject, SetStateAction } from "react";
import { mediaHostUrl } from "@/data/hostUrl";
import "@/style/uiBox.css";
import { copyResultsToClipboard } from "@/utils/copyResultsToClipboard";
import { getRandomSong } from "@/utils/getSong";
import DailyGuessLabel from "@/ui/DailyGuessLabel";
import { DailyChallenge } from "@/data/definitions";
import { GeoJSONFeature } from "@/data/GeoJSON";

export default function UiBox({
  dailyMode,
  resultsArray,
  dailyComplete,
  dailyChallenge,
  currentSongAction,
  guessResult,
  resultVisibleAction,
  correctPolygonAction,
  dailyChallengeIndex,
  playSong,
  audioRef,
  sourceRef,
  dailyChallengeIndexAction,
  playedSongs,
  playedSongsOrder,
}: {
  dailyMode: boolean;
  resultsArray: number[];
  dailyComplete: boolean;
  dailyChallenge: DailyChallenge;
  currentSongAction: Dispatch<SetStateAction<string>>;
  guessResult: number;
  resultVisibleAction: Dispatch<SetStateAction<boolean>>;
  correctPolygonAction: Dispatch<SetStateAction<GeoJSONFeature | null>>;
  dailyChallengeIndex: number;
  playSong: (songName: string) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  sourceRef: RefObject<HTMLSourceElement | null>;
  dailyChallengeIndexAction: Dispatch<SetStateAction<number>>;
  playedSongs: Set<string>;
  playedSongsOrder: string[];
}) {
  return (
    <div className="below-map">
      {dailyMode && (
        <table
          style={{
            marginBottom: "10px",
            width: "100%",
            pointerEvents: "none",
          }}
        >
          <tbody>
            <tr>
              <td>
                <DailyGuessLabel number={resultsArray[0] || -1} />
              </td>
              <td>
                <DailyGuessLabel number={resultsArray[1] || -1} />
              </td>
              <td>
                <DailyGuessLabel number={resultsArray[2] || -1} />
              </td>
              <td>
                <DailyGuessLabel number={resultsArray[3] || -1} />
              </td>
              <td>
                <DailyGuessLabel number={resultsArray[4] || -1} />
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* guess button */}
      <div
        className="guess-btn-container"
        onClick={() => {
          if (dailyMode) {
            if (dailyComplete) {
              copyResultsToClipboard(resultsArray);
              return;
            } else {
              const newSongName = dailyChallenge.songs[dailyChallengeIndex + 1];
              currentSongAction(newSongName);
              playSong(newSongName);
              dailyChallengeIndexAction(dailyChallengeIndex + 1);
              correctPolygonAction(null);
              resultVisibleAction(false);
            }
          } else {
            const newSongName = getRandomSong(playedSongs, playedSongsOrder);
            currentSongAction(newSongName);
            playSong(newSongName);
            correctPolygonAction(null);
            resultVisibleAction(false);
          }
        }}
      >
        <img src={`${mediaHostUrl}/osrsButtonWide.png`} alt="OSRS Button" />
        <div className="guess-btn">
          {dailyComplete === true
            ? "Copy Results to Clipboard"
            : guessResult === -1
              ? "Place your pin on the map"
              : "Next Song"}
        </div>
      </div>
      <audio controls id="audio" ref={audioRef}>
        <source id="source" ref={sourceRef} type="audio/mpeg"></source>
      </audio>
    </div>
  );
}
