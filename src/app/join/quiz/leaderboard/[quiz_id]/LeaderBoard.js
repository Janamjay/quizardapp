/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/footer/Footer";
import second from "/public/images/second.png";
import one from "/public/images/one.png";
import three from "/public/images/three.png";
import crown from "/public/images/crown.png";
import coin from "/public/images/coin.png";
import { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { audioStateAtom } from "@/atom/audioState";
import { Howl } from "howler";
import "animate.css";
import back from "/public/images/leaderboard.png";
import Navigation from "@/app/components/navigationBar/Navigation";
import DNALoader from "@/app/utils/DNALoader";
import OvalLoader from "@/app/utils/OvalLoader";
import { useSelector } from "react-redux";
import { selectQuizSound } from "@/redux/audioSlice";
import { useParams, useRouter, usePathname } from "next/navigation";
import Script from "next/script";
import { leaderboardData } from "@/app/api/service";
import { GoArrowLeft } from "react-icons/go";
import { setCookie, getCookie, hasCookie } from "cookies-next";

const LeaderBoard = ({
  classListData,
  leaderboardUserData,
  userProfileData,
}) => {
  const params = useParams();
  const nav = useRouter();
  const pathname = usePathname();
  const quiz_id = params.quiz_id;
  const quizSound = useSelector(selectQuizSound);
  const [quizLeader, setQuizLeader] = useState([]);
  const [quizCurrUser, setQuizCurrUser] = useState({});
  const [showUsers, setShowUsers] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewData, setViewData] = useState(false);
  const [page, setPage] = useState(1);
  const audio = useRecoilValue(audioStateAtom);
  const audioHowlRef = useRef(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        const apiData = userProfileData;
        const formattedCoinScore = apiData.user_coin;
        const coinScore =
          formattedCoinScore > 1000
            ? (formattedCoinScore / 1000).toFixed(1) + "k"
            : formattedCoinScore;
        setCookie("score", coinScore);
      } catch (error) {}
    };
    fetchData();
    const isLoggedIn = getCookie("isUserLoggedIn");
    if (isLoggedIn) {
      leaderBoardData();
    } else {
      nav.push("/");
    }
    return () => {
      if (audioHowlRef.current) {
        audioHowlRef.current.stop();
        audioHowlRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  const leaderBoardPaginateData = async () => {
    try {
      setLoadingMore(true);
      // const res = await leaderboardData({ quiz_id, page });
      const myVariable = { quiz_id, page };

      const viewAllResponse = await fetch("/api/leaderboard_by_rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myVariable }),
      });
      const res = await viewAllResponse.json();
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
      if (page === 1) {
        // playQuizSound();
      }
    } catch (error) {
      setLoadingMore(false);
    }
  };
  const leaderBoardData = async () => {
    try {
      setLoadingMore(true);
      const res = leaderboardUserData;
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
      if (page === 1) {
        // playQuizSound();
      }
    } catch (error) {
      setLoadingMore(false);
    }
  };

  const playQuizSound = () => {
    audioHowlRef.current = new Howl({
      src: [quizSound.length && quizSound[3].soundFile],
      volume: audio.backgroundSoundOn ? 1 : 0,
      html5: true,
    });

    audioHowlRef.current.play();
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowUsers(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

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
    nav.push(`/join/quiz/result/${quiz_id}`);
  };
  const image = "/images/userImage.webp";

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
          <div className="select-none bg-[#1B363E] relative sm:bg-cover sm:bg-no-repeat min-h-screen overflow-x-hidden ">
            <Navbar
              startColor="text-white"
              startbg="#1B363E"
              classListData={classListData}
            />
            <div className="w-full mt-[5rem] font-Montserrat flex flex-col justify-center items-center rounded-md relative z-10">
              <div className=" w-full md:w-[57%] ">
                <div className="w-full flex gap-3 rounded-md ">
                  <div
                    className="z-[100] flex items-center justify-start  pl-[18px] lg:pl-0 md:text-4xl cursor-pointer text-yellow400 "
                    onClick={handleResult}
                  >
                    <GoArrowLeft />
                  </div>
                  <h1 className="text-lg flex w-full items-center justify-start  md:text-4xl cursor-pointer font-[Montserrat] text-yellow400">
                    Leaderboard
                  </h1>
                </div>

                {quizLeader.length ? (
                  <div className="flex flex-col justify-center  items-center mt-[6rem] sm:mt-[6rem] mb-[1rem]">
                    <div className="w-full py-[5px]">
                      <div className="flex w-full justify-center items-end text-white">
                        {quizLeader.length >= 2 ? (
                          <div className=" bg-[#2E4950] w-[28%] h-fit py-[.7rem] sm:py-[.5rem] rounded-tl-xl rounded-bl-xl">
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
                              ? "bg-[#2E4950]"
                              : "bg-transparent pt-[5rem]"
                          }  w-[28%] h-fit py-[3rem] pt-[2rem] rounded-t-xl`}
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
                          <div className="bg-[#2E4950] w-[28%] h-fit rounded-tr-xl rounded-br-xl">
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
              <div className="flex flex-col font-Montserrat justify-center items-center mb-[4rem] sm:mb-0 relative z-10">
                <div className="w-[100%] md:w-[57%] cursor-pointer">
                  <table className="w-full border-separate border-spacing-y-3 bg-[#293437] pt-6 px-6 rounded-t-[30px]">
                    <tbody>
                      {quizCurrUser ? (
                        <tr
                          className={` rounded-lg animate__animated animate__zoomIn ${
                            firstRender ? "animate__delay-3s" : ""
                          }   hover:scale-105 transition duration-500  bg-[#006778] `}
                        >
                          <td className="text-white font-[Montserrat] text-base  py-2 px-[0.8rem] text-center rounded-tl-lg rounded-bl-lg">
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
                            (user) => user.user_name !== quizCurrUser?.user_name
                          )
                          .map((user, ind) => (
                            <tr
                              key={ind}
                              className={`rounded-lg animate__animated animate__zoomIn ${
                                firstRender ? "animate__delay-3s" : ""
                              }  hover:scale-105 transition duration-500 bg-[#2E4950]`}
                            >
                              <td className="text-white text-base py-2 pr-1 text-center rounded-tl-lg rounded-bl-lg font-[Montserrat]">
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
          </div>
          <Footer show="hidden sm:block" />
          <Navigation />
        </>
      )}
    </>
  );
};

export default LeaderBoard;
