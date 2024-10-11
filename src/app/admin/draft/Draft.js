/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import {
  IoMdAddCircleOutline,
  IoMdClose,
  IoIosSettings,
  IoIosList,
  IoMdTime,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import { RiPencilFill, RiRoadMapLine } from "react-icons/ri";
import { CiPlay1, CiCirclePlus } from "react-icons/ci";
import { BiSolidEdit } from "react-icons/bi";
import { PiGraduationCapDuotone, PiSignOutThin } from "react-icons/pi";
import { BsBullseye } from "react-icons/bs";
import { MdBook, MdDelete } from "react-icons/md";
import { FaBars, FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import QuizData from "@/app/components/coursal/QuizData";
import dummyQuestions from "@/app/utils/dummyquestions";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Draft = ({ userName }) => {
  const nav = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(true);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [user, setUser] = useState("");
  const [name, setName] = useState("Untitled Quiz");

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const user_Name = userName;
    setUser(user_Name);
  }, []);

  const createQuiz = () => {
    nav.push("/admin/createquiz");
  };
  const handleContinueEditing = () => {
    nav.push("/admin/createquiz");
  };
  const handleDeleteDraft = () => {
    nav.push("/admin");
  };
  const handleShowAnswers = () => {
    setHideAnswers(!hideAnswers);
  };
  const handleEditTitle = () => {
    setEditTitle(false);
  };
  const handleSaveTitle = () => {
    setEditTitle(true);
  };
  const handlelogOut = async () => {
    const logoutResponse = await fetch("/api/logout_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await logoutResponse.json();
    if (res.success) {
      nav.push("/");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: res.message,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div>
      <div className="w-full flex">
        <div
          className={`min-h-screen border-2 px-5 border-r-gray-400 ${
            isMenuOpen ? "block w-[35%] " : "hidden lg:block w-[12%] "
          }`}
        >
          <h1 className="text-xl sm:text-4xl font-bold cursor-pointer font-Lollipop text-quizard-style pt-2 pb-[1rem]  flex items-center justify-start text-cyan500">
            <Link href="/">Quizard</Link>
          </h1>
          <ul className="flex flex-col items-start ">
            <li className="mb-4">
              <button
                aria-label="create quiz"
                type="button"
                className="flex items-center gap-1 justify-center px-7 py-2 text-lg font-semibold mb-1 h-10 text-white bg-[#8554c0] hover:bg-[#a574c8]  rounded-lg min-w-max w-full "
                onClick={createQuiz}
              >
                <span>
                  <HiOutlineSparkles />
                </span>
                <span className="">create</span>
              </button>
            </li>
            <li key="explore" className="text-xl mb-3">
              <Link
                href="/admin/explore"
                className={`text-base hover:font-bold duration-500 text-[#6d6d6d] flex items-center gap-2`}
              >
                <RiRoadMapLine />
                <span>Explore</span>
              </Link>
            </li>
            <li key="setting" className="text-xl mb-3">
              <button
                aria-label="log out"
                className={`text-base hover:font-bold duration-500 text-[#6d6d6d] flex items-center gap-2`}
                onClick={handlelogOut}
              >
                <PiSignOutThin />
                <span>LogOut</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-[88%] ">
          <div className="p-2 flex gap-3 items-center">
            <div className="block lg:hidden cursor-pointer">
              {isMenuOpen ? (
                <IoMdClose onClick={handleToggleMenu} />
              ) : (
                <FaBars onClick={handleToggleMenu} />
              )}
            </div>
            <div className="w-full flex bg-gray-300 rounded-lg  justify-end gap-5 items-center px-5 py-2">
              <button
                aria-label="enter code"
                className={`text-base hover:font-bold duration-500 text-cyan500`}
              >
                <Link href="/start">Enter Code</Link>
              </button>
              <h1 className="text-base hover:font-bold duration-500 flex items-center gap-2 text-cyan500 cursor-pointer">
                <span className=" hidden lg:block">{user}</span>
                <span className="text-[22px]">
                  <CgProfile />
                </span>
              </h1>
            </div>
          </div>
          <div className="w-full bg-gray-300 max-h-[675px] min-h-[675px] ">
            <div className="flex justify-center items-start overflow-y-scroll">
              <div className="w-[60%] my-4 bg-white min-h-[200px] rounded-sm p-3">
                <div className="flex justify-between items-start ">
                  <div className="flex justify-start items-start gap-2">
                    <Zoom>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHH8mepO4avVq5NJFuruMoqN02xAqm5Jk7IryH9iVuNw&s"
                        alt=""
                        className="w-[120px] h-[120px] rounded-[2px]"
                      />
                    </Zoom>
                    <div>
                      <div className="flex gap-1 items-start justify-start ">
                        <p className="text-[11px] text-[#6d6d6d] uppercase">
                          Quiz
                        </p>
                        <div className="px-[6px] text-[#BC0835] text-[10px] bg-[#fcdbe3] rounded-full uppercase">
                          <p>draft</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center group cursor-pointer my-1 text-xl min-h-12 ">
                        {editTitle ? (
                          <>
                            <h1 className="text-[16px]">
                              {name ? name : "Untitled Quiz"}
                            </h1>
                            <div
                              className="text-[16px] cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] p-[2px] border-[1px] border-[#E5E5E5] rounded-[4px]"
                              onClick={handleEditTitle}
                            >
                              <RiPencilFill />
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="title"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                setShowWarning(e.target.value === "");
                              }}
                              autoFocus
                              className="outline outline-[1px] outline-gray-500 rounded"
                              style={{ padding: "2px 6px" }}
                            />
                            <button
                              className="text-[16px] cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] p-[8px] border-[1px] border-[#E5E5E5] rounded-[4px]"
                              onClick={handleSaveTitle}
                              disabled={name === ""}
                            >
                              <FaSave />
                            </button>
                          </>
                        )}
                      </div>
                      {showWarning && (
                        <p className="text-red-500 text-[12px] flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="-mt-px h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Name should have atleast 4 characters
                        </p>
                      )}
                      <div>
                        <div className="flex gap-1 items-center cursor-pointer my-1 text-[12px] text-[#424242]">
                          <div className="flex gap-1 items-center min-w-[95px]">
                            <div>
                              <PiGraduationCapDuotone />
                            </div>
                            <p>4th - 5th grade</p>
                          </div>
                          <div className="items-center mx-2 flex">
                            <div className="w-1 h-1 rounded-full bg-[#b6b6b6]"></div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <div>
                              <MdBook />
                            </div>
                            <p>Mathematics</p>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center cursor-pointer my-1 text-[12px] text-[#424242]">
                          <div className="flex gap-1 items-center min-w-[95px]">
                            <div>
                              <BsBullseye />
                            </div>
                            <p>0% accuracy</p>
                          </div>
                          <div className="items-center mx-2 flex">
                            <div className="w-1 h-1 rounded-full bg-[#b6b6b6]"></div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <div>
                              <CiPlay1 />
                            </div>
                            <p>0 plays</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-[16px] cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] p-[2px] border-[1px] border-[#E5E5E5] rounded-[4px]">
                      <IoIosSettings />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2 items-center">
                    <div className="min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] flex justify-center items-center rounded-full bg-[#82199d]">
                      <p className="text-white">
                        {user ? user.charAt(0).toUpperCase() : "Q"}
                      </p>
                    </div>
                    <div className="flex justify-start flex-col">
                      <p className="text-[12px] text-[#222222]">
                        {user ? user : "Guest"}
                      </p>
                      <p className="text-[#6d6d6d] text-[11px]">41min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 py-1 px-4 bg-[#0909090d] text-[#222222] text-[14px] rounded cursor-pointer"
                      onClick={handleContinueEditing}
                    >
                      <span>
                        <BiSolidEdit />
                      </span>
                      <span>Edit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-start">
              <div className="w-[60%]">
                <div className="flex items-center gap-1">
                  <button
                    className="flex items-center justify-center gap-1 px-7.5 py-2.5 text-lg font-semibold h-10 base bg-[#8e51bb] hover:bg-[#a574c8]  text-white  rounded-lg primary min-w-max flex-2 mb-4 md:mb-0 w-2/3 mr-1 flex-2 "
                    onClick={handleContinueEditing}
                  >
                    <span>
                      <BiSolidEdit />
                    </span>
                    <span>Continue Editing</span>
                  </button>
                  <button
                    className=" flex  items-center justify-center px-7.5 py-2.5 text-lg font-semibold q-shadow mb-1 h-10 text-[#222222] border border-solid border-dark-6 bg-[#ffffff] hover:bg-[#f9f9f9] rounded-lg white relative min-w-max flex-1 md:mb-0 w-1/2 ml-1 "
                    onClick={handleDeleteDraft}
                  >
                    <span>
                      <MdDelete />
                    </span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-start my-5">
              <div className="w-[60%]">
                <div className="flex items-center mb-5 justify-between">
                  <div className="flex items-center gap-1 text-[#222222]">
                    <p>
                      <IoIosList />
                    </p>
                    <p>0 questions</p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-[12px] cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] px-[12px] py-[2px] border-[1px] border-[#E5E5E5] 
                    rounded-[4px] mx-1 select-none"
                    onClick={handleShowAnswers}
                  >
                    {hideAnswers ? (
                      <>
                        <FaRegEye />
                        <p>show answers</p>
                      </>
                    ) : (
                      <>
                        <FaRegEyeSlash />
                        <p>Hide answers</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="max-h-[340px] pb-5 overflow-scroll">
                  {dummyQuestions.map((questionsData) => {
                    return (
                      <div key={questionsData.id}>
                        <div className="w-full bg-white mb-2 p-4 rounded-[4px] cursor-pointer group">
                          <div className="flex w-full items-center mb-3 justify-between">
                            <div className="flex gap-1 px-[2px] py-[6px] text-[12px] items-center">
                              <TiTick />
                              <p>{questionsData.qType}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-100 group-hover:opacity-0 transition-opacity">
                              <button
                                aria-label=""
                                type="button"
                                className="text-black select-none text-[12px] bg-[#0909090D] font-medium rounded-[4px] px-3  
                                      py-[4px] 
                                      text-center cursor-pointer"
                              >
                                <p className="flex gap-1 items-center">
                                  <span className="text-[12px] cursor-pointer">
                                    <IoMdTime />
                                  </span>
                                  <span>60 Sec</span>
                                </p>
                              </button>
                              <button
                                aria-label=""
                                type="button"
                                className="text-black select-none text-[12px] bg-[#0909090D] font-medium rounded-[4px] px-3 
                                      py-[4px] 
                                      text-center cursor-pointer"
                              >
                                <p className="flex gap-1 items-center">
                                  <span className="text-[12px] cursor-pointer">
                                    <IoIosCheckmarkCircleOutline />
                                  </span>
                                  <span>4 Points</span>
                                </p>
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3 flex-col justify-start items-start">
                            <div>
                              <p className="text-[14px] font-light">
                                {questionsData.question.text}
                              </p>
                            </div>
                            <div className="w-full">
                              {!hideAnswers && (
                                <p className="text-[12px] font-light text-[#6D6D6D] mb-1">
                                  Answer choices
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-y-2 gap-x-1 w-full">
                                {questionsData.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-0.5 items-start w-full text-[#222222] text-[14px]"
                                  >
                                    <div className="flex items-center gap-1">
                                      {!hideAnswers &&
                                        (Array.isArray(
                                          questionsData.correctAnswers
                                        ) ? (
                                          questionsData.correctAnswers.includes(
                                            index
                                          ) ? (
                                            <p>
                                              <TiTick
                                                style={{ color: "green" }}
                                              />
                                            </p>
                                          ) : (
                                            <p>
                                              <AiOutlineClose
                                                style={{ color: "red" }}
                                              />
                                            </p>
                                          )
                                        ) : index ===
                                          parseInt(
                                            questionsData.correctAnswers
                                          ) ? (
                                          <p>
                                            <TiTick
                                              style={{ color: "green" }}
                                            />
                                          </p>
                                        ) : (
                                          <p>
                                            <AiOutlineClose
                                              style={{ color: "red" }}
                                            />
                                          </p>
                                        ))}
                                      <p>{option.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Draft;
