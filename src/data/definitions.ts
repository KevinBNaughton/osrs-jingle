import songs from "@/data/songs.json";

export const songNamesArray = Object.keys(songs);

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  // access_token: string;
};

export type DailyChallenge = {
  songs: string[];
  date: Date;
  results: number[];
  submissions?: number;
};

export type Statistics = {
  guesses: number;
};
