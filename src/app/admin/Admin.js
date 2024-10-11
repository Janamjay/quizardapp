/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { FaBars } from "react-icons/fa6";
import QuizData from "@/app/components/coursal/QuizData";
import Swal from "sweetalert2";

const Admin = ({ userName, dashboardData }) => {
  const nav = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = useState("");

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
          className={`min-h-screen border-2 border-r-gray-400 ${
            isMenuOpen ? "block w-[35%] " : "hidden lg:block w-[15%] "
          }`}
        >
          <h1 className="text-xl sm:text-4xl font-bold cursor-pointer font-Lollipop text-quizard-style pt-2 pb-[1rem] pl-4 flex items-center justify-start text-cyan500">
            <Link href="/">Quizard</Link>
          </h1>
          <ul className="flex flex-col items-start py-3 px-7">
            <li>
              <button
                aria-label="create quiz"
                type="button"
                className="text-lg font-bold flex items-center -ml-[14px] sm:ml-0 gap-2 justify-center text-white bg-[#FF5B61] h-[40px] px-2.5 rounded-lg mb-5 "
                onClick={createQuiz}
              >
                <span>
                  <IoMdAddCircleOutline />
                </span>
                <span className="h-[31px]">create</span>
              </button>
            </li>
            <li key="explore" className="text-xl mb-3">
              <Link
                href="/admin/explore"
                className={`text-base hover:font-bold duration-500 text-cyan500 `}
              >
                Explore
              </Link>
            </li>
            {/* <li key="my_quiz" className="text-xl mb-3">
              <Link
                href="/admin/myquiz"
                className={`text-base hover:font-bold duration-500 text-cyan500 `}
              >
                My Quiz
              </Link>
            </li> */}
            {/* <li key="reports" className="text-xl mb-3">
              <Link
                href="/admin/reports"
                className={`text-base hover:font-bold duration-500 text-cyan500 `}
              >
                Reports
              </Link>
            </li>
            <li key="setting" className="text-xl mb-3">
              <Link
                href="/admin/setting"
                className={`text-base hover:font-bold duration-500 text-cyan500 `}
              >
                Setting
              </Link>
            </li> */}
            <li key="setting" className="text-xl mb-3">
              <button
                aria-label="log out"
                className={`text-base hover:font-bold duration-500 text-cyan500 `}
                onClick={handlelogOut}
              >
                LogOut
              </button>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-[85%] ">
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
          <div className="w-full bg-gray-300 max-h-[675px] overflow-y-scroll">
            <QuizData dashboardData={dashboardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
