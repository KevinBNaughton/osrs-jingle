// Set in top level .env file
// Likely set to: "http://127.0.0.1:PORT/"
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export type Song = {
  name: string;
  success_count?: number;
  failure_count?: number;
};
