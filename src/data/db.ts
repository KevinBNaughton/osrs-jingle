import { DailyChallenge, Song, Statistics } from "@/data/definitions";
import geojsondata, { GeoJSONFeature } from "@/data/GeoJSON";
import songs from "@/data/songs.json";
import { PrismaClient, User } from "@prisma/client";
import { isFeatureVisibleOnMap } from "@/utils/getSong";
import { decodeHTML } from "@/utils/string-utils";
import { getCurrentUTCDate } from "@/utils/date";

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

async function generateDailyChallenge(date: Date) {
  console.warn("TODO - Implement this");
  let dailySongsSet: Set<string> = new Set<string>();
  while (dailySongsSet.size < 5) {
    dailySongsSet.add(getRandomSong(dailySongsSet));
  }
  const dailyChallenge = await prisma.dailyChallenge.create({
    data: {
      date: date,
      songs: Array.from(dailySongsSet),
      submissions: 0,
    },
  });
  return dailyChallenge;
}

export async function getDailyChallenge(
  _formattedDate: string,
): Promise<DailyChallenge> {
  console.warn("TODO - Implement this correctly and not randomly");
  const today = getCurrentUTCDate();
  let dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: { date: today },
  });
  if (!dailyChallenge) {
    dailyChallenge = await generateDailyChallenge(today);
  }
  return {
    songs: dailyChallenge.songs,
    date: dailyChallenge.date,
    results: [],
    submissions: dailyChallenge.submissions ?? undefined,
  };
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

async function incrementGlobalGuessCounter(success: boolean): Promise<void> {
  if (success) {
    prisma.guessCount.upsert({
      create: {
        song: "OSRS_GLOBAL",
        success: 1,
      },
      update: {
        success: { increment: 1 },
      },
      where: { song: "OSRS_GLOBAL" },
    });
    console.info("Global success counter incremented.");
    return;
  }
  prisma.guessCount.upsert({
    create: {
      song: "OSRS_GLOBAL",
      failure: 1,
    },
    update: {
      failure: { increment: 1 },
    },
    where: { song: "OSRS_GLOBAL" },
  });
  console.info("Global failure counter incremented.");
}

async function incrementSongSuccessCount(songName: string): Promise<void> {
  await prisma.guessCount.upsert({
    create: {
      song: songName,
      success: 1,
    },
    update: {
      success: { increment: 1 },
    },
    where: { song: songName },
  });
}

async function incrementSongFailureCount(songName: string): Promise<void> {
  await prisma.guessCount.upsert({
    create: {
      song: songName,
      failure: 1,
    },
    update: {
      failure: { increment: 1 },
    },
    where: { song: songName },
  });
}

export async function incrementSongCount(songName: string, success: boolean) {
  if (success) {
    incrementSongSuccessCount(songName);
  } else {
    incrementSongFailureCount(songName);
  }
  incrementGlobalGuessCounter(success);
}
