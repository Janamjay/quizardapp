/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /itemPosition|verticalMode|isRTL/.test(args[0]) ||
    / Failed prop type/.test(args[0])
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
import Footer from "../components/footer/Footer";
import Carousel from "react-elastic-carousel";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Navigation from "../components/navigationBar/Navigation";
import back from "../../../public/images/inputback.jpg";
import DNALoader from "../utils/DNALoader";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import Swal from "sweetalert2";
import { RecoilRoot } from "recoil";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setRoomData } from "@/redux/roomSlice.js";
import { getCookie } from "cookies-next";
import ProviderStore from "@/redux/ProviderStore";

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
      aria-label="arrow icon"
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
  slug,
  subjectId,
}) => {
  const nav = useRouter();

  const filteredPosts = posts.filter((post) =>
    post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    <div className="category-section select-none  dark:bg-grey800">
      <div className="flex justify-between w-full gap-3 mb-2 items-center px-[20px]  md:px-[75px] pt-4">
        <h1
          className="text-[18px] w-[70%] font-black font-[Montserrat] md:text-3xl cursor-pointer  text-black 
        dark:text-white"
        >
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
      <div className="relative flex items-center   pr-2  md:px-4 overflow-x-auto ">
        <div className="flex justify-center w-full space-x-3 md:space-x-4 sm:pb-8  pt-1 gap-5 ">
          <Carousel
            breakPoints={breakPoints}
            pagination={false}
            renderArrow={showArrows ? myArrow : null}
            className="text-black dark:text-white"
          >
            {filteredPosts.length > 0
              ? filteredPosts?.map((item, index) => (
                  <Link
                    key={index}
                    href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                    className="flex-shrink-0 cursor-pointer"
                  >
                    <div className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border border-gray-300 ">
                      <div className="overflow-hidden rounded-t-lg relative">
                        <img
                          className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover hover:scale-105 transition duration-500"
                          src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                          alt="trending"
                        />
                        <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                          <button
                            aria-label="total questions"
                            className="flex items-center text-[13px] bg-black py-[3px] px-[5px] rounded-[3px]  xs:rounded-md font-[Montserrat]"
                          >
                            <span>{item.total_questions} Qs</span>
                          </button>
                          <button
                            aria-label="total plays"
                            className="flex items-center text-[13px] bg-black py-[3px] px-[5px]  rounded-[3px]  xs:rounded-md font-[Montserrat]"
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
                      <div className="px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-lg  w-[200px] sm:w-[250px] font-semibold  text-dimBlack flex justify-start items-start dark:text-white">
                        <h4 className="text-left font-[Montserrat] text-[15px] sm:text-sm lg:text-[15px] leading-[1.1rem]">
                          {item.question_set_name}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))
              : quizData?.map((item, index) => (
                  <Link
                    key={index}
                    href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                    className="flex-shrink-0 cursor-pointer "
                  >
                    <div className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border border-gray-300 ">
                      <div className="overflow-hidden rounded-t-lg relative">
                        <img
                          className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover hover:scale-105 transition duration-500"
                          src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                          alt="trending"
                        />
                        <div className="absolute bottom-[4%]  left-0 right-0 flex justify-between px-2 text-white">
                          <button
                            aria-label="total questions"
                            className="flex items-center text-[13px] sm:text-[14px] bg-black py-[3px] px-[5px] rounded-[3px] xs:rounded-md font-[Montserrat]"
                          >
                            <span>{item.total_questions} Qs</span>
                          </button>
                          <button
                            aria-label="total plays"
                            className="flex items-center text-[13px] sm:text-[14px] bg-black py-[3px] px-[5px]  xs:rounded-md font-[Montserrat]"
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
                      <div className="px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] w-[200px] sm:w-[250px] font-semibold text-dimBlack flex justify-start  items-start dark:text-white">
                        <h4 className="text-left text-[15px] font-[Montserrat] sm:text-sm lg:text-[15px] leading-[1.1rem]">
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
  // const quizData = dashboardData;
  // const quizSound = dashboardData.Quiz_Sound;
  // const loading = false;
  const [searchQuery] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [quizSound, setQuizSound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const nav = useRouter();
  const dispatch = useDispatch();
  const [tokenId, setTokenId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const tokenId = getCookie("isUserLoggedIn");
    const userId = getCookie("user_id");
    setTokenId(tokenId);
    setUserId(userId);
    if (tokenId == undefined) {
      const defaultClassId = classListData.classes[0].sub_course_id;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = dashboardData;
        setQuizData(response.data);
        setQuizSound(response.Quiz_Sound);
        setLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);

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
          nav.push("/join/room/roomjoin");
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
      CodeValidate();
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
  const styleShadow = "text-quizard-style";
  return (
    <ProviderStore>
      <RecoilRoot>
        {loading ? (
          <DNALoader />
        ) : (
          <>
            <Navbar
              startColor="text-white"
              startbg="#06b6d4"
              classListData={classListData}
              shadow={styleShadow}
              // borderBottom={true}
              // searchQuery={searchQuery}
              // setSearchQuery={setSearchQuery}
            />
            <div className=" bg-[#f9f9f9] select-none dark:bg-grey800">
              <div className="">
                <div className="pt-[72px] flex flex-col justify-center items-center w-full  relative bg-cover bg-no-repeat min-h-full">
                  <div
                    className="flex justify-center items-center  w-[91%] xl:w-[91%]  sm:h-[21vh]  my-5  rounded-[20px] border-2 border-gray-300 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] bg-bottom py-[8px] "
                    // style={{
                    //   backgroundImage: `url('/images/inputback.jpg')`,
                    // }}
                    style={{ background: inputBackGradient() }}
                  >
                    <div className="w-full sm:w-fit rounded-md ">
                      <div
                        className=" sm:flex w-full sm:w-fit justify-center items-center gap-3 px-5 py-3 rounded-[20px] sm:border-[1px] sm:border-yellow400 
                    sm:dark:border-gray-200"
                      >
                        <input
                          className=" placeholder:text-black font-bold block font-[Montserrat] bg-white  rounded-md py-3 px-7 shadow-sm focus:outline-none 
                        md:text-sm h-[46px] w-full 
                        sm:w-[153px] mb-3 sm:mb-0  md:w-[200px] lg:w-[190px] xl:w-[280px] "
                          placeholder="Enter Game Code"
                          type="number"
                          name="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                          aria-label="join game"
                          onClick={() => handleRoom()}
                          className="relative  sm:text-lg group w-full font-[Montserrat] rounded-md sm:w-[150px]"
                          type="button"
                        >
                          <span className="relative z-10 block px-5 py-3 overflow-hidden font-bold leading-tight text-white rounded-md border-[#2c2c2c] ">
                            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-md bg-[#2c2c2c]"></span>
                            <span className=" bg-[#2c2c2c] "></span>
                            <span className="relative text-sm">Join Game</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <Footer />
            <Navigation />
          </>
        )}
      </RecoilRoot>
    </ProviderStore>
  );
};

export default StartPage;
