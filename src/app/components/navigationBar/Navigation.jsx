/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Code from "../modal/Code";
import { LiaShareAltSolid } from "react-icons/lia";
import { RxActivityLog } from "react-icons/rx";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setRoomData } from "@/redux/roomSlice.js";
import ProviderStore from "@/redux/ProviderStore";
import { RecoilRoot } from "recoil";
import { setCookie, getCookie, hasCookie } from "cookies-next";

const Navigation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);
  const nav = useRouter();
  const dispatch = useDispatch();

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalCode = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const userId = getCookie("user_id");
    setUserId(userId);
    const userLoggedIn = getCookie("isUserLoggedIn");
    setUserLoggedIn(userLoggedIn);
  }, []);
  const userName = "";

  const CodeValidate = async () => {
    if (userLoggedIn) {
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
            quizsound: res.Quiz_Sound,
            userId,
            userName,
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
      } catch (error) {}
    } else {
      nav.push(`/login`);
    }
  };

  const handleRoom = () => {
    if (code !== "") {
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
    setCode("");
  };

  return (
    <ProviderStore>
      <Code isOpen={isModalOpen} onClose={closeModal}>
        <div className=" flex w-full font-Montserrat justify-center flex-col items-center mt-5">
          <input
            className=" placeholder:text-black font-bold block bg-white border border-cyan-300 rounded-md py-3 px-7 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[46px] w-full mb-4 font-[Montserrat]"
            placeholder="Enter Code"
            type="number"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            aria-label="join game"
            onClick={() => handleRoom()}
            type="button"
            className="text-white font-bold  h-[47px] px-4 rounded-md text-lg flex justify-center items-center w-full bg-lightBlack font-[Montserrat] dark:bg-cyan500"
          >
            Join Game
          </button>
        </div>
      </Code>
      <div
        className="fixed sm:hidden z-50 w-full h-16 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-cyan-600 bottom-0 left-1/2 
        dark:bg-gray-700 "
      >
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
          <Link
            href="/"
            className="inline-flex flex-col items-center justify-center px-5   group"
          >
            <button
              aria-label="home"
              data-tooltip-target="tooltip-home"
              type="button"
            >
              <svg
                className="w-5 h-5 mb-1 text-white  group-hover:text-[rgb(255,255,0)] dark:group-hover:text-[rgb(255,255,0)]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="sr-only font-[Montserrat]">Home</span>
            </button>
          </Link>
          {/* <Link
            href={isLoggedIn ? "/activity" : "/login"}
            className="inline-flex flex-col items-center justify-center px-5  group"
          >
            <button data-tooltip-target="tooltip-wallet" type="button">
              <RxActivityLog className="w-6 h-6 mb-1 text-white  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
              <span className="sr-only">Activity</span>
            </button>
          </Link> */}
          <div
            className="flex items-center justify-center"
            onClick={openModalCode}
          >
            <button
              aria-label="enter code"
              data-tooltip-target="tooltip-new"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 font-medium bg-[rgb(255,255,0)] rounded-full 
              hover:bg-[rgb(255,255,0)]"
            >
              <svg
                className="w-4 h-4 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 1v16M1 9h16"
                />
              </svg>
              <span className="sr-only font-[Montserrat]">New item</span>
            </button>
          </div>
          {/* <Link
            href="/refer"
            className="inline-flex flex-col items-center justify-center px-5  group"
          >
            <button data-tooltip-target="tooltip-settings" type="button">
              <LiaShareAltSolid className="w-8 h-8 mb-1 text-white  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
              <span className="sr-only">Refer</span>
            </button>
          </Link> */}
          <Link
            href={userLoggedIn ? "/profile" : "/login"}
            className="inline-flex flex-col items-center justify-center px-5 group"
          >
            <button
              aria-label="profile"
              data-tooltip-target="tooltip-profile"
              type="button"
            >
              <svg
                className="w-6 h-6 mb-1 text-white  group-hover:text-[rgb(255,255,0)] dark:group-hover:text-[rgb(255,255,0)]500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <span className="sr-only font-[Montserrat]">Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </ProviderStore>
  );
};

export default Navigation;
