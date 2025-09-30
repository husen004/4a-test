"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import man from "../public/man.png";
import alert1 from "../public/alert1.png";
import TariffsPrice from "./TariffsPrice";
import { useTimer } from "../context/TimerContext";

export default function Tariffs() {
  const { timeLeft, isExpired } = useTimer();
  const [isBlinking, setIsBlinking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);

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

  const handleBuyClick = () => {
    const selectedTariffInput = document.getElementById(
      "selected-tariff-value"
    ) as HTMLInputElement;
    const selectedTariff = selectedTariffInput?.value || "";

    if (!isChecked) {
      setShowCheckboxError(true);
      return;
    }

    if (selectedTariff === "") {
      alert("Пожалуйста, выберите тариф");
      return;
    }

    console.log("Purchase initiated for tariff:", selectedTariff);
    setShowCheckboxError(false);
  };

  return (
    <div className="my-8 flex justify-center items-center md:flex-row flex-col md:gap-8 mt-22">
      <div className="my-6 relative">
        <Image src={man} alt="man" />
        <div className="shade"></div>
      </div>

      <div className="flex flex-col gap-6">
        <TariffsPrice />

        <div className="tarrif-plan rounded-[20px] flex items-start gap-4 mr-auto p-3">
          <Image src={alert1} alt="alert1" />
          <h5 className="max-w-[400px] text-[16px] text-gray-400">
            Следуя плану на 3 месяца и более, люди получают в 2 раза лучший
            результат, чем за 1 месяц
          </h5>
        </div>

        <div className="flex items-center gap-2 max-w-[550px] relative">
          <input
            type="checkbox"
            id="terms-checkbox"
            className={`h-6 w-8 border-2 rounded ${
              showCheckboxError ? "border-red-500 ring-2 ring-red-300" : "border-gray-400"
            } transition-colors focus:outline-none`}
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
              if (showCheckboxError) setShowCheckboxError(false);
            }}
          />
          <label 
            htmlFor="terms-checkbox" 
            className={`tarrif-text2 ${showCheckboxError ? "text-red-500" : ""}`}
          >
            Я согласен с{" "}
            <span className="underline cursor-pointer">
              офертой рекуррентных платежей
            </span>{" "}
            и{" "}
            <span className="underline cursor-pointer">
              Политикой конфиденциальности
            </span>{" "}
          </label>
          
          {showCheckboxError && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
              Необходимо принять условия
            </div>
          )}
        </div>

        <button
          className="cursor-pointer mr-auto tarrif-button px-26 py-4 text-xl rounded-[20px] font-bold hover:animate-pulse"
          onClick={handleBuyClick}
        >
          Купить
        </button>

        <p className="max-w-[750px] tarrif-text">
          Нажимая кнопку «Купить», Пользователь соглашается на разовое списание
          денежных средств для получения пожизненного доступа к приложению.
          Пользователь соглашается, что данные кредитной/дебетовой карты будут
          сохранены для осуществления покупок дополнительных услуг сервиса в
          случае желания пользователя.
        </p>
      </div>
    </div>
  );
}
