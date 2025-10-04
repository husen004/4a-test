"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import star4 from "../public/star4.svg";
import star5 from "../public/star5.svg";
import star6 from "../public/star6.svg";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft < 30 && timeLeft > 0) {
      const blinkInterval = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    } else {
      setIsBlinking(false);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getColorClass = () => {
    if (timeLeft === 0) return "normal";
    if (timeLeft < 30) {
      return isBlinking ? "danger" : "warning";
    }
    return "warning";
  };

  return (
    <div className="wrapper">
      <div
        className={`gap-1 timer flex justify-center items-center ${getColorClass()}`}
      >
        <Image
          src={
            getColorClass() === "normal"
              ? star6
              : getColorClass() === "danger"
              ? star5
              : star4
          }
          alt="star"
          className="inline-block mx-1"
        />

        {formatTime(timeLeft)}

        <Image
          src={
            getColorClass() === "normal"
              ? star6
              : getColorClass() === "danger"
              ? star5
              : star4
          }
          alt="star"
          className="inline-block mx-1"
        />
      </div>
    </div>
  );
}
