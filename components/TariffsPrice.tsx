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
    <div className="flex flex-col gap-6 mx-2 md:mx-0">
      {tariffs.length > 0 && tariffs[0].is_best && (
        <div
          key={`${tariffs[0].id}-best`}
          className={`relative tarrif-plan rounded-[32px] p-6 flex justify-center flex-row md:items-center gap-4 cursor-pointer w-full
            ${
              selectedTariff === tariffs[0].id
                ? "border-2 border-orange-500"
                : "border border-gray-600"
            }`}
          onClick={() => handleTariffSelect(tariffs[0].id)}
        >
          <div className="flex flex-col pt-4">
            <h3
              className="md:text-2xl text-xl text-white font-medium mb-4 "
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {tariffs[0].period}
            </h3>

            <div className="price-transition-container ">
              {!isExpired ? (
                <>
                  <div className="flex flex-col">
                    <span
                      className={`md:text-5xl text-3xl font-bold text-white ${
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
                      className={`text-gray-400 line-through text-lg ml-auto ${
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
                  className={`md:text-5xl text-3xl font-bold ${
                    selectedTariff === tariffs[0].id ? "warning" : "text-white"
                  } ${showAnimation ? "price-slide-in" : ""}`}
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {tariffs[0].full_price} ₽
                </span>
              )}
            </div>
          </div>

          {!isExpired || showAnimation ? (
            <div
              className={`absolute top-0 right-18 md:left-10 md:right-auto bg-red-400 text-md font-bold p-2 text-white rounded-b-lg
                          ${
                            isExpired && showAnimation ? "badge-fade-out" : ""
                          }`}
            >
              -{calculateDiscount(tariffs[0].price, tariffs[0].full_price)}%
            </div>
          ) : null}

          <div className="absolute right-5 top-2 text-orange-300 font-semibold">
            хит!
          </div>

          <div className="text-gray-400 md:ml-6 my-auto md:flex-1 max-w-[300px]">
            {tariffs[0].text}
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
                    ? "border-2 border-orange-500"
                    : "border border-gray-600"
                }`}
              onClick={() => handleTariffSelect(tariff.id)}
            >
              <div className="flex flex-col justify-start items-center md:items-center md:py-12 py-7">
                <h3
                  className="md:text-2xl text-xl text-white font-medium mb-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {tariff.period}
                </h3>

                <div className="price-transition-container">
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
                          className={`text-gray-400 line-through text-lg ml-auto ${
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
              </div>

              {!isExpired || showAnimation ? (
                <div
                  className={`absolute top-0 right-12 md:left-10 md:right-auto bg-red-400 text-md font-bold p-2 text-white rounded-b-lg
                            ${
                              isExpired && showAnimation ? "badge-fade-out" : ""
                            }`}
                >
                  -{discountPercent}%
                </div>
              ) : null}

              <div className="text-gray-400 max-w-[200px] md:mb-2 my-auto">
                {tariff.text}
              </div>
            </div>
          );
        })}
      </div>

      <input type="hidden" id="selected-tariff-value" value={selectedTariff} />
    </div>
  );
}
