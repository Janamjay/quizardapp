/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /A component is changing an /.test(args[0]) ||
    / Support for defaultProps/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
import Navbar from "@/app/components/navbar/Navbar";
import { GiTrophy } from "react-icons/gi";
import { AiFillCheckCircle, AiFillMinusCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BsShare } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { LiaArrowCircleRightSolid } from "react-icons/lia";
import percent from "/public/images/percent.png";
import clock from "/public/images/clock.png";
import timer from "/public/images/timer.png";
import medal from "/public/images/medal.png";
import coin from "/public/images/coin.png";
import ShareModal from "@/app/components/modal/ShareModal";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRecoilState } from "recoil";
import { useSpring, animated } from "react-spring";
import { audioStateAtom } from "@/atom/audioState";
import { Howl } from "howler";
import back from "/public/images/result.jpg";
import "animate.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { useRouter, useParams } from "next/navigation";
import { userScore } from "@/app/api/service";
import { useDispatch, useSelector } from "react-redux";
import { selectQuizSound, setQuizSound } from "@/redux/audioSlice";
import Image from "next/image";
import Cookies from "js-cookie";
import DNALoader from "@/app/utils/DNALoader.js";
import { GoArrowLeft } from "react-icons/go";
import { setCookie, getCookie, hasCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Result = ({ classListData, resultData, userProfileData }) => {
  const params = useParams();
  const nav = useRouter();
  const quiz_id = params.quiz_id;
  const [question, setQuestion] = useState("");
  // const question_set_name = decodeURIComponent(params.quiz_id[1]);
  const quizSound = useSelector(selectQuizSound);
  const dispatch = useDispatch();
  const [quizData, setQuizData] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioState, setAudioState] = useRecoilState(audioStateAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [confettiProps, setConfettiProps] = useState({
    numberOfPieces: 350,
    width: 0,
    height: 0,
    initialVelocityY: 30,
  });
  const [loading, setLoading] = useState(true);
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    const fetchDataProfile = () => {
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
    fetchDataProfile();
    const question_set_name = Cookies.get("quizName");
    setQuestion(question_set_name);
    const isLoggedIn = getCookie("isUserLoggedIn");
    const fetchData = () => {
      try {
        setQuizData(resultData.data);
        setLoading(false);
        setConfettiProps({
          ...confettiProps,
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setTimeout(() => {
          setIsConfettiActive(false);
        }, 4000);
      } catch (error) {}
    };
    fetchData();
    // if (isLoggedIn) {
    //   fetchData();
    // } else {
    //   nav.push("/");
    // }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalShare = () => {
    setIsModalOpen(true);
  };
  const handleLeader = (quiz_id) => {
    nav.push(`/join/quiz/leaderboard/${quiz_id}`);
    dispatch(setQuizSound(quizSound));
  };
  const handleReview = (quiz_id) => {
    nav.push(`/join/quiz/review/${quiz_id}`);
  };

  const confettiAnimation = useSpring({
    opacity: isConfettiActive ? 1 : 0,
    config: { duration: 1000 },
  });
  // useEffect(() => {
  //   if (audio === null) {
  //     const audioInstance = new Howl({
  //       src: [quizSound.length && quizSound[3].soundFile],
  //       loop: false,
  //       volume: audioState.backgroundSoundOn ? 1 : 0,
  //       html5: true,
  //     });

  //     setAudio(audioInstance);
  //   }

  //   if (audio && audioState.backgroundSoundOn) {
  //     audio.play();
  //   } else if (audio) {
  //     audio.pause();
  //   }

  //   return () => {
  //     if (audio) {
  //       audio.unload();
  //     }
  //   };
  // }, [audio, audioState.backgroundSoundOn]);

  const averageTimeInSeconds = quizData.average_time;
  const minutes = Math.floor(averageTimeInSeconds / 60);
  const seconds = averageTimeInSeconds % 60;

  const timeDisplay =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds} sec`;

  const totalTimeInSeconds = quizData.total_time;
  const totalMinutes = Math.floor(totalTimeInSeconds / 60);
  const totalSeconds = totalTimeInSeconds % 60;

  const totalTimeDisplay =
    totalMinutes > 0
      ? `${totalMinutes}m ${totalSeconds}s`
      : `${totalSeconds} sec`;

  // const shareText = quizData.share_text;
  // const linkRegex = /https?:\/\/[^\s]+/;

  // const linkMatch = shareText?.match(linkRegex);
  // const httpLink = linkMatch?.[0];

  const currentURL = params.quiz_id;
  const redirectURL = Array.isArray(currentURL)
    ? currentURL.join("/")
    : currentURL;

  const shareLink = `Hi 👋, I have scored *${quizData.total_coin_earn}* in *${question}*!!!
  Can you beat my score? *Challenge for you!* 👊 
  ${BASE_URL}quiz/${redirectURL}`;

  const url = `${BASE_URL}quiz/${redirectURL}`;

  const handleDescription = () => {
    nav.push(`/quiz/${redirectURL}`);
  };

  return (
    <>
      <div
        className=" bg-center relative select-none bg-no-repeat bg-cover min-h-screen  overflow-hidden"
        style={{
          backgroundColor: "#1B363E",
        }}
      >
        <Navbar bgColor="#2e302d" classListData={classListData} />
        {isConfettiActive && (
          <animated.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 12121212,
              ...confettiAnimation,
            }}
          >
            <Confetti {...confettiProps} />
          </animated.div>
        )}
        <>
          {loading ? (
            <DNALoader />
          ) : (
            <>
              <div className="w-full font-Montserrat mt-[3.6rem] sm:mt-[4rem]  flex flex-col justify-center items-center rounded-md relative z-10">
                <div className=" w-full md:w-[50%] flex gap-3 mb-[1rem] rounded-md p-[7px]">
                  <div
                    className="text-lg flex items-center justify-start z-[100] pl-[11px] lg:pl-0 md:text-3xl cursor-pointer text-yellow400 font-[400]"
                    onClick={handleDescription}
                  >
                    <GoArrowLeft />
                  </div>
                  <h1 className="text-lg flex w-full  items-center justify-start  md:text-3xl cursor-pointer font-[Montserrat] text-yellow400 ">
                    {question}
                  </h1>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col justify-center  items-center   pb-[5px] relative z-10">
                  <div className="w-full md:w-[50%] shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-lg px-2 py-3">
                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <Image
                              width={23}
                              height={23}
                              src={coin}
                              alt="clock"
                              className="max-w-[23px]  h-[23px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Coin Earned
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat]  font-black">
                              {quizData.total_coin_earn}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInRight  cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <GiTrophy
                              style={{
                                fontSize: "23px",
                                color: "goldenrod",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Your Score
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black">
                              {quizData.user_score}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <AiFillCheckCircle
                              style={{
                                fontSize: "23px",
                                color: "lightgreen",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Correct
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black">
                              {quizData.total_correct}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <MdCancel
                              style={{
                                fontSize: "23px",
                                color: "#ED1C24",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Incorrect
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat]  font-black">
                              {quizData.total_incorrect}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-5 justify-between">
                      <div className="w-[50%]  mb-4 py-[5px] px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <Image
                              width={23}
                              height={23}
                              src={percent}
                              alt="percent"
                              className="max-w-[23px]  h-[23px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Percentage
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black">
                              {quizData.percentage} %
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <Image
                              width={23}
                              height={23}
                              src={clock}
                              alt="clock"
                              className="max-w-[23px]  h-[23px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] xs:text-[14px] font-[Montserrat]">
                              Time Spent
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black">
                              {totalTimeDisplay}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-5 justify-between ">
                      <div className="w-[50%]  mb-4 py-[5px] px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInLeft cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <AiFillMinusCircle
                              style={{
                                fontSize: "23px",
                                color: " #ED1C24",
                              }}
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Unattempted
                            </p>
                            <p className="text-left text-[18px]  font-[Montserrat] font-black">
                              {quizData.unattemped_question}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[50%] py-[5px] mb-4 px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInRight cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[10%] mr-6 md:mr-3">
                            <Image
                              height={23}
                              width={23}
                              src={timer}
                              alt="timer"
                              className="max-w-[23px]  h-[23px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Time/Ques
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black">
                              {timeDisplay}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[100%] py-[5px] px-[5px] sm:px-[10px]  rounded-lg bg-[#2E4950] text-white animate__animated animate__fadeInUpBig cursor-pointer">
                        <div className="flex w-full items-center">
                          <div className="w-[4%] mr-6 md:mr-3">
                            <Image
                              height={23}
                              width={23}
                              src={medal}
                              alt="medal"
                              className="max-w-[23px]  h-[23px]"
                            />
                          </div>
                          <div className="w-[80%]">
                            <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                              Live Rank
                            </p>
                            <p className="text-left text-[18px] font-[Montserrat] font-black ">
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
                    <div className="w-full md:w-[50%] mb-2 p-1.5 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-lg">
                      <div className="flex w-full gap-5 justify-between">
                        <div className="w-[50%]  mb-4 py-[7px] sm:py-[12px] px-[10px] sm:px-[10px]  rounded-lg bg-[#0083ac] text-white  animate__animated animate__fadeInLeft cursor-pointer">
                          <div
                            className="flex w-full justify-between items-center"
                            onClick={openModalShare}
                          >
                            <div className="w-[80%]">
                              <p className="text-left text-[12px] xs:text-[14px] font-[Montserrat]">
                                Share Score
                              </p>
                            </div>
                            <div className="w-[10%] sm:w-[8%] ">
                              <BsShare
                                style={{
                                  fontSize: "15px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <ShareModal isOpen={isModalOpen} onClose={closeModal}>
                          <div>
                            <h1 className="font-black text-[12px] font-[Montserrat] xs:text-[14px] dark:text-white">
                              Share
                            </h1>

                            <div className="flex justify-center gap-7 mt-[1rem]">
                              <FacebookShareButton
                                url={shareLink}
                                // quote={"My Quiz Score on Quizard"}
                                hashtag={"#quizard..."}
                              >
                                <FacebookIcon size={30} round={true} />
                              </FacebookShareButton>

                              <WhatsappShareButton
                                url={shareLink}
                                // quote={"My Quiz Score on Quizard "}
                                hashtag={"#quizard..."}
                              >
                                <WhatsappIcon size={30} round={true} />
                              </WhatsappShareButton>
                              <EmailShareButton
                                url={shareLink}
                                // quote={"My Quiz Score on Quizard "}
                                hashtag={"#quizard..."}
                              >
                                <EmailIcon size={30} round={true} />
                              </EmailShareButton>
                              <TwitterShareButton
                                url={shareLink}
                                // quote={"My Quiz Score on Quizard "}
                                hashtag={"#quizard..."}
                              >
                                <TwitterIcon size={30} round={true} />
                              </TwitterShareButton>
                              <TelegramShareButton
                                url={shareLink}
                                // quote={"My Quiz Score on Quizard "}
                                hashtag={"#quizard..."}
                              >
                                <TelegramIcon size={30} round={true} />
                              </TelegramShareButton>
                            </div>
                            <div className="tracking-[1px] relative">
                              <input
                                type="text"
                                value={url}
                                placeholder=""
                                readOnly
                                className="my-[1rem] pl-[1rem] pr-[3.5rem] py-[0.3rem] border rounded-lg w-[100%] h-[6vh]"
                              />
                              <CopyToClipboard text={url} onCopy={onCopyText}>
                                <button
                                  aria-label="copy"
                                  className="absolute top-1/2 right-[0.5rem] transform -translate-y-[30px] p-[0.3rem] border rounded-3xl bg-rose200 font-[Montserrat]"
                                >
                                  Copy
                                </button>
                              </CopyToClipboard>
                              <h1
                                className={`copy-feedback text-center font-[Montserrat] ${
                                  isCopied ? "active" : ""
                                }`}
                              >
                                Copied!
                              </h1>
                            </div>
                          </div>
                        </ShareModal>
                        <div
                          className="w-[50%]  py-[7px] sm:py-[12px] mb-4 px-[10px] sm:px-[10px]  rounded-lg bg-[#0083ac] text-white  animate__animated animate__fadeInRight cursor-pointer"
                          onClick={() => handleReview(quiz_id)}
                        >
                          <div className="flex w-full justify-between items-center">
                            <div className="w-[120%]">
                              <p className="text-left text-[12px] font-[Montserrat] xs:text-[14px]">
                                Review Questions
                              </p>
                            </div>
                            <div className="w-[8%] ">
                              <IoIosArrowForward
                                style={{
                                  fontSize: "15px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-between">
                        <div
                          className="w-[100%] py-[7px] sm:py-[12px] px-[16px] sm:px-[5px]  rounded-lg bg-[#0083ac] text-white animate__animated animate__fadeInUpBig cursor-pointer"
                          onClick={() => handleLeader(quiz_id)}
                        >
                          <div className="flex w-full justify-evenly items-center">
                            <div className="w-[95%]">
                              <p className="text-center text-[13px] font-[Montserrat] xs:text-[15px] ml-0 lg:ml-5px">
                                Leaderboard
                              </p>
                            </div>
                            <div className="w-[3%] ">
                              <LiaArrowCircleRightSolid
                                style={{
                                  fontSize: "17px",
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
            </>
          )}
        </>
      </div>
    </>
  );
};

export default Result;
