"use client";

import axios from "axios";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { songNamesArray } from "@/data/db";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const urls = songNamesArray.map(
  (song: string) =>
    `https://oldschool.runescape.wiki/images/${song.replace(/\s/g, "_")}.ogg`,
);

// https://stackoverflow.com/questions/51859873/using-axios-to-return-stream-from-express-app-the-provided-value-stream-is/77107457#77107457
async function downloadFile(url: string, outputPath: string) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function convertOggToMp3(inputPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });
}

async function processFiles(urls: string[]) {
  const songsDir = path.resolve(__dirname, "songs");

  // Ensure the /songs directory exists
  if (!fs.existsSync(songsDir)) {
    fs.mkdirSync(songsDir);
  }

  for (const url of urls) {
    const fileName = url.split("/").pop()?.replace(".ogg", "");
    const oggPath = path.join(songsDir, `${fileName}.ogg`);
    const mp3Path = path.join(songsDir, `${fileName}.mp3`);

    console.log(`Downloading ${url}...`);
    await downloadFile(url, oggPath);

    console.log(`Converting ${fileName}.ogg to ${fileName}.mp3...`);
    await convertOggToMp3(oggPath, mp3Path);

    console.log(`Finished processing ${fileName}`);
  }
}

processFiles(urls)
  .then(() => {
    console.log("All files processed successfully");
  })
  .catch((err) => {
    console.error("Error processing files:", err);
  });
