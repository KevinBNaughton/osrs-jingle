"use client";

import { useRef, useState } from "react";
import Footer from "@/ui/Footer";
import HomeButton from "@/ui/HomeButton";
import ResultScreen from "@/ui/ResultScreen";
import UiBox from "@/ui/UiBox";
import { songHostUrl } from "@/data/hostUrl";
import "@/style/leaflet.css";
import { calculateTimeDifference } from "@/utils/calculateTimeDifference";
import getJingleNumber from "@/utils/getJingleNumber";
import { getRandomSong } from "@/utils/getSong";
import { DailyChallenge } from "@/data/definitions";
import React from "react";
import { GeoJSONFeature } from "@/data/GeoJSON";
import dynamic from "next/dynamic";

const RunescapeMap = dynamic(() => import("@/ui/RunescapeMap"), { ssr: false });
const MainMenu = dynamic(() => import("@/ui/MainMenu"), { ssr: false });
const ResultMessage = dynamic(() => import("@/ui/ResultMessage"), {
  ssr: false,
});

export default function Game({
  dailyChallenge,
}: {
  dailyChallenge: DailyChallenge;
}) {
  let playedSongs: Set<string> = new Set();
  let playedSongsOrder: string[] = [];
  const initialSong = getRandomSong(playedSongs, playedSongsOrder);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);
  const [currentSong, currentSongAction] = useState<string>(initialSong);
  const [currentSongUi, currentSongUiAction] = useState<string>(initialSong);
  const [guessResult, guessResultAction] = useState<number>(-1);
  const [startedGame, startedGameAction] = useState<boolean>(false);
  const [resultVisible, resultVisibleAction] = useState<boolean>(false);
  const [resultsArray, resultsArrayAction] = useState<number[]>([]);
  const [dailyChallengeIndex, dailyChallengeIndexAction] = useState<number>(0);
  const [dailyComplete, dailyCompleteAction] = useState<boolean>(false);
  const [dailyMode, dailyModeAction] = useState<boolean>(false);
  // const [practiceRoundsMode, practiceRoundsModeAction] = useState<boolean>(false);
  const [percentile, percentileAction] = useState<number>(0);
  const [correctPolygon, correctPolygonAction] =
    useState<GeoJSONFeature | null>(null);
  const [timeTaken, timeTakenAction] = useState<number>(0);
  const [startTime, startTimeAction] = useState<Date>(new Date());
  console.debug("in Game: ", dailyChallenge);

  const playSong = (songName: string) => {
    const src = `${songHostUrl}/${songName.trim().replaceAll(" ", "_")}.mp3`;
    if (sourceRef && audioRef && sourceRef.current && audioRef.current) {
      sourceRef.current.src = src;
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {
        <div
          className="ui-box"
          style={{
            display: startedGame ? "block" : "none",
          }}
        >
          <HomeButton />
          <UiBox
            dailyMode={dailyMode}
            resultsArray={resultsArray}
            dailyComplete={dailyComplete}
            dailyChallenge={dailyChallenge}
            currentSongAction={currentSongAction}
            guessResult={guessResult}
            resultVisibleAction={resultVisibleAction}
            correctPolygonAction={correctPolygonAction}
            dailyChallengeIndex={dailyChallengeIndex}
            playSong={playSong}
            audioRef={audioRef}
            sourceRef={sourceRef}
            dailyChallengeIndexAction={dailyChallengeIndexAction}
            playedSongs={playedSongs}
            playedSongsOrder={playedSongsOrder}
          />
          <Footer />
        </div>
      }
      <div
        className={`${!startedGame ? "blur" : ""}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <RunescapeMap
          correctPolygonAction={correctPolygonAction}
          correctPolygon={correctPolygon}
          currentSong={currentSong}
          guessResultAction={guessResultAction}
          resultVisibleAction={resultVisibleAction}
          resultVisible={resultVisible}
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
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          /* marginLeft: "50%", */
        }}
      >
        {!startedGame && (
          <MainMenu
            dailyCompleteAction={dailyCompleteAction}
            resultsArrayAction={resultsArrayAction}
            timeTakenAction={timeTakenAction}
            startedGameAction={startedGameAction}
            startTimeAction={startTimeAction}
            currentSongAction={currentSongAction}
            currentSong={currentSong}
            playSongAction={playSong}
            dailyChallenge={dailyChallenge}
            dailyModeAction={dailyModeAction}
            dailyComplete={dailyComplete}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {dailyComplete && (
          <ResultScreen
            resultsArray={resultsArray}
            percentile={percentile}
            timeTaken={
              timeTaken
                ? timeTaken
                : calculateTimeDifference(startTime, new Date())
            }
            jingleNumber={getJingleNumber(dailyChallenge)}
          />
        )}
        {!dailyComplete && (
          <ResultMessage
            resultVisible={resultVisible}
            guessResult={guessResult}
            currentSongUi={currentSongUi}
          ></ResultMessage>
        )}
      </div>
    </div>
  );
}
