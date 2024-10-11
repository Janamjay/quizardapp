/* eslint-disable react/prop-types */
"use client";
import "animate.css";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { quizResultsState, reRender } from "../../../atom/quizState";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getCookie, setCookie } from "cookies-next";

const Gameover = ({
  isOpen,
  onClose,
  resetDinoPosition,
  quiz_id,
  room_code,
}) => {
  const [closing, setClosing] = useState(false);
  // const [quizResults, setQuizResults] = useRecoilState(quizResultsState);
  const [currentCoin, setCurrentCoin] = useState();
  const [updatedCoin, setUpdatedCoin] = useState();
  const [reload, setReload] = useRecoilState(reRender);
  const [totalCoin, setTotalCoin] = useState();

  useEffect(() => {
    setTotalCoin(getCookie("score"));
  }, []);
  const nav = useRouter();

  const handleHome = () => {
    nav.push("/");
  };
  const handleRestart = () => {
    nav.push(`/join/quiz/timerdino/${quiz_id}`);
  };

  const handleLife = () => {
    // const currentCoin = parseInt(coin, 10);
    // setCurrentCoin(totalCoin);
    if (totalCoin >= 10) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        onClose();
      }, 400);

      // setQuizResults((prevResults) => ({
      //   ...prevResults,
      //   scoreCounting: prevResults.scoreCounting - 10,
      // }));

      // Deduct 10 from the user's total coin
      setUpdatedCoin(totalCoin - 10);

      Swal.fire({
        icon: "success",
        title: "Congrats!",
        text: "You have unlocked one ❤️ life",
        position: "top-center",
      });

      resetDinoPosition();
      const coinScore =
        updatedCoin > 1000
          ? (updatedCoin / 1000).toFixed(1) + "k"
          : updatedCoin;
      setCookie("score", coinScore);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You do not have enough coins",
        position: "top-center",
      });
      nav.push("/");
    }
    setReload(!reload);
  };

  return (
    <div
      className={`fixed ${
        isOpen ? "block" : "hidden"
      } top-0 left-0 w-full h-[100vh] sm:h-full flex  items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50 z-50`}
    >
      <div
        className={` p-6 pt-3 rounded-lg  relative  w-full sm:w-[48%] md:w-[36%] ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        <div className="main-container ">
          <div id="notification">
            <h1 className="heading font-[Montserrat]">Game Over</h1>
            <div className="container font-[Montserrat] pb-[20px]">
              {totalCoin >= 10 ? (
                <>
                  <p>
                    You lose the game, but to gain an extra ❤️ life, spend 10🪙
                    coins.
                  </p>
                  <p>Total Coin : {totalCoin}</p>
                </>
              ) : (
                <>
                  <p>Better Luck For Next Time !!</p>
                  <p>Total Coin : {totalCoin}</p>
                </>
              )}

              <div className="btn">
                {room_code ? null : (
                  <button
                    aria-label="restart"
                    className="btn_action font-bold font-[Montserrat]"
                    onClick={handleRestart}
                  >
                    Restart
                  </button>
                )}

                {totalCoin >= 10 && (
                  <button
                    aria-label="get life"
                    className="btn_action font-bold  font-[Montserrat]"
                    onClick={handleLife}
                  >
                    Get Life
                  </button>
                )}
                <button
                  aria-label="home"
                  className="btn_action font-bold  font-[Montserrat]"
                  onClick={handleHome}
                >
                  Home
                </button>
              </div>
            </div>
            {/* <button className="close" onClick={handleClose}>
              X
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameover;
