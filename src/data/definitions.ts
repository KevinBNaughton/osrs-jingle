import songs from "@/data/songs.json";

// Set in .env file: "2025", "0", and "1" for year, month, and day respectfully
export const JINGLE_START_DATE: Date = new Date(
  +(process.env.JINGLE_START_YEAR || "2025"),
  +(process.env.JINGLE_START_MONTH || "0"),
  +(process.env.JINGLE_START_DAY || "1"),
  0,
  0,
  0,
  0,
);

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
