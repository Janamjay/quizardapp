/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useParams, useRouter, usePathname } from "next/navigation";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import Navigation from "../../components/navigationBar/Navigation";
import { useState, useEffect } from "react";
import DNALoader from "../../utils/DNALoader";
import Image from "next/image";
import { quizDetails, chapterList, chapterDetails } from "@/app/api/service";
import Link from "next/link";
import OvalLoader from "@/app/utils/OvalLoader";

export default function ViewAll({ classListData, quizDetail, chapterLists }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@dotlottie/player-component");
    }
  }, []);
  const params = useParams();
  const pathname = usePathname();
  const subjectId = params.quiz_id[0];
  // const subjectName = decodeURIComponent(params.quiz_id[1]);
  const [quizData, setQuizData] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [quizDataTopic, setQuizDataTopic] = useState([]);
  const [searchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewData, setViewData] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [chapterListData, setChapterListData] = useState([]);
  const [page, setPage] = useState(1);
  const [detailPageNumber, setDetailPageNumber] = useState(1);
  const [chapterListDetailCalled, setChapterListDetailCalled] = useState(true);
  const nav = useRouter();

  const chapterListName = () => {
    try {
      const response = chapterLists;
      setChapterListData(response.chapter_list);
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      setLoadingMore(true);
      const response = quizDetail;
      setQuizData([...quizData, ...response.Subject_by_quiz]);
      if (response.Subject_by_quiz.length < 10) {
        setViewData(false);
      } else {
        setViewData(true);
      }
      setPage(page + 1);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      setLoadingMore(false);
      // console.log(error);
    }
  };
  const fetchPaginationData = async () => {
    try {
      setLoadingMore(true);
      const myVariable = { subjectId, page };

      const viewAllResponse = await fetch("/api/view_all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myVariable }),
      });
      const response = await viewAllResponse.json();
      setQuizData([...quizData, ...response.Subject_by_quiz]);
      if (response.Subject_by_quiz.length < 10) {
        setViewData(false);
      } else {
        setViewData(true);
      }
      setPage(page + 1);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      setLoadingMore(false);
      // console.log(error);
    }
  };
  const chapterListDetail = async (chapterId, type) => {
    setLoading(true);
    try {
      const myVariable = { subjectId, chapterId, type, detailPageNumber };

      const chapterDetailsResponse = await fetch("/api/view_all_by_chapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myVariable }),
      });
      const response = await chapterDetailsResponse.json();
      // console.log(response);
      type == 0
        ? setDetailPageNumber(2)
        : setDetailPageNumber(detailPageNumber + 1);
      type == 0
        ? setQuizDataTopic(response.Subject_by_quiz)
        : setQuizDataTopic([...quizDataTopic, ...response.Subject_by_quiz]);
      if (response.Subject_by_quiz.length < 10) {
        setViewData(false);
        setLoading(false);
      } else {
        setViewData(true);
        setLoading(false);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      setQuizDataTopic([]);
      setLoadingMore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subjectName = localStorage.getItem("subjectTitle");
      setSubjectName(subjectName);
    }
    fetchData();
    chapterListName();
  }, []);

  const filteredPosts = quizData.filter((post) =>
    post.question_set_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredChapterPosts = quizDataTopic.filter((post) =>
    post.question_set_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatTotalPlay(totalPlay) {
    if (totalPlay >= 1000) {
      return (totalPlay / 1000).toFixed(1) + "k";
    } else {
      return totalPlay.toString();
    }
  }

  const handleMore = () => {
    fetchPaginationData();
  };
  const handleMoreData = () => {
    let type = 1;
    chapterListDetail(chapterId, type);
  };

  const handleChangeTopic = (event) => {
    setQuizDataTopic([]);
    setDetailPageNumber(0);
    const selectedChapterId = event.target.value;

    setChapterId(selectedChapterId);
    const selectedChapter = chapterListData.find(
      (chapter) => chapter.chapter_id === selectedChapterId
    );
    let type = 0;
    setChapterName(selectedChapterId);
    setLoading(false);
    chapterListDetail(selectedChapterId, type);
    setChapterListDetailCalled(false);
  };
  return (
    <>
      <>
        <Navbar
          startColor="text-white"
          startbg="#06b6d4"
          path={pathname}
          classListData={classListData}
          // borderBottom={true}
        />

        <div className="w-full pt-[72px] bg-white min-h-screen select-none font-[Montserrat] dark:bg-grey800">
          <div className="block px-[1.5rem] py-3  md:flex justify-between items-center sm:px-[2.2rem] lg:px-[5.2rem]">
            <h1 className="pb-3  md:py-0 text-[17px] text-center sm:text-left sm:text-xl md:text-3xl font-black text-transparent bg-clip-text bg-black dark:bg-white font-[Montserrat]">
              All Quizzes in {subjectName}
            </h1>
            {chapterListData.length > 0 ? (
              <div className="mb-5 md:mb-0 border-[1px] p-1 border-black dark:border-white rounded-lg">
                <select
                  id="classDropdown"
                  value={chapterName}
                  onChange={handleChangeTopic}
                  className="text-xl hover:font-bold font-[Montserrat] w-full truncate dark:text-white cursor-pointer bg-inherit border-0 outline-none"
                >
                  <option value="">Select Topic</option>
                  {chapterListData.map((chapter) => (
                    <option
                      key={chapter.chapter_id}
                      value={chapter.chapter_id}
                      className="font-[Montserrat] dark:text-black truncate"
                    >
                      {chapter.chapter_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          {loading ? (
            <div className="w-full flex justify-center">
              <OvalLoader />
            </div>
          ) : (
            <>
              <div className=" sm:px-[2.2rem] lg:px-[5.2rem]  pb-[1rem]  w-full ">
                <div className="grid">
                  {chapterListDetailCalled ? (
                    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
                      {filteredPosts.length > 0
                        ? filteredPosts.map((item, index) => (
                            <Link
                              key={index}
                              className=" px-[1.5rem] sm:px-0 "
                              href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                            >
                              <div
                                className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border 
                    border-gray-300"
                              >
                                <div className="overflow-hidden rounded-t-lg relative">
                                  <img
                                    className="w-full h-32 md:h-32 lg:h-40 object-cover hover:scale-105 transition duration-500"
                                    src= {item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                                    alt="trending"
                                  />
                                  <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                                    <button
                                      aria-label="question count"
                                      className="flex font-[Montserrat] items-center text-[14px] bg-black py-[3px] px-[5px]  rounded-[3px] xs:rounded-md"
                                    >
                                      <span>{item.total_questions} Qs</span>
                                    </button>
                                    <button
                                      aria-label="total plays"
                                      className="flex font-[Montserrat] items-center text-[14px] bg-black py-[3px] px-[5px]  rounded-[3px]  xs:rounded-md"
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
                                <div className=" px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-lg w-full text-dimBlack dark:text-white font-semibold flex  sm:justify-left  items-start">
                                  <h4 className="text-left font-[Montserrat]  text-[16px] font-bold  sm:text-base leading-[1.1rem]">
                                    {item.question_set_name}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          ))
                        : quizData.map((item, index) => (
                            <Link
                              key={index}
                              className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5 gap-4 px-[1.5rem] sm:px-0 "
                              href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                            >
                              <div
                                className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border 
                    border-gray-300"
                              >
                                <div className="overflow-hidden rounded-t-lg relative w-full">
                                  <img
                                    className="w-full h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover hover:scale-105 transition duration-500"
                                    src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                                    alt="trending"
                                  />
                                  <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                                    <button
                                      aria-label="question count"
                                      className="flex items-center text-[14px] sm:text-[14px] bg-black
                                     py-[3px] px-[5px] font-[Montserrat]  rounded-[3px] xs:rounded-md"
                                    >
                                      <span>{item.total_questions} Qs</span>
                                    </button>
                                    <button
                                      aria-label="total plays"
                                      className="flex items-center text-[14px] sm:text-[14px] bg-black py-[3px] px-[5px] font-[Montserrat]  rounded-[3px]  xs:rounded-md"
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
                                <div className=" px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-dimBlack dark:text-white text-lg w-full  font-semibold flex justify-left items-start">
                                  <h4 className="text-left font-[Montserrat] text-base leading-[1.1rem]">
                                    {item.question_set_name}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5 gap-4">
                      {filteredChapterPosts.length > 0
                        ? filteredChapterPosts.map((item, index) => (
                            <Link
                              key={index}
                              className=" gap-4 px-[1.5rem] sm:px-0 "
                              href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                            >
                              <div
                                className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border 
                    border-gray-300"
                              >
                                <div className="overflow-hidden rounded-t-lg relative">
                                  <img
                                    className="w-full h-32  md:h-32 lg:h-40 object-cover hover:scale-105 transition duration-500"
                                    src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                                    alt="trending"
                                  />
                                  <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                                    <button
                                      aria-label="question count"
                                      className="flex items-center font-[Montserrat] text-[14px] bg-black py-[3px] px-[5px]  rounded-[3px] xs:rounded-md"
                                    >
                                      <span>{item.total_questions} Qs</span>
                                    </button>
                                    <button
                                      aria-label="total plays"
                                      className="flex items-center font-[Montserrat] text-[14px] bg-black py-[3px] px-[5px]  rounded-[3px]  xs:rounded-md"
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
                                <div className=" px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-lg w-full text-dimBlack  dark:text-white font-semibold flex  sm:justify-left  items-start">
                                  <h4 className="text-left font-[Montserrat] text-[16px] font-bold  sm:text-base leading-[1.1rem]">
                                    {item.question_set_name}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          ))
                        : quizDataTopic && quizDataTopic.length > 0
                        ? quizDataTopic.map((item, index) => (
                            <Link
                              key={index}
                              className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-4 px-[1.5rem] sm:px-0 "
                              href={`/quiz/${item.quizze_id}/${item.quiz_title_slug}`}
                            >
                              <div
                                className="bg-[#fff] dark:bg-slate600 rounded-lg dark:border-0 border 
                    border-gray-300"
                              >
                                <div className="overflow-hidden rounded-t-lg relative w-full">
                                  <img
                                    className="w-full h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover hover:scale-105 transition duration-500"
                                    src={item.quizbannerimg ? item.quizbannerimg  : "/images/ScienceQuiz.png"}
                                    alt="trending"
                                  />
                                  <div className="absolute bottom-[4%] left-0 right-0 flex justify-between px-2 text-white">
                                    <button
                                      aria-label="question count"
                                      className="flex items-center text-[14px] sm:text-[14px] bg-black py-[3px] font-[Montserrat] px-[5px]  rounded-[3px] xs:rounded-md"
                                    >
                                      <span>{item.total_questions} Qs</span>
                                    </button>
                                    <button
                                      aria-label="total plays"
                                      className="flex items-center text-[14px] sm:text-[14px] bg-black py-[3px] px-[5px] font-[Montserrat]  rounded-[3px]  xs:rounded-md"
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
                                <div className=" px-[10px] py-2 min-h-[3rem] sm:min-h-[4rem] text-dimBlack dark:text-white text-lg w-full  font-semibold flex justify-left items-start">
                                  <h4 className="text-left text-base font-[Montserrat] leading-[1.1rem]">
                                    {item.question_set_name}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          ))
                        : quizDataTopic &&
                          quizDataTopic.length == 0 && (
                            <div className="w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5">
                              <div className="flex justify-center items-center w-full pl-[20px]">
                                {typeof window !== "undefined" && (
                                  <dotlottie-player
                                    src="/animations/GJCmsFqCnq.json"
                                    background="transparent"
                                    speed="1"
                                    style={{ width: "300px", height: "300px" }}
                                    direction="1"
                                    mode="normal"
                                    loop
                                    autoplay
                                  ></dotlottie-player>
                                )}
                              </div>
                              <p className="text-xl font-[Montserrat] sm:text-2xl dark:text-white grid w-full justify-center">
                                Quiz will be available soon...
                              </p>
                            </div>
                          )}
                    </div>
                  )}
                </div>
              </div>
              {chapterListDetailCalled ? (
                <div className="">
                  {viewData ? (
                    <div className="flex justify-center w-full py-8">
                      {loadingMore ? (
                        <div className="w-full flex justify-center h-[3vh] max-h-[3vh]">
                          <OvalLoader />
                        </div>
                      ) : (
                        <p
                          onClick={handleMore}
                          className="text-[#0086b1] dark:text-white bg-[#CCE6EF]
                          dark:bg-gray600 rounded-[4px] py-[5px] px-[8px] sm:px-[12px] cursor-pointer whitespace-nowrap text-[14px] font-[Montserrat] sm:text-base font-[700]"
                        >
                          Load More
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  {quizDataTopic && quizDataTopic.length > 0 ? (
                    <div className="">
                      {viewData ? (
                        <div className="flex justify-center w-full py-8 ">
                          {loadingMore ? (
                            <div className="w-full flex justify-center h-[3vh] max-h-[3vh]">
                              <OvalLoader />
                            </div>
                          ) : (
                            <p
                              onClick={handleMoreData}
                              className="text-[#0086b1] dark:text-white bg-[#CCE6EF]
                              dark:bg-gray600 rounded-[4px] py-[5px] px-[8px] sm:px-[12px] whitespace-nowrap font-[Montserrat] text-[14px] sm:text-base font-[700] cursor-pointer"
                            >
                              Load More
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
        <Footer />
        <Navigation />
      </>
    </>
  );
}
