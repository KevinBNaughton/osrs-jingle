"use client";

import React from "react";
import "@/style/footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "middle",
        }}
      >
        <p>
          Updated by{" "}
          <a href="https://github.com/KevinBNaughton">KevinBNaughton</a>.
          Originally by{" "}
          <a href="https://twitter.com/mahloola" className="link">
            mahloola
          </a>{" "}
          and{" "}
          <a href="https://twitter.com/" className="link">
            FunOrange
          </a>
        </p>
      </div>
    </div>
  );
}
