import { DailyChallenge, Song, Statistics } from "@/data/definitions";
import geojsondata, { GeoJSONFeature } from "@/data/GeoJSON";
import songs from "@/data/songs.json";
import { PrismaClient, User } from "@prisma/client";
import { isFeatureVisibleOnMap } from "@/utils/getSong";
import { decodeHTML } from "@/utils/string-utils";

// Set in top level .env file
// Likely set to: "http://127.0.0.1:PORT/"
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const songNamesArray = Object.keys(songs);

export const prisma: PrismaClient = new PrismaClient();

if (typeof window === "undefined") {
  // if (!global.prisma) {
  //   global.prisma = new PrismaClient();
  // }
  // prisma = global.prisma;
}

export async function getUser(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return user;
}

function getRandomSong(playedSongs: Set<string> = new Set([])): string {
  let isValidSong = false;
  const visibleFeatures = geojsondata.features.filter(isFeatureVisibleOnMap);
  while (!isValidSong) {
    const randomFeature: GeoJSONFeature = visibleFeatures.sort(
      () => Math.random() - Math.random(),
    )[0];
    let match = randomFeature.properties.title.match(/>(.*?)</);
    if (match) {
      const randomSongName = decodeHTML(match[1]);
      if (playedSongs.has(randomSongName)) {
        continue;
      }
      return decodeHTML(match[1]);
    } else {
      console.error(
        "Feature: ",
        randomFeature.properties.title,
        " in GeoJSON misconfigured!",
      );
    }
  }
  console.warn("Using backup songNamesArray...");
  return songNamesArray[Math.floor(Math.random() * songNamesArray.length)];
}

export async function getSong(_songName: string): Promise<Song> {
  console.warn("TODO - Implement this");
  return {
    name: "Background",
    success_count: 1,
    failure_count: 1,
  };
  // const response = await fetch(`${API_URL}/api/songs/${songName}`);
  // if (response.ok) {
  //   return response.json();
  // } else {
  //   return null; // Handle the error as needed
  // }
}

export async function generateDailyChallenge(_date: Date) {
  console.warn("TODO - Implement this");
  // const response = await fetch(`${API_URL}/api/daily-challenge`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ date }),
  // });
  // if (response.ok) {
  //   console.log(`Daily challenge successfully generated for ${date}`);
  // } else {
  //   console.error("Failed to generate daily challenge");
  // }
}

export async function getDailyChallenge(
  _formattedDate: string,
): Promise<DailyChallenge> {
  console.warn("TODO - Implement this correctly and not randomly");
  let d: DailyChallenge = {
    songs: [],
    date: new Date(),
    results: [],
  };
  for (let i = 0; i < 5; i++) {
    d.songs.push(getRandomSong());
  }
  return d;
  // const response = await fetch(
  //   `${API_URL}/api/daily-challenges/${formattedDate}`,
  // );
  // if (response.ok) {
  //   return response.json();
  // } else {
  //   console.error("Failed to fetch daily challenge");
  //   return null;
  // }
}

export async function getWeekStats() {
  const weekDatesFormatted = [
    "2024-05-27",
    "2024-05-28",
    "2024-05-29",
    "2024-05-30",
    "2024-05-31",
    "2024-06-01",
    "2024-06-02",
  ];
  const weekStats = [];

  for (const date of weekDatesFormatted) {
    const dailyChallenge = await getDailyChallenge(date);
    const results: number[] = dailyChallenge?.results ?? [];
    const average = results.reduce((a, b) => a + b, 0) / results.length;

    const songSuccessRates: Map<string, number> = new Map();
    for (const songName of dailyChallenge.songs) {
      const song = await getSong(songName);
      let rate = 100;
      if (song.success_count && song.failure_count) {
        rate =
          (song.success_count / (song.success_count + song.failure_count)) *
          100;
      } else if (song.failure_count) {
        rate = 0;
      }
      songSuccessRates.set(song.name, rate);
    }

    weekStats.push({
      date: date,
      submissions: dailyChallenge.submissions,
      average: average,
      songSuccessRates,
    });
  }

  return weekStats;
}

export async function getDailyChallengePercentileAndIncrement(
  _result: number,
): Promise<number> {
  console.warn("TODO - Implement this");
  return 1;
  // const response = await fetch(`${API_URL}/api/daily-challenge/result`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ result }),
  // });
  // if (response.ok) {
  //   return response.json(); // Returns the percentile
  // } else {
  //   console.error("Failed to submit and get percentile");
  //   return null;
  // }
}

export async function getStatistics(): Promise<Statistics> {
  const mock_statistics: Statistics = {
    guesses: 1,
  };
  return mock_statistics;
  // const response = await fetch(`${API_URL}/api/statistics`);
  // if (response.ok) {
  //   return response.json();
  // } else {
  //   console.error("Failed to fetch statistics");
  //   return null;
  // }
}

export async function incrementGlobalGuessCounter(): Promise<void> {
  console.warn("TODO - implement a global guess counter");
  // const response = await fetch(`${API_URL}/statistics/increment`, {
  //   method: "POST",
  // });
  // if (response.ok) {
  //   console.log("Global guess counter incremented");
  // } else {
  //   console.error("Failed to increment global guess counter");
  // }
}

export async function incrementSongSuccessCount(
  _songName: string,
): Promise<void> {
  console.warn("Implement a song success count");
  // const response = await fetch(`${API_URL}/songs/${songName}/success`, {
  //   method: "POST",
  // });
  // if (response.ok) {
  //   console.log(`${songName} success count incremented`);
  // } else {
  //   console.error("Failed to increment song success count");
  // }
}

export async function incrementSongFailureCount(_songName: string) {
  console.warn("Implement a song failure count");
  // const response = await fetch(`${API_URL}/songs/${songName}/success`, {
  //   method: "POST",
  // });
  // if (response.ok) {
  //   console.log(`${songName} success count incremented`);
  // } else {
  //   console.error("Failed to increment song success count");
  // }
}
