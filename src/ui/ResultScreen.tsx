"use client";

import React from "react";
import "@/style/resultScreen.css";
import { copyResultsToClipboard } from "@/utils/copyResultsToClipboard";
import { isMobile } from "@/utils/isMobile";
import Countdown from "@/ui/Countdown";
import { formatMilliseconds } from "@/utils/time";

export default function ResultScreen({
  resultsArray,
  percentile,
  timeTaken,
  jingleNumber,
}: {
  resultsArray: number[];
  percentile: number;
  timeTaken: number;
  jingleNumber: number;
}) {
  const totalResult = resultsArray.reduce((a, b) => a + b, 0);
  return (
    <div className="result-screen-parent">
      <div className="result-screen result-screen-results">
        <div className="result-screen-title">Jingle #{jingleNumber}</div>
        <div className="result-screen-data-row">
          <div>Score</div>
          <div>{totalResult}</div>
        </div>
        <div className="result-screen-data-row">
          <div>Time</div>
          <div>{formatMilliseconds(timeTaken)}</div>
        </div>
        <div className="result-screen-data-row">
          <div>Top%</div>
          <div>{percentile ? percentile.toFixed(2) + "%" : "N/A"}</div>
        </div>
        <div className="result-screen-data-row">
          <div style={{ alignContent: "center" }}>Next in</div>
          <div>
            <Countdown />
          </div>
        </div>
        <hr />
        <div className="result-screen-link-container">
          {!isMobile && (
            <div
              className="result-screen-option"
              onClick={() =>
                copyResultsToClipboard(
                  resultsArray,
                  timeTaken,
                  parseFloat(percentile.toFixed(2)),
                )
              }
            >
              Copy Results
            </div>
          )}
          <a href="/game" className="result-screen-option">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
