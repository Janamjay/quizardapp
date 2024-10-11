/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";
import Navbar from "@/app/components/navbar/Navbar";
import second from "/public/images/second.png";
import one from "/public/images/one.png";
import three from "/public/images/three.png";
import crown from "/public/images/crown.png";
import coin from "/public/images/coin.png";
import users from "@/app/utils/user";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { audioStateAtom } from "@/atom/audioState";
import { Howl } from "howler";
import "animate.css";
import backLeader from "/public/images/leaderboard.png";
import DNALoader from "@/app/utils/DNALoader";
import { LiaArrowCircleRightSolid } from "react-icons/lia";
import { GiTrophy } from "react-icons/gi";
import { AiFillCheckCircle, AiFillMinusCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import percent from "/public/images/percent.png";
import clock from "/public/images/clock.png";
import timer from "/public/images/timer.png";
import medal from "/public/images/medal.png";
import Confetti from "react-confetti";
import { useSpring, animated } from "react-spring";
import { useSelector } from "react-redux";
import { selectQuizInfo } from "@/redux/quizSlice";
import Script from "next/script";
import { useRouter } from "next/navigation";
import OvalLoader from "@/app/utils/OvalLoader";
import { GoArrowLeft } from "react-icons/go";

const sortedUsers = users.sort((a, b) => b.score - a.score);

const MultiLeaderBoard = ({ classListData }) => {
  const loc = useSelector(selectQuizInfo);
  const location = loc.quizInfo;
  const nav = useRouter();
  const [quizLeader, setQuizLeader] = useState([]);
  const [quizData, setQuizData] = useState({});
  const [quizCurrUser, setQuizCurrUser] = useState({});
  const [showUsers, setShowUsers] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState(false);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(true);
  const audio = useRecoilValue(audioStateAtom);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [confettiProps, setConfettiProps] = useState({
    numberOfPieces: 350,
    width: 0,
    height: 0,
    initialVelocityY: 30,
  });

  useEffect(() => {
    leaderBoardData();
    setConfettiProps({
      ...confettiProps,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setTimeout(() => {
      setIsConfettiActive(false);
    }, 4000);
  }, []);

  const confettiAnimation = useSpring({
    opacity: isConfettiActive ? 1 : 0,
    config: { duration: 1000 },
  });
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  const leaderBoardPaginateData = async () => {
    try {
      const post = {
        quiz_id: location.quiz_id,
        page: page,
        room_code: location.inviteCode,
      };

      const leaderboardDataResponse = await fetch(
        "/api/room_leaderboard_rank",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post }),
        }
      );
      const res = await leaderboardDataResponse.json();
      if (res.top_ranks.length < 10) {
        setViewData(false);
      } else {
        setViewData(true);
      }
      if (res.top_ranks.length) {
        setQuizLeader([...quizLeader, ...res.top_ranks]);
        setQuizCurrUser(res.user_rank);
        setPage(page + 1);
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (err) {
      setLoadingMore(false);
    }
  };

  const leaderBoardData = async () => {
    try {
      const post = {
        quiz_id: location.quiz_id,
        page: page,
        room_code: location.inviteCode,
      };

      const leaderboardDataResponse = await fetch("/api/room_leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
      });
      const res = await leaderboardDataResponse.json();
      if (res.top_ranks.length < 10) {
        setViewData(false);
      } else {
        setViewData(true);
      }
      if (res.top_ranks.length) {
        setQuizLeader([...quizLeader, ...res.top_ranks]);
        setQuizCurrUser(res.user_rank);
        setPage(page + 1);
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (err) {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const post = {
        quiz_id: location.quiz_id,
        room_code: location.inviteCode,
      };
      try {
        const res = await fetch("/api/room_result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post }),
        });
        const response = await res.json();
        setQuizData(response.data);
        playQuizSound();
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowUsers(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const playQuizSound = () => {
    const audioHowl = new Howl({
      src: [location.quizSound.length && location.quizSound[3].soundFile],
      volume: audio.backgroundSoundOn ? 1 : 0,
      html5: true,
    });

    audioHowl.once("end", () => {
      audioHowl.unload();
    });

    audioHowl.play();
  };

  const end = Date.now() + 6 * 1000;
  const colors = [
    "#FFCCE5",
    "#FFABAB",
    "#FFC3A0",
    "#FF677D",
    "#D4A5A5",
    "#392F5A",
    "#31A2AC",
    "#61C0BF",
    "#6B4226",
    "#D9BF77",
    "#ACD8AA",
    "#FFE156",
  ];

  useEffect(() => {
    let animationFrameId;
    function startConfetti() {
      function frame() {
        confetti({
          particleCount: 2,
          angle: 45,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          shapes: ["square", "circle", "rectangle"],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          shapes: ["square", "circle", "rectangle"],
        });
        if (Date.now() < end) {
          animationFrameId = requestAnimationFrame(frame);
        }
      }

      frame();
    }
    const delay = setTimeout(() => {
      startConfetti();
    }, 3000);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(delay);
    };
  }, []);

  const handleMore = () => {
    leaderBoardPaginateData();
  };

  const handleResult = () => {
    setResult(false);
  };
  const handleLeader = () => {
    setResult(true);
  };
  const image = "/images/userImage.webp";

  const averageTimeInSeconds = quizData.average_time;
  const minutes = Math.floor(averageTimeInSeconds / 60);
  const seconds = averageTimeInSeconds % 60;

  const timeDisplay =
    minutes > 0 ? `${minutes}min ${seconds}sec` : `${seconds} sec`;

  const totalTimeInSeconds = quizData.total_time;
  const totalMinutes = Math.floor(totalTimeInSeconds / 60);
  const totalSeconds = totalTimeInSeconds % 60;

  const totalTimeDisplay =
    totalMinutes > 0
      ? `${totalMinutes}min ${totalSeconds}sec`
      : `${totalSeconds} sec`;

  const handleDescription = () => {
    nav.push(`/`);
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js"
        async
      />
      {loading ? (
        <DNALoader />
      ) : (
        <>
          {result ? (
            <div className="description_page select-none bg-[#1B363E] relative bg-cover bg-no-repeat min-h-screen overflow-x-hidden ">
              <Navbar
                bgColor="#2e302d"
                score={quizCurrUser.user_score}
                classListData={classListData}
              />
              <div className="w-full mt-[3.6rem] sm:mt-[4rem] font-[Montserrat] flex flex-col justify-center items-center rounded-md relative z-10">
                <div className=" w-full md:w-[57%] ">
                  <div className="w-full flex gap-3 rounded-md ">
                    <div
                      className="text-lg z-[100] flex items-center justify-start  pl-[16px] lg:pl-0 md:text-4xl cursor-pointer text-yellow400 font-[400]"
                      onClick={handleDescription}
                    >
                      <GoArrowLeft />
                    </div>
                    <h1 className="text-lg flex w-full items-center justify-start  md:text-4xl cursor-pointer font-[Montserrat] text-yellow400 ">
                      Leaderboard
                    </h1>
                  </div>
                  {quizLeader.length ? (
                    <div className="flex flex-col justify-center  items-center mt-[6rem] sm:mt-[6rem] mb-[1rem]">
                      <div className="w-full py-[5px]">
                        <div className="flex w-full justify-center items-end  text-white">
                          {quizLeader.length >= 2 ? (
                            <div className=" bg-[#293437] w-[28%] h-fit py-[.7rem] sm:py-[.5rem] rounded-tl-xl rounded-bl-xl">
                              <div className="relative  flex justify-center items-center flex-col animate__animated animate__backInLeft animate__delay-1s">
                                <img
                                  src="/images/second.png"
                                  alt="second"
                                  className="max-w-[80%] min-w-[80%] sm:max-w-[55%] sm:min-w-[55%] z-50 absolute top-[3px] sm:top-[6px] xl:top-[15px] xxl:top-[0px] left-[51%] transform -translate-x-1/2"
                                />
                                <img
                                  src={
                                    quizLeader[1].user_profile == null
                                      ? image
                                      : quizLeader[1].user_profile
                                  }
                                  alt="second"
                                  className="h-[69px] w-[69px] sm:w-[100px] sm:h-[100px] rounded-[50%] absolute top-[-40px] sm:top-[-56px] border-[3px] border-blue400 "
                                />
                                <div className="mt-[3rem] sm:mt-[5rem] flex flex-col items-center gap-2">
                                  <h1 className="text-sm font-[Montserrat] sm:text-lg text-center  font-black">
                                    {quizLeader[1].user_name || "User"}
                                  </h1>
                                  <h1 className=" font-black font-[Montserrat] text-blue400 ">
                                    {quizLeader[1].user_score}
                                  </h1>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <div
                            className={` ${
                              quizLeader.length >= 2
                                ? "bg-[#293437]"
                                : "bg-transparent pt-[5rem]"
                            }  w-[28%] h-fit py-[3rem]  pt-[2rem] rounded-t-xl ${
                              quizLeader.length >= 2 ? "" : "rounded-br-xl"
                            } `}
                          >
                            <div className="relative flex justify-end items-center flex-col animate__animated animate__backInDown animate__delay-2s">
                              <img
                                src="/images/one.png"
                                alt="first"
                                className="w-[80%] sm:w-[65%] z-50 absolute top-[-43px] xxxl:top-[-9px] xxl:top-[-29px] left-[51%] transform -translate-x-1/2"
                              />
                              <img
                                src="/images/crown.png"
                                alt="crown"
                                className="w-[60%] sm:w-[35%] z-50 absolute top-[-121px] md:top-[-109px] lg:top-[-122px] xxxl:top-[-125px] xxl:top-[-132px] left-[50%] transform -translate-x-1/2"
                              />
                              <img
                                src={
                                  quizLeader[0].user_profile == null
                                    ? image
                                    : quizLeader[0].user_profile
                                }
                                alt="first"
                                className="h-[69px] w-[69px]  sm:w-[100px] sm:h-[100px] absolute rounded-[50%] top-[-84px] sm:top-[-77px] border-[3px] border-yellow300"
                              />
                              <div className="mt-[1rem] sm:mt-[4rem] flex flex-col items-center gap-2">
                                <h1 className=" text-sm font-[Montserrat] sm:text-lg  text-center  font-black">
                                  {quizLeader[0].user_name || "User"}
                                </h1>
                                <h1 className=" font-black font-[Montserrat] text-xl text-yellow400 ">
                                  {quizLeader[0].user_score}
                                </h1>
                              </div>
                            </div>
                          </div>
                          {quizLeader.length >= 3 ? (
                            <div className="bg-[#293437] w-[28%] h-fit rounded-tr-xl rounded-br-xl">
                              <div className="relative  flex justify-center items-center flex-col animate__animated animate__backInRight ">
                                <img
                                  src="/images/three.png"
                                  alt="three"
                                  className="w-[80%] sm:w-[55%] z-10 absolute top-[3px] sm:top-[-5%] left-[51%] xl:top-[9px] xxl:top-[9px] transform -translate-x-1/2"
                                />
                                <img
                                  src={
                                    quizLeader[2].user_profile == null
                                      ? image
                                      : quizLeader[2].user_profile
                                  }
                                  alt="third"
                                  className="h-[69px] w-[69px] sm:w-[100px] sm:h-[100px] absolute top-[-40px] sm:top-[-44px] border-2 border-green400 rounded-[50%] "
                                />
                                <div className="mt-[3rem] sm:mt-[5rem] flex flex-col items-center gap-2">
                                  <h1 className=" text-sm font-[Montserrat] text-center sm:text-lg font-black">
                                    {quizLeader[2].user_name || "User"}
                                  </h1>
                                  <h1 className=" text-green400 font-[Montserrat] text-xl  font-black">
                                    {quizLeader[2].user_score}
                                  </h1>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {quizLeader.length >= 2 ? (
                <div className="flex flex-col font-Montserrat justify-center items-center relative z-10">
                  <div className="w-[100%] md:w-[57%]  cursor-pointer">
                    <table className="w-full pb-[14rem] sm:pb-[35rem] lg:pb-[64px] border-separate border-spacing-y-3 bg-[#293437] pt-6  px-6 rounded-t-[30px] mb-[4rem]">
                      <tbody>
                        {quizCurrUser ? (
                          <tr
                            className={` rounded-lg animate__animated animate__zoomIn ${
                              firstRender ? "animate__delay-3s" : ""
                            }   hover:scale-105 transition duration-500 bg-[#006778]`}
                          >
                            <td className="text-white font-[Montserrat] text-base py-2 px-[0.8rem] text-center rounded-tl-lg rounded-bl-lg">
                              {quizCurrUser.rank}
                            </td>
                            <td className="py-2 w-[42px] md:w-[5rem] md:pl-[38px]">
                              <img
                                src={
                                  quizCurrUser.user_profile == null
                                    ? image
                                    : quizCurrUser.user_profile
                                }
                                alt="userImage"
                                className="w-10 h-10 rounded-full"
                              />
                            </td>
                            <td className="text-white font-[Montserrat] text-base py-2 pl-[10px]">
                              {quizCurrUser.user_name || "User"}
                            </td>
                            <td className="w-[19px]">
                              <img
                                src="/images/coin.png"
                                alt=""
                                className="w-[20px]"
                              />
                            </td>
                            <td className=" text-white font-[Montserrat] text-base px-1 sm:w-[6rem] rounded-tr-lg rounded-br-lg">
                              {quizCurrUser.user_score}
                            </td>
                          </tr>
                        ) : null}
                        {quizLeader.length &&
                          quizLeader
                            .filter((user) => user.rank >= 4)
                            .filter(
                              (user) =>
                                user.user_name !== quizCurrUser?.user_name
                            )
                            .map((user, ind) => (
                              <tr
                                key={ind}
                                className={`rounded-lg animate__animated animate__zoomIn ${
                                  firstRender ? "animate__delay-3s" : ""
                                }  hover:scale-105 transition duration-500 
                                bg-[#2E4950]`}
                              >
                                <td className="text-white text-base py-2 px-2 text-center rounded-tl-lg rounded-bl-lg font-[Montserrat]">
                                  {user.rank}
                                </td>
                                <td className="py-2 w-[42px] md:w-[5rem] md:pl-[38px]">
                                  <img
                                    src={
                                      user.user_profile == null
                                        ? image
                                        : user.user_profile
                                    }
                                    alt="userImage"
                                    className="w-10 h-10 rounded-full"
                                  />
                                </td>
                                <td className="text-white font-[Montserrat] text-base py-2 pl-[10px]">
                                  {user.user_name || "user"}
                                </td>
                                <td className="w-[19px]">
                                  <img
                                    src="/images/coin.png"
                                    alt=""
                                    className="w-[20px]"
                                  />
                                </td>
                                <td className=" text-white font-[Montserrat] text-base px-1 sm:w-[6rem] rounded-tr-lg rounded-br-lg">
                                  {user.user_score}
                                </td>
                              </tr>
                            ))}
                        {viewData ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              {loadingMore ? (
                                <div className="w-full flex justify-center">
                                  <OvalLoader />
                                </div>
                              ) : (
                                <p
                                  onClick={handleMore}
                                  className="text-white font-[Montserrat] text-xl cursor-pointer py-2"
                                >
                                  Load More
                                </p>
                              )}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              <div className=" fixed bottom-0 left-0 w-[100%] bg-black z-10">
                <div className="flex flex-col justify-center  items-center ">
                  <div className="w-[90%] md:w-[50%] py-4 rounded-lg">
                    <div className="flex w-full justify-between">
                      <div
                        className="w-[100%] py-[7px] sm:py-[9px] px-[16px] sm:px-[10px]  rounded-lg bg-[#006778] text-white animate__animated animate__fadeInUpBig cursor-pointer"
                        onClick={() => handleResult()}
                      >
                        <div className="flex w-full justify-evenly items-center">
                          <div className="w-[90%]">
                            <h1 className="text-center ml-0 font-[Montserrat]  lg:ml-5px">
                              Result
                            </h1>
                          </div>
                          <div className="w-[3%] ">
                            <LiaArrowCircleRightSolid
                              style={{
                                fontSize: "18px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className=" bg-center select-none relative result_back bg-no-repeat bg-cover min-h-screen  overflow-hidden"
              style={{
                // backgroundImage: `url(${back})`,
                backgroundColor: "#1B363E",
              }}
            >
              <Navbar
                bgColor="#2e302d"
                score={quizData.user_score}
                classListData={classListData}
              />
              {isConfettiActive && (
                <animated.div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 9999,
                    ...confettiAnimation,
                  }}
                >
                  <Confetti {...confettiProps} />
                </animated.div>
              )}
              <div className="w-full  mt-[3.6rem] sm:mt-[4rem]  flex flex-col justify-center items-center rounded-md relative z-10">
                <div className=" w-full md:w-[50%] flex gap-[1rem] sm:gap-[2rem] items-center justify-center rounded-md py-[7px]">
                  <div className="w-full flex gap-3 rounded-md ">
                    <div
                      className="text-lg z-[100] flex items-center justify-start  pl-[16px] lg:pl-0 md:text-4xl cursor-pointer text-yellow400 font-[400]"
                      onClick={handleLeader}
                    >
                      <GoArrowLeft />
                    </div>
                    <h1 className="text-lg flex w-full items-center justify-start  md:text-4xl cursor-pointer font-[Montserrat] text-yellow400 ">
                      {location.name}
                    </h1>
                  </div>
                </div>
                {/* <div className=" w-full md:w-[50%] rounded-md">
                  <h1 className="text-xl text-center font-[Montserrat]  md:text-4xl cursor-pointer text-yellow400 p-[7px] ">
                    {location.name}
                  </h1>
                </div> */}
              </div>
              <div className="">
                <div className="flex flex-col justify-center  items-center   pb-[10px] relative z-10">
                  <div className="w-full md:w-[50%] shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-lg p-4">
                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <img
                              src="/images/coin.png"
                              alt="clock"
                              className="max-w-[27px]  h-[27px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Coin Earned
                            </p>
                            <p className="text-left text-[17px] font-[Montserrat] font-black">
                              {quizData.total_coin_earn}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInRight  cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <GiTrophy
                              style={{
                                fontSize: "27px",
                                color: "goldenrod",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Your Score
                            </p>
                            <p className="text-left font-[Montserrat] text-[17px] font-black">
                              {quizData.user_score}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <AiFillCheckCircle
                              style={{
                                fontSize: "27px",
                                color: "lightgreen",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Correct
                            </p>
                            <p className="text-left font-[Montserrat] text-[17px]font-black">
                              {quizData.total_correct}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <MdCancel
                              style={{
                                fontSize: "27px",
                                color: "#ED1C24",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Incorrect
                            </p>
                            <p className="text-left font-[Montserrat] text-[17px] font-black">
                              {quizData.total_incorrect}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <img
                              src="/images/percent.png"
                              alt="percent"
                              className="max-w-[27px]  h-[27px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Percentage
                            </p>
                            <p className="text-left font-[Montserrat] text-[17px]  font-black">
                              {quizData.percentage} %
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <img
                              src="/images/clock.png"
                              alt="clock"
                              className="max-w-[27px]  h-[27px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Time Spent
                            </p>
                            <p className="text-left font-[Montserrat] text-[17px] font-black">
                              {totalTimeDisplay}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-5 justify-between ">
                      <div className="w-[50%]  mb-4 py-[5px] px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <AiFillMinusCircle
                              style={{
                                fontSize: "27px",
                                color: " #ED1C24",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Unattempted
                            </p>
                            <p className="text-left text-[17px] font-[Montserrat] font-black">
                              {quizData.unattemped_question}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <img
                              src="/images/timer.png"
                              alt="timer"
                              className="max-w-[27px]  h-[27px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Time/Ques
                            </p>
                            <p className="text-left text-[17px] font-[Montserrat] font-black">
                              {timeDisplay}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[100%] py-[5px] px-[10px]  rounded-lg bg-[#293437] text-white animate__animated animate__fadeInUpBig cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[4%] mr-6 md:mr-3">
                            <img
                              src="/images/medal.png"
                              alt="medal"
                              className="max-w-[27px]  h-[27px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Live Rank
                            </p>
                            <p className="text-left text-[17px] font-[Montserrat]      font-black ">
                              {quizData.rank}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" fixed bottom-0 left-0 w-[100%] z-10">
                  <div className="flex flex-col justify-center  items-center ">
                    <div className="w-full md:w-[50%] p-4 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-lg">
                      <div className="flex w-full justify-between">
                        <div
                          className="w-[100%] py-[7px] sm:py-[9px] px-[16px] sm:px-[10px]  rounded-lg bg-[#006778] text-white animate__animated animate__fadeInUpBig cursor-pointer"
                          onClick={() => handleLeader()}
                        >
                          <div className="flex w-full justify-evenly items-center">
                            <div className="w-[90%]">
                              <h1 className="text-center ml-0 font-[Montserrat]  lg:ml-5px">
                                LeaderBoard
                              </h1>
                            </div>
                            <div className="w-[3%] ">
                              <LiaArrowCircleRightSolid
                                style={{
                                  fontSize: "18px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MultiLeaderBoard;
