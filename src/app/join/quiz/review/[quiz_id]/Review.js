/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /validateDOMNesting|cannot appear as a descendant of/.test(args[0]) ||
    /React does not recognize the/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (/was detected as/.test(args[0])) {
    return;
  }
  originalConsoleWarn(...args);
};
import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiFillCheckCircle, AiFillMinusCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import FooterSmall from "@/app/components/footer/FooterSmall";
import Navbar from "@/app/components/navbar/Navbar";
import coin from "/public/images/coin.png";
import clock from "/public/images/clock.png";
import Back from "@/app/components/back/Back";
import Navigation from "@/app/components/navigationBar/Navigation";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import DNALoader from "@/app/utils/DNALoader.js";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useParams, useRouter } from "next/navigation";
import { quizSolution } from "@/app/api/service";
import Image from "next/image";
import DOMPurify from "dompurify";
import { GoArrowLeft } from "react-icons/go";
import { setCookie, getCookie, hasCookie } from "cookies-next";

const Review = ({ classListData, quizSolutions, userProfileData }) => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const nav = useRouter();
  const quiz_id = params.quiz_id;

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
    const isLoggedIn = getCookie("isUserLoggedIn");
    const fetchData = async () => {
      try {
        // const res = await quizSolution({ quiz_id });
        const res = quizSolutions;
        setQuizData(res.Question);
        setLoading(false);
      } catch (error) {}
    };
    if (isLoggedIn) {
      fetchData();
    } else {
      nav.push("/");
    }
  }, []);

  const [openItems, setOpenItems] = React.useState(
    Array(quizData.length).fill(false)
  );

  const handleOpen = (index) => {
    const newOpenItems = [...openItems];
    newOpenItems[index] = !newOpenItems[index];
    setOpenItems(newOpenItems);
  };
  const handleResult = () => {
    nav.push(`/join/quiz/result/${quiz_id}`);
  };
  return (
    <>
      {loading ? (
        <DNALoader />
      ) : (
        <>
          <div className="overflow-y-hidden">
            <Back />
            <Navbar bgColor="#2e302d" classListData={classListData} />
            <div className="w-full font-Montserrat mt-[3.6rem] sm:mt-[4rem]  flex flex-col justify-center items-center rounded-md relative z-10">
              <div className=" w-full md:w-[79%] flex rounded-md gap-3">
                <div
                  className="text-lg flex items-center justify-start z-[100] pl-[17px] lg:pl-0 md:text-4xl cursor-pointer text-yellow400 font-[400]"
                  onClick={handleResult}
                >
                  <GoArrowLeft />
                </div>
                <h1 className="text-lg flex w-full items-center justify-start  md:text-4xl cursor-pointer font-[Montserrat] text-yellow400">
                  Review Question
                </h1>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full md:w-[80%] p-4">
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 1025: 2 }}
                >
                  <Masonry columnsCount={2} gutter="10px">
                    {quizData.map((question, index) => (
                      <div key={index} className="w-full  ">
                        <div className="bg-grey800 rounded-lg shadow-lg p-4">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex">
                              <p className="text-[17px] md:text-xl font-[Montserrat] text-white font-semibold ">
                                Ques {index + 1}:
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {
                                <React.Fragment key={index}>
                                  {question.given_answer == question.answer ? (
                                    <>
                                      <AiFillCheckCircle
                                        data-tooltip-id="my-tooltip-2"
                                        style={{
                                          fontSize: "27px",
                                          color: "lightgreen",
                                          marginTop: "8px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <ReactTooltip
                                        id="my-tooltip-2"
                                        place="bottom"
                                        content="Correct"
                                      />
                                      <button
                                        aria-label="time spent"
                                        className="flex gap-1 border-2 font-[Montserrat] bg-grey800 border-white p-[7px] rounded-lg"
                                      >
                                        <Image
                                          width={20}
                                          height={20}
                                          src={clock}
                                          alt="time"
                                          className="max-w-[20px] mt-[2px]  h-[20px]"
                                        />
                                        <p className="text-white font-[Montserrat] text-[16px]">
                                          {question.time_spent} s
                                        </p>
                                      </button>
                                      <button
                                        aria-label="score"
                                        type="button"
                                        className="text-xl text-yellow400 font-[Montserrat] bg-grey800 border-2 border-white h-[43px] p-2 rounded-lg flex items-center gap-1 "
                                      >
                                        <Image
                                          width={20}
                                          height={20}
                                          src={coin}
                                          alt=""
                                          className="w-[20px] font-[Montserrat]"
                                        />
                                        <p className="font-[Montserrat] text-[16px]">
                                          {4}
                                        </p>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <MdCancel
                                        data-tooltip-id="my-tooltip-1"
                                        style={{
                                          fontSize: "27px",
                                          color: "#ED1C24",
                                          marginTop: "8px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <ReactTooltip
                                        id="my-tooltip-1"
                                        place="bottom"
                                        content="Incorrect"
                                      />
                                      <button
                                        aria-label="time spent"
                                        className="flex gap-1 border-2 font-[Montserrat] bg-grey800 border-white p-[7px]  rounded-lg"
                                      >
                                        <Image
                                          width={20}
                                          height={20}
                                          src={clock}
                                          alt="time"
                                          className="max-w-[20px] mt-[2px]  h-[20px]"
                                        />
                                        <p className="text-white font-[Montserrat] text-[16px]">
                                          {question.time_spent} s
                                        </p>
                                      </button>
                                      <button
                                      aria-label="score"
                                        type="button"
                                        className="text-xl text-yellow-400 border-2 bg-grey800 border-white h-[43px] p-2 rounded-lg flex items-center gap-1 "
                                      >
                                        <Image
                                          width={20}
                                          height={20}
                                          src={coin}
                                          alt=""
                                          className="w-[20px] "
                                        />
                                        <p className="font-[Montserrat] text-[16px]">
                                          {0}
                                        </p>
                                      </button>
                                    </>
                                  )}
                                </React.Fragment>
                              }
                              {question.given_answer == null && (
                                <>
                                  <AiFillMinusCircle
                                    data-tooltip-id="my-tooltip-3"
                                    style={{
                                      fontSize: "27px",
                                      color: "#ED1C24",
                                      marginTop: "8px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <ReactTooltip
                                    id="my-tooltip-3"
                                    place="bottom"
                                    content="UnAttempted"
                                  />
                                  <button aria-label="time spent" className="flex gap-1 border-2 font-[Montserrat] bg-grey800 border-white p-[7px] rounded-lg ">
                                    <Image
                                      width={20}
                                      height={20}
                                      src={clock}
                                      alt="time"
                                      className="max-w-[20px] mt-[2px]  h-[20px]"
                                    />
                                    <p className="text-white font-[Montserrat] text-[16px]">
                                      {question.time_spent} s
                                    </p>
                                  </button>
                                  <button
                                  aria-label="score"
                                    type="button"
                                    className="text-xl text-yellow400 border-2 bg-grey800 border-white h-[43px] p-2 
                                    rounded-lg flex 
                                    items-center gap-1 font-[Montserrat]"
                                  >
                                    <Image
                                      width={20}
                                      height={20}
                                      src={coin}
                                      alt=""
                                      className="w-[20px] font-[Montserrat]"
                                    />
                                    <p className="font-[Montserrat]">{0}</p>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="pt-4 text-white">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  question.question_name.replace(
                                    /\\\((.*?)\\\)/g,
                                    (match, mathExpression) => {
                                      try {
                                        return katex.renderToString(
                                          mathExpression,
                                          {
                                            throwOnError: false,
                                          }
                                        );
                                      } catch (error) {
                                        return match;
                                      }
                                    }
                                  )
                                ),
                              }}
                            />
                          </div>
                          {/* <div className="flex justify-center rounded-lg">
                      <img
                        src={question.question.image}
                        alt=""
                        className="max-w-[20%] h-auto my-2 rounded-lg "
                      />
                    </div> */}
                          <p className="text-white font-semibold font-[Montserrat] mb-[1.5rem] my-3 sm:mb-2 ">
                            Options:
                          </p>
                          <ul
                            className={`flex flex-wrap justify-center gap-[13px] ${
                              question.options.some((option) => option.image)
                                ? "flex-row  "
                                : "flex-col  items-center"
                            }`}
                          >
                            {question.options.map((option, optionIndex) => {
                              const isCorrectOption =
                                question.answer == option.id;
                              const isSelectedOption =
                                question.given_answer !== "" &&
                                question.given_answer == option.id;
                              const bgColorClass = isCorrectOption
                                ? "correct"
                                : isSelectedOption
                                ? "incorrect"
                                : "not-selected";

                              const widthStyle = question.options.some(
                                (option) => option.image
                              )
                                ? "w-[46%] xl:w-[38%]"
                                : "w-full sm:w-[90%]";

                              return (
                                <li
                                  key={optionIndex}
                                  className={`relative ${widthStyle} rounded-lg py-3 sm:pt-3 sm:pb-[0.85rem]   border-2  border-white  ${
                                    isCorrectOption
                                      ? " border-green-500"
                                      : isSelectedOption
                                      ? " border-red-500"
                                      : ""
                                  }`}
                                >
                                  <div
                                    className={`flex flex-col items-center ${
                                      option.image
                                        ? "image-available "
                                        : "image-not-available"
                                    }`}
                                  >
                                    {option.image && (
                                      <Image
                                        width={20}
                                        height={20}
                                        src={option.image}
                                        alt=""
                                        className="w-[10vw] sm:w-[5vw] rounded-lg "
                                      />
                                    )}
                                    <div className="text-white">
                                      <div className="w-full ">
                                        <div
                                          className={`text-sm  ${
                                            option.image
                                              ? "max-w-[10rem] py-2 text-center"
                                              : "max-w-[100%]  sm:pr-2 sm:flex justify-start  h-fit items-center"
                                          }`}
                                        >
                                          <p className="flex justify-center items-center h-fit">
                                            <p className="relative mt-[-5px]">
                                              <span
                                                className={`custom-list  ${
                                                  option.image
                                                    ? "custom-list"
                                                    : "custom-list-image-not-available"
                                                } ${bgColorClass}`}
                                              ></span>
                                            </p>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                  option.value.replace(
                                                    /\\\((.*?)\\\)/g,
                                                    (match, mathExpression) => {
                                                      try {
                                                        return katex.renderToString(
                                                          mathExpression,
                                                          {
                                                            throwOnError: false,
                                                          }
                                                        );
                                                      } catch (error) {
                                                        return match;
                                                      }
                                                    }
                                                  )
                                                ),
                                              }}
                                            />
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {option.id == question.answer ? (
                                    isCorrectOption ? (
                                      <button aria-label="correct answer" className="absolute top-[-8px] sm:top-[-12px] font-[Montserrat] font-semibold right-[34px] px-[3px] text-[12px] sm:text-sm text-green-500 bg-grey800 ">
                                        Correct Answer
                                      </button>
                                    ) : (
                                      <button aria-label="your answer" className="absolute top-[-8px] sm:top-[-12px] font-[Montserrat] font-semibold right-[34px] px-[3px] text-[12px] sm:text-sm text-green-500 bg-grey800 ">
                                        Your Answer
                                      </button>
                                    )
                                  ) : isSelectedOption &&
                                    option.id == question.given_answer ? (
                                    <button aria-label="your answer" className="absolute top-[-8px] sm:top-[-13px] font-semibold  right-[34px] px-[3px] text-[12px] font-[Montserrat] sm:text-sm text-red-500 bg-grey800  ">
                                      Your Answer
                                    </button>
                                  ) : null}
                                </li>
                              );
                            })}
                          </ul>
                          {question.e_answer_describe === null ? (
                            ""
                          ) : (
                            <div className="flex justify-between items-center w-full pt-2 ">
                              <Accordion
                                open={openItems[index]}
                                icon={
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className={`${
                                      openItems[index] ? "rotate-180" : ""
                                    } h-5 w-5 transition-transform`}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                }
                              >
                                <AccordionHeader
                                  onClick={() => handleOpen(index)}
                                  className="text-white text-[16px] font-[Montserrat] solution hover:text-white border-0 border-grey800"
                                >
                                  Solution :
                                </AccordionHeader>
                                <AccordionBody className="text-white solution text-sm sm:text-base font-[Montserrat]">
                                  {/* {ReactHtmlParser(question.e_answer_describe)} */}
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        question.e_answer_describe.replace(
                                          /\\\((.*?)\\\)/g,
                                          (match, mathExpression) => {
                                            try {
                                              return katex.renderToString(
                                                mathExpression,
                                                {
                                                  throwOnError: false,
                                                }
                                              );
                                            } catch (error) {
                                              return match;
                                            }
                                          }
                                        )
                                      ),
                                    }}
                                  />
                                </AccordionBody>
                              </Accordion>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              </div>
            </div>
            <FooterSmall />
            <Navigation/>
          </div>
        </>
      )}
    </>
  );
};

export default Review;
