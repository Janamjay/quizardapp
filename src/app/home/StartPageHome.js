/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import { useNavigate } from "react-router-dom";
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /itemPosition|verticalMode|isRTL/.test(args[0]) ||
    /Support for defaultProps/.test(args[0]) ||
    /React does not recognize the/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    /touchmove|touchstart|Violation|scroll-blocking /.test(args[0]) ||
    /it looks like an unknown prop/.test(args[0])
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
import Footer from "../components/footer/Footer.jsx";
import Carousel from "react-elastic-carousel";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import Navigation from "../components/navigationBar/Navigation";
import back from "/public/images/inputback.jpg";
import axios from "axios";
import DNALoader from "../utils/DNALoader.js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setRoomData } from "@/redux/roomSlice.js";
import { getCookie } from "cookies-next";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 200, itemsToShow: 1.1 },
  { width: 250, itemsToShow: 1.2 },
  { width: 300, itemsToShow: 1.4 },
  { width: 370, itemsToShow: 1.8 },
  { width: 470, itemsToShow: 1.9 },
  { width: 500, itemsToShow: 1.8 },
  { width: 520, itemsToShow: 1.8 },
  { width: 550, itemsToShow: 2.1 },
  { width: 650, itemsToShow: 2.1 },
  { width: 700, itemsToShow: 2.3 },
  { width: 750, itemsToShow: 2.2 },
  { width: 800, itemsToShow: 2.3 },
  { width: 850, itemsToShow: 2.3 },
  { width: 900, itemsToShow: 3 },
  { width: 950, itemsToShow: 3.1 },
  { width: 1000, itemsToShow: 3.5 },
  { width: 1100, itemsToShow: 3.2 },
  { width: 1200, itemsToShow: 4 },
  { width: 1250, itemsToShow: 4 },
  { width: 1350, itemsToShow: 5 },
  { width: 1450, itemsToShow: 5 },
  { width: 1600, itemsToShow: 5.8 },
  { width: 1750, itemsToShow: 6 },
  { width: 1900, itemsToShow: 6.3 },
];
const myArrow = ({ type, onClick, isEdge }) => {
  const pointer =
    type === "PREV" ? (
      <IoIosArrowBack className="icon" />
    ) : (
      <IoIosArrowForward className="icon" />
    );

  const buttonClass = isEdge ? "disabled-button" : "enabled-button";

  return (
    <button
      aria-label="arrow"
      onClick={isEdge ? null : onClick}
      className={buttonClass}
    >
      {pointer}
    </button>
  );
};
const CategorySection = ({
  title,
  posts,
  searchQuery,
  quizData,
  subjectId,
  slug,
  metaTitle,
}) => {
  const nav = useRouter();

  const filteredPosts = posts.filter((post) =>
    post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : ""
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const showArrows = screenWidth > 550;
  function formatTotalPlay(totalPlay) {
    if (totalPlay >= 1000) {
      return (totalPlay / 1000).toFixed(1) + "k";
    } else {
      return totalPlay.toString();
    }
  }
  const handleViewMoreClick = () => {
    localStorage.setItem("subjectTitle", title);
  };
  return (
    <div className="category-section select-none font-Montserrat dark:bg-grey800">
      <div className="flex justify-between items-center  mb-2 w-full gap-3 px-[20px]  md:px-[75px] pt-4">
        <h1 className="text-[18px] w-[70%] md:text-3xl  cursor-pointer font-black text-black dark:text-white font-[Montserrat]">
          {title}
        </h1>
        <button
          aria-label="view more"
          type="button"
          className="text-[#0086b1] dark:text-white bg-[#CCE6EF]
          dark:bg-gray600 rounded-[4px] py-[5px] px-[8px] sm:px-[12px] whitespace-nowrap text-[14px] sm:text-base font-[700] cursor-pointer font-[Montserrat]"
          onClick={handleViewMoreClick}
        >
          <Link href={`/all/${subjectId}/${slug}`}>
            <p>View More</p>
          </Link>
        </button>
      </div>
      <div className="relative flex items-center pr-2 md:px-4 overflow-x-auto ">
        <div className="flex justify-center w-full space-x-3 md:space-x-4 sm:pb-8 pt-1 gap-5 ">
          <Carousel
            breakPoints={breakPoints}
            pagination={false}
            renderArrow={showArrows ? myArrow : null}
            className="text-black dark:text-white"
          >
            {filteredPosts.length > 0
              ? filteredPosts.map((item, index) => (
                  <Link
                    key={index}
                    href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                    className="flex-shrink-0 cursor-pointer "
                  >
                    <div className="bg-[#fff] dark:bg-slate600 rounded-lg  border dark:border-0 border-gray-300 ">
                      <div className="overflow-hidden rounded-t-lg relative">
                        <img
                          className="w-full h-24 sm:h-28 md:h-32 lg:h-40  object-cover hover:scale-105 transition duration-500 "
                          src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                          alt="trending"
                        />
                        <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                          <button
                            aria-label="total questions"
                            className="flex items-center text-[13px]  bg-black py-[3px] px-[5px] rounded-[3px] font-[Montserrat] xs:rounded-md"
                          >
                            <span>{item.total_questions} Qs</span>
                          </button>
                          <button
                            aria-label="total play"
                            className="flex items-center text-[13px]  bg-black py-[3px] px-[5px]  
                          rounded-[3px] font-[Montserrat] xs:rounded-md"
                          >
                            <span>
                              {formatTotalPlay(item.totalPlay)}{" "}
                              {formatTotalPlay(item.totalPlay) > 1
                                ? "Plays"
                                : "Play"}{" "}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-lg w-[200px] sm:w-[250px] text-dimBlack font-semibold flex justify-start items-start dark:text-white">
                        <h4 className=" font-[Montserrat] text-left text-[15px] sm:text-base leading-[1.1rem]">
                          {item.question_set_name}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))
              : quizData.map((item, index) => (
                  <Link
                    key={index}
                    href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                    className="flex-shrink-0 cursor-pointer"
                  >
                    <div
                      className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border 
                    border-gray-300 "
                    >
                      <div className="overflow-hidden rounded-t-lg relative">
                        <img
                          className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover hover:scale-105 transition duration-500"
                          src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                          alt="trending"
                        />
                        <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                          <button
                            aria-label="total questions"
                            className="flex items-center text-[13px] bg-black py-[3px] px-[5px] rounded-[3px] font-[Montserrat] xs:rounded-md"
                          >
                            <span>{item.total_questions} Qs</span>
                          </button>
                          <button
                            aria-label="total play"
                            className="flex items-center text-[13px] bg-black py-[3px] px-[5px] rounded-[3px] font-[Montserrat] xs:rounded-md"
                          >
                            <span>
                              {formatTotalPlay(item.totalPlay)}{" "}
                              {formatTotalPlay(item.totalPlay) > 1
                                ? "Plays"
                                : "Play"}{" "}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-lg w-[200px] text-dimBlack sm:w-[250px] font-semibold flex justify-start items-start dark:text-white">
                        <h4 className="font-[Montserrat] text-left text-[15px] sm:text-base leading-[1.1rem]">
                          {item.question_set_name}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

const StartPage = ({ dashboardData, classListData }) => {
  // const quizData = dashboardData.data;
  // const quizSound = dashboardData.Quiz_Sound;
  const [searchQuery] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [quizSection, setQuizSection] = useState([]);
  const [quizSound, setQuizSound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [code, setCode] = useState("");
  const nav = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenId =getCookie("isUserLoggedIn");
    const userId = getCookie("user_id");
    setTokenId(tokenId);
    setUserId(userId)
    classLists();
  }, []);

  const classLists = async () => {
    try {
      const response = classListData;
      if (tokenId == undefined) {
        const defaultClassId = response.classes[0].sub_course_id;
      }
      fetchData();
    } catch (error) {
      if (error.response && error.response.status == 401) {
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = dashboardData;
      setQuizData(response.data);
      setQuizSound(response.Quiz_Sound);
      setQuizSection(response.data);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    const quizSection = async () => {
      try {
        const response = dashboardData;
        setQuizSection(response.data);
        setLoading(false);
      } catch (error) {}
    };
    quizSection();
  }, [searchQuery]);

  const filterCards = (query) => {
    return quizSection?.filter((card) =>
      card.subject_name.toLowerCase().includes(query.toLowerCase())
    );
  };
  const filteredCards = filterCards(searchQuery);

  // const handleAll = (subject_Id, subject_Name) => {
  //   nav.push(`/all/${subject_Id}/${subject_Name}`);
  // };

  const token = tokenId;
  const userName = "";

  const CodeValidate = async () => {
    if (token) {
      try {
        const response = await fetch("/api/validate_room_code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(code),
        });
        const res = await response.json();
        if (res.data != undefined) {
          const roomData = {
            data: res.data,
            settingData: res.quiz_settings_player,
            soundData: res.Quiz_Sound,
            userId,
            userName,
            // token,
            quizsound: quizSound,
          };
          dispatch(setRoomData(roomData));
          nav.push(`/join/room/roomjoin`);
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: res.message,
          });
          return;
        }
      } catch (err) {}
    } else {
      nav.push(`/login`);
    }
  };

  const handleRoom = () => {
    const codeInput = document.querySelector('input[name="code');

    if (codeInput && codeInput.value.trim() !== "") {
      if (typeof window !== "undefined") {
        CodeValidate();
      }
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please Enter Game Code",
      });
      return;
    }
  };

  const getRandomGradient = () => {
    return `linear-gradient(135deg, rgb(11,	10,	37), rgb(9,8,29))`;
  };
  const inputBackGradient = () => {
    return `linear-gradient(to right, rgb(0,	180,	219), rgb(0,131,176))`;
  };

  return (
    <>
      {loading ? (
        <DNALoader />
      ) : (
        <>
          <div className="select-none font-Montserrat dark:bg-grey800">
            <div className="">
              <div className="-mt-[41px] sm:mt-5 sm:pt-[20px] flex flex-col justify-center items-center w-full pb-0 sm:pb-8  relative bg-cover bg-no-repeat min-h-full">
                <div
                  className="flex justify-center items-center  w-[91%] xl:w-[91%]  sm:h-[21vh]  my-5  rounded-[20px] border-2 border-gray-300 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] bg-bottom py-[8px]"
                  style={{ background: inputBackGradient() }}
                >
                  <div className="w-full sm:w-fit  rounded-md ">
                    <div
                      className=" sm:flex w-full sm:w-fit  justify-center items-center gap-3 px-5 py-3 rounded-[20px] sm:border-[1px] sm:border-yellow400 
                    sm:dark:border-gray-200"
                    >
                      <input
                        className=" placeholder:text-black font-bold block bg-white font-[Montserrat] rounded-md py-3 px-7 shadow-sm focus:outline-none md:text-sm h-[46px] w-full  sm:w-[153px] mb-3 sm:mb-0  md:w-[200px] lg:w-[190px] xl:w-[280px] "
                        placeholder="Enter Game Code"
                        type="number"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                      <button
                        aria-label="join game"
                        onClick={() => handleRoom()}
                        className="relative  sm:text-lg group w-full rounded-md sm:w-[150px]"
                        type="button"
                      >
                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-bold leading-tight text-white rounded-md border-[#2c2c2c] ">
                          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-md bg-[#2c2c2c]"></span>
                          <span className=" bg-[#2c2c2c] "></span>
                          <span className="relative text-sm font-[Montserrat]">
                            Join Game
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div>
                {loading ? (
                  <DNALoader />
                ) : (
                  <div className="px-4 pb-0 sm:pb-11  bg-white dark:bg-grey800">
                    <h1 className="text-center font-black text-3xl sm:text-6xl  sm:pb-8 sm:pt-8 text-transparent bg-clip-text bg-gradient-to-r from-purple400 to-pink600 ">
                      Quiz Section
                    </h1>
                    <div className="flex flex-wrap justify-center pt-6 sm:py-6  sm:px-6 gap-6 overflow-hidden">
                      {searchQuery
                        ? filteredCards.map((card, index) => {
                            if (card.quiz_list.length === 0) {
                              return null;
                            }
                            return (
                              <div
                                key={index}
                                className="bg-white dark:bg-slate600 w-[44%] sm:w-[45%] lg:w-[31%] xl:w-1/5 rounded-lg shadow-md cursor-pointer 
                                overflow-hidden"
                                onClick={() =>
                                  handleAll(card.subject_id, card.subject_name)
                                }
                              >
                                {card.subject_image ? (
                                  <>
                                    <img
                                      src={card.subject_image}
                                      alt={card.subject_name}
                                      className="w-full h-40 object-cover rounded hover:scale-105 transition duration-500"
                                    />
                                    <h2 className="text-lg dark:text-slate100 font-semibold my-4 text-center">
                                      {card.subject_name}
                                    </h2>
                                  </>
                                ) : (
                                  <div
                                    className="w-full h-28 sm:h-40 flex items-center justify-center"
                                    style={{ background: getRandomGradient() }}
                                  >
                                    <h2 className="tex-sm sm:text-2xl text-white px-2 font-semibold text-center">
                                      {card.subject_name}
                                    </h2>
                                  </div>
                                )}
                                 <p className="text-gray600 dark:text-slate100 mt-1 text-center pb-3 px-3">
                                  {card.description}
                                </p> 
                              </div>
                            );
                          })
                        : quizSection?.map((card, index) => {
                            if (card.quiz_list.length === 0) {
                              return null;
                            }
                            return (
                              <div
                                key={index}
                                className="bg-white dark:bg-slate600 w-[44%]  sm:w-[45%] lg:w-[31%] xl:w-1/5 rounded-lg shadow-md cursor-pointer overflow-hidden"
                                onClick={() =>
                                  handleAll(card.subject_id, card.subject_name)
                                }
                              >
                                {card.subject_image ? (
                                  <>
                                    <img
                                      src={card.subject_image}
                                      alt={card.subject_name}
                                      className="w-full h-40 object-cover rounded hover:scale-105 transition duration-500"
                                    />
                                    <h2 className="text-lg dark:text-slate100 font-semibold my-4 text-center">
                                      {card.subject_name}
                                    </h2>
                                  </>
                                ) : (
                                  <div
                                    className="w-full h-28 sm:h-40 flex items-center justify-center"
                                    style={{ background: getRandomGradient() }}
                                  >
                                    <h2 className="tex-sm sm:text-2xl text-white px-2 font-semibold text-center">
                                      {card.subject_name}
                                    </h2>
                                  </div>
                                )}
                                 <h2 className="text-lg dark:text-slate100 font-semibold my-4 text-center">
                                  {card.subject_name}
                                </h2> 
                                 <p className="text-gray600 dark:text-slate100 mt-1 text-center pb-3 px-3">
                                 {card.description}
                                </p> 
                              </div>
                            );
                          })}
                    </div>
                  </div>
                )}
              </div>  */}
              {loading ? (
                <DNALoader />
              ) : (
                <div className=" pb-[5rem] pr-5 xxs:pr-0 ">
                  {quizData?.map((category, index) => {
                    if (category.quiz_list.length === 0) {
                      return null;
                    }
                    return (
                      <CategorySection
                        key={index}
                        title={category.subject_name}
                        posts={category.quiz_list.map(
                          (quiz) => quiz.question_set_name
                        )}
                        searchQuery={searchQuery}
                        // setQuizData={setQuizData}
                        quizData={category.quiz_list}
                        subjectId={category.subject_id}
                        slug={category.subject_title_slug}
                        metaTitle={category.subject_title}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <Footer />
          <Navigation />
        </>
      )}
    </>
  );
};

export default StartPage;
