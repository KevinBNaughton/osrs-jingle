import React from "react";
import DailyGuessLabel from "@/ui/DailyGuessLabel";

export default function FiveGuessesRow(dailyResults: number[]) {
  return (
    <table
      style={{
        marginBottom: "10px",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      <tbody>
        <tr>
          <td>
            <DailyGuessLabel number={dailyResults[0] || -1} />
          </td>
          <td>
            <DailyGuessLabel number={dailyResults[1] || -1} />
          </td>
          <td>
            <DailyGuessLabel number={dailyResults[2] || -1} />
          </td>
          <td>
            <DailyGuessLabel number={dailyResults[3] || -1} />
          </td>
          <td>
            <DailyGuessLabel number={dailyResults[4] || -1} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
