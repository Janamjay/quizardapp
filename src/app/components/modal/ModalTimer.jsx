/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import "animate.css";
import { useState, useRef, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const ModalTimer = ({ isOpen, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(3);
  const [renderTimeKey, setRenderTimeKey] = useState(3);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      setCountdownDuration(3);
      setRenderTimeKey((prevKey) => prevKey + 1);
    }
  }, [isOpen]);

  const renderTime = ({ remainingTime }) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);

    if (currentTime.current !== remainingTime) {
      isNewTimeFirstTick.current = true;
      prevTime.current = currentTime.current;
      currentTime.current = remainingTime;
    } else {
      isNewTimeFirstTick.current = false;
    }

    if (remainingTime === 0) {
      setTimeout(() => {
        setOneLastRerender((val) => val + 1);
      }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
      <div className="time-wrapper">
        <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
          {remainingTime}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed ${
        isOpen ? "block" : "hidden"
      }  top-0 left-0 w-full h-[90vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50 z-50`}
    >
      <div
        className={`bg-white  p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%] md:w-[25%] ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        <div className="flex justify-center flex-col">
          <h1 className="text-xl md:text-3xl flex justify-center font-[Montserrat] items-center">
            Time Up!
          </h1>
          <div className="flex justify-center items-center my-4">
            <CountdownCircleTimer
              isPlaying={isOpen}
              duration={countdownDuration}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[3, 2, 1, 0]}
              strokeWidth={6}
              strokeLinecap="round"
              size={100}
              onComplete={() => {
                onClose();
              }}
              key={renderTimeKey}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
          <div className="flex justify-center items-center">
            <button
            aria-label="next question"
              onClick={handleClose}
              className="mt-2 md:mt-4 p-2 font-[Montserrat]  bg-[#39576d]  cursor-pointer hover:hover:bg-[#253b4b] text-white text-sm md:text-base w-[40%]  rounded-lg "
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTimer;
