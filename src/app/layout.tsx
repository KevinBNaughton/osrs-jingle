import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "OSRS Jingle",
  description: "Ported from Jingle.rs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
