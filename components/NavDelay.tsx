import React from "react";
import Timer from "./Timer";


export default function NavDelay() {
  return (
    <div className="flex items-center justify-center flex-col">
      <p className="text">Успейте открыть пробную неделю</p>

      <div className="flex flex-row">
        <Timer />
      </div>
    </div>
  );
}