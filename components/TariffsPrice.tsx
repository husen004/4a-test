"use client";
import { useTimer } from "../context/TimerContext";
import React, { useState, useEffect } from "react";

interface Tarif {
  id: string;
  period: string;
  price: number;
  full_price: number;
  is_best: boolean;
  text: string;
}

export default function TariffsPrice() {
  const { isExpired } = useTimer();
  const [tariffs, setTariffs] = useState<Tarif[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://t-core.fit-hub.pro/Test/GetTariffs"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tariffs");
        }

        const data: Tarif[] = await response.json();

        const uniqueTariffs = data.reduce((acc: Tarif[], tariff, index) => {
          const isDuplicate = acc.some((t) => t.id === tariff.id);

          if (isDuplicate) {
            const uniqueTariff = {
              ...tariff,
              id: `${tariff.id}-${index}`,
            };
            acc.push(uniqueTariff);
          } else {
            acc.push(tariff);
          }

          return acc;
        }, []);

        const sortedTariffs = [...uniqueTariffs].sort((a, b) => {
          if (a.is_best) return -1;
          if (b.is_best) return 1;
          return 0;
        });

        setTariffs(sortedTariffs);

        const bestTariff = sortedTariffs.find((t) => t.is_best);

        if (bestTariff) {
          setSelectedTariff(bestTariff.id);
        } else if (sortedTariffs.length > 0) {
          setSelectedTariff(sortedTariffs[0].id);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load tariffs. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  const calculateDiscount = (price: number, fullPrice: number) => {
    const discount = ((fullPrice - price) / fullPrice) * 100;
    return Math.round(discount);
  };

  const handleTariffSelect = (tariffId: string) => {
    setSelectedTariff(tariffId);
  };

  useEffect(() => {
    if (isExpired) {
      setShowAnimation(true);

      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isExpired]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-white">Loading tariffs...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 mx-4 md:mx-0">
      {tariffs.length > 0 && tariffs[0].is_best && (
        <div
          key={`${tariffs[0].id}-best`}
          className={`relative tarrif-plan rounded-[40px] flex justify-center flex-row md:items-center cursor-pointer w-full
            ${
              selectedTariff === tariffs[0].id
                ? "border border-orange-500"
                : "border border-gray-600"
            }`}
          onClick={() => handleTariffSelect(tariffs[0].id)}
        >
          <div className="flex sm:justify-evenly justify-between items-center w-full md:p-4">
            <div className="price-transition-container flex flex-col p-8 md:my-0 my-2">
              <h3
                className="md:text-2xl text-xl text-white font-medium"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {tariffs[0].period}
              </h3>

              {!isExpired ? (
                <>
                  <div className="flex flex-col">
                    <span
                      className={`md:text-4xl text-2xl font-bold text-white whitespace-nowrap ${
                        isExpired
                          ? ""
                          : selectedTariff === tariffs[0].id
                          ? "warning"
                          : ""
                      } ${showAnimation ? "price-slide-out" : ""}`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tariffs[0].price} ₽
                    </span>
                    <span
                      className={`text-gray-400 line-through ml-auto text-lg ${
                        showAnimation ? "price-slide-out" : ""
                      }`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tariffs[0].full_price} ₽
                    </span>
                  </div>
                </>
              ) : (
                <span
                  className={`md:text-4xl text-2xl font-bold ${
                    selectedTariff === tariffs[0].id ? "warning" : "text-white"
                  } ${showAnimation ? "price-slide-in" : ""}`}
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {tariffs[0].full_price} ₽
                </span>
              )}
            </div>

            <h5 className="text-gray-400 my-auto md:max-w-[200px] max-w-[120px] mr-3">
              <span className="hidden md:inline">{tariffs[0].text}</span>

              <span className="md:hidden">Всегда быть в форме</span>
            </h5>
          </div>

          {!isExpired || showAnimation ? (
            <div
              className={`absolute top-0 right-18 md:left-10 md:right-auto bg-red-400 text-md font-bold p-2 text-white rounded-b-lg
              ${isExpired && showAnimation ? "badge-fade-out" : ""}`}
              style={{ fontFamily: "var(--font-gilroy), sans-serif" }}
            >
              -{calculateDiscount(tariffs[0].price, tariffs[0].full_price)}%
            </div>
          ) : null}

          <div className="absolute right-5 top-2 text-orange-300 font-semibold">
            хит!
          </div>
        </div>
      )}

      <div className="flex md:flex-row flex-col gap-4">
        {tariffs.slice(1).map((tariff, index) => {
          const discountPercent = calculateDiscount(
            tariff.price,
            tariff.full_price
          );
          const isSelected = selectedTariff === tariff.id;

          return (
            <div
              key={`${tariff.id}-${index}`}
              className={`transition-all duration-300 relative tarrif-plan rounded-[40px] p-3 flex md:flex-col flex-row justify-center md:gap-4 gap-20 cursor-pointer md:w-[calc(50%-0.5rem)] 
                ${
                  isSelected
                    ? "border border-orange-500"
                    : "border border-gray-600"
                }`}
              onClick={() => handleTariffSelect(tariff.id)}
            >
              <div className="flex sm:justify-evenly justify-between w-full md:hidden">
                <div className="price-transition-container flex flex-col p-4 md:my-0 my-2">
                  <h3
                    className="md:text-2xl text-[18px] text-white font-medium md:mb-4"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {tariff.period}
                  </h3>

                  {!isExpired ? (
                    <>
                      <div className="flex flex-col">
                        <span
                          className={`md:text-4xl text-2xl font-bold ${
                            isSelected ? "warning" : "normal"
                          } ${showAnimation ? "price-slide-out" : ""}`}
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {tariff.price} ₽
                        </span>
                        <span
                          className={`text-gray-400 line-through md:text-2xl text-[16px] ml-auto ${
                            showAnimation ? "price-slide-out" : ""
                          }`}
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {tariff.full_price} ₽
                        </span>
                      </div>
                    </>
                  ) : (
                    <span
                      className={`md:text-4xl text-2xl font-bold ${
                        isSelected ? "warning" : "normal"
                      } ${showAnimation ? "price-slide-in" : ""}`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tariff.full_price} ₽
                    </span>
                  )}
                </div>

                <h5 className="text-gray-400 max-w-[120px] my-auto overflow-hidden">
                  <span className="line-clamp-3">{tariff.text}</span>
                </h5>
              </div>

              <div className="hidden md:flex md:flex-col md:items-center md:w-full md:justify-between h-full">
                <div className="price-transition-container flex flex-col items-center md:mt-14">
                  <h3
                    className="md:text-2xl text-xl text-white font-medium md:mb-4"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {tariff.period}
                  </h3>

                  {!isExpired ? (
                    <>
                      <div className="flex flex-col items-center">
                        <span
                          className={`md:text-4xl text-2xl font-bold ${
                            isSelected ? "warning" : "normal"
                          } ${showAnimation ? "price-slide-out" : ""}`}
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {tariff.price} ₽
                        </span>
                        <span
                          className={`text-gray-400 line-through md:text-2xl text-[16px] ml-auto ${
                            showAnimation ? "price-slide-out" : ""
                          }`}
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {tariff.full_price} ₽
                        </span>
                      </div>
                    </>
                  ) : (
                    <span
                      className={`md:text-4xl text-2xl font-bold ${
                        isSelected ? "warning" : "normal"
                      } ${showAnimation ? "price-slide-in" : ""}`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tariff.full_price} ₽
                    </span>
                  )}
                </div>
                <h5 className="text-gray-400 max-w-[150px] overflow-hidden md:mb-4 md:mt-10">
                  {tariff.text}
                </h5>
              </div>

              {!isExpired || showAnimation ? (
                <div
                  className={`absolute top-0 right-8 md:left-10 md:right-auto bg-red-400 text-md font-bold p-2 text-white rounded-b-lg
                            ${
                              isExpired && showAnimation ? "badge-fade-out" : ""
                            }`}
                >
                  -{discountPercent}%
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <input type="hidden" id="selected-tariff-value" value={selectedTariff} />
    </div>
  );
}
