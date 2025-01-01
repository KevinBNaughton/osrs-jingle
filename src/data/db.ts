"use server";

import { DailyChallenge, Statistics } from "@/data/definitions";
import { PrismaClient, User, Song } from "@prisma/client";
import { getCurrentUTCDate } from "@/utils/date";
import { getRandomSong } from "@/utils/getRandomSong";

const prisma: PrismaClient = new PrismaClient();

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

export async function getSong(songName: string): Promise<Song> {
  const song: Song | null = await prisma.song.findUnique({
    where: {
      song: songName,
    },
  });
  if (song) {
    return song;
  }
  return await prisma.song.create({
    data: {
      song: songName,
    },
  });
}

async function generateDailyChallenge(date: Date) {
  let dailySongsSet: Set<string> = new Set<string>();
  while (dailySongsSet.size < 5) {
    getRandomSong(dailySongsSet);
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

async function incrementGlobalCounter(success: boolean): Promise<void> {
  if (success) {
    prisma.song.upsert({
      create: {
        song: "OSRS_GLOBAL",
        success_count: 1,
      },
      update: {
        success_count: { increment: 1 },
      },
      where: { song: "OSRS_GLOBAL" },
    });
    console.info("Global success counter incremented.");
    return;
  }
  prisma.song.upsert({
    create: {
      song: "OSRS_GLOBAL",
      failure_count: 1,
    },
    update: {
      failure_count: { increment: 1 },
    },
    where: { song: "OSRS_GLOBAL" },
  });
  console.info("Global failure counter incremented.");
}

async function incrementSongSuccessCount(songName: string): Promise<void> {
  await prisma.song.upsert({
    create: {
      song: songName,
      success_count: 1,
    },
    update: {
      success_count: { increment: 1 },
    },
    where: { song: songName },
  });
}

async function incrementSongFailureCount(songName: string): Promise<void> {
  await prisma.song.upsert({
    create: {
      song: songName,
      failure_count: 1,
    },
    update: {
      failure_count: { increment: 1 },
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
  incrementGlobalCounter(success);
}
