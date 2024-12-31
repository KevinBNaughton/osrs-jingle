import React from "react";
import "@/style/homeButton.css";

export default function HomeButton() {
  return (
    <div
      className="home-btn-container"
      onClick={() => {
        window.location.reload();
      }}
    ></div>
  );
}
