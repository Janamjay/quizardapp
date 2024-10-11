/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client";
import { useState, useEffect } from "react";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Otp = ({ isOpen, onClose, otpData, onSubmit }) => {
  const [closing, setClosing] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showResendButton, setShowResendButton] = useState(false);
  const [userOTP, setUserOTP] = useState("");
  const nav = useRouter();

  const data = {
    mobile: otpData.mobile,
    refferal_code: otpData.refferal,
    otp: userOTP,
    user_id: otpData.user_id,
    email: otpData.email,
  };

  const timeToSend = () => {
    let interval;
    interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setShowResendButton(true);
          clearInterval(interval);
        }
      });
    }, 1000);
    return interval;
  };

  useEffect(() => {
    let intervalId;
    if (isOpen) {
      intervalId = timeToSend();
    }
    return () => clearInterval(intervalId);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimer(30);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  const handleRegister = async () => {
    if (userOTP === "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please enter the OTP.",
      });
    }
    try {
      const userDataResponse = await fetch("/api/verify_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const response = await userDataResponse.json();

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
        icon: "success",
        title: response,
      }).then(() => {
        nav.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } catch (error) {
      const errorMessage = error.response?.message || "An error occurred";
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
        title: errorMessage,
      });
    }
  };

  const handleResend = () => {
    setShowResendButton(false);
    setTimer(30);
    timeToSend();
    // console.log("trigger");
    onSubmit();
  };

  return (
    <div
      className={`fixed font-Montserrat z-[100] ${
        isOpen ? "block" : "hidden"
      }  top-0 left-0 w-full h-[85vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50`}
    >
      <div
        className={`bg-white dark:bg-grey800 absolute p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%] md:w-[25%]  ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        <div>
          <h1 className="font-black text-lg font-[Montserrat] dark:text-white">
            Enter OTP
          </h1>
          <div className=" flex w-full justify-center flex-col items-center mt-5">
            <input
              className=" placeholder:text-black font-bold block bg-white border border-cyan-300 rounded-md py-3 px-7 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[46px] w-full mb-0"
              placeholder="Enter OTP"
              type="text"
              name="otp"
              value={userOTP}
              onChange={(e) => setUserOTP(e.target.value)}
            />
            <div className="my-3 text-[15px] sm:text-[14px] font-[Montserrat] w-full select-none">
              <p>
                Didn't received OTP?
                <span
                  className={`text-teal-900 font-black cursor-pointer ml-1 ${
                    timer > 0 ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={handleResend}
                >
                  {timer > 0 ? `Resend OTP ${timer} sec` : "Resend OTP"}
                </span>
              </p>
            </div>

            <button
              aria-label="enter otp"
              type="button"
              className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
          shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full font-[Montserrat]  mt-3"
              onClick={handleRegister}
            >
              Enter OTP
            </button>
          </div>
          <button
            aria-label="close icon"
            className="px-4 pb-2 pt-3 text-black rounded absolute top-0 right-0 z-100"
            onClick={handleClose}
          >
            <AiOutlineClose
              className="text-black font-[Montserrat] dark:text-white"
              style={{
                fontWeight: "bolder",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
