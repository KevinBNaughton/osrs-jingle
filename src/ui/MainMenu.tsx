"use client";

import React, { Dispatch, SetStateAction } from "react";
import { FaDiscord, FaDonate, FaGithub } from "react-icons/fa";
import { mediaHostUrl } from "@/data/hostUrl";
import { getStatistics } from "@/data/db";
import "@/style/footer.css";
import "@/style/mainMenu.css";
import getCurrentDateInBritain from "@/utils/getCurrentDateinBritain";
import Countdown from "@/ui/Countdown";
import { DailyChallenge } from "@/data/definitions";

export default function MainMenu({
  dailyCompleteAction,
  resultsArrayAction,
  timeTakenAction,
  startedGameAction,
  startTimeAction,
  currentSongAction,
  currentSong,
  playSongAction,
  dailyChallenge,
  dailyModeAction,
  dailyComplete,
}: {
  dailyCompleteAction: Dispatch<SetStateAction<boolean>>;
  resultsArrayAction: Dispatch<SetStateAction<number[]>>;
  timeTakenAction: Dispatch<SetStateAction<number>>;
  startedGameAction: Dispatch<SetStateAction<boolean>>;
  startTimeAction: Dispatch<SetStateAction<Date>>;
  currentSongAction: Dispatch<SetStateAction<string>>;
  currentSong: string;
  playSongAction: (songName: string) => void;
  dailyChallenge: DailyChallenge;
  dailyModeAction: Dispatch<SetStateAction<boolean>>;
  dailyComplete: boolean;
}) {
  const [guessCount, setGuessCount] = React.useState(0);
  const fetchPost = async () => {
    getStatistics().then((response) => {
      const guesses = response.guesses;
      setGuessCount(guesses);
    });
  };
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchPost();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="main-menu-container">
      <img
        className="main-menu-image"
        src={`${mediaHostUrl}/Jingle.png`}
        alt="Jingle"
      />

      <h1 className="main-menu-text">Jingle</h1>

      {/* Daily Jingle Option */}
      <h1
        className="main-menu-option"
        style={{ left: "17vw", top: "70%" }}
        onClick={() => {
          if (
            global?.localStorage?.dailyComplete === getCurrentDateInBritain()
          ) {
            dailyCompleteAction(true);
            resultsArrayAction(JSON.parse(localStorage.dailyResults));
            timeTakenAction(localStorage.dailyTimeTaken);
          }
          if (dailyComplete) {
            startedGameAction(true);
            return;
          } else {
            startTimeAction(new Date());
            startedGameAction(true);
            currentSongAction(dailyChallenge.songs[0]);
            playSongAction(dailyChallenge.songs[0]);
            dailyModeAction(true);
          }
        }}
      >
        Daily Jingle
        <Countdown />
        <div style={{ fontSize: "40%" }}>
          {dailyChallenge.results.length.toLocaleString()} Completions
        </div>
      </h1>
      <h1
        className="main-menu-option"
        style={{ left: "53vw", top: "70%" }}
        onClick={() => {
          startedGameAction(true);
          playSongAction(currentSong);
        }}
      >
        Unlimited Practice
        <div style={{ fontSize: "40%" }}>∞</div>
      </h1>
      <div className="menu-statistics">
        <div>
          {guessCount.toLocaleString()}
          <div style={{ fontSize: "65%", marginTop: "-7%" }}>
            Global Guesses
          </div>
        </div>
      </div>
      <div className="main-menu-icon-container">
        <a
          className="main-menu-icon"
          href="https://github.com/mahloola/osrs-music"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
        <a className="main-menu-icon" href="https://discord.gg/7sB8fyUS9W">
          <FaDiscord />
        </a>
        <a className="main-menu-icon" href="https://ko-fi.com/mahloola">
          <FaDonate />
        </a>
      </div>
    </div>
  );
}
