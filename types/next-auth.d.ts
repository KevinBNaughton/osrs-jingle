import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      _id: string;
      email: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    // access_token?: string;
  }
}
